# myapp/views.py
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import OTPSerializer, UserRegisterSerializer, UserLoginSerializer,SeekerSerializer,UserProfileSerializer, UserProfileUpdateSerializer,ListenerProfileSerializer, NotificationSerializer, NotificationCreateSerializer, NotificationUpdateSerializer, NotificationSettingsSerializer, NotificationStatsSerializer, TestimonialSerializer, BlogLikeSerializer
import smtplib
from admin_api.serializers import BlogSerializer,Blog
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
from .models import User,Seeker,Listener,Category,Connections,Notification,NotificationSettings,Testimonial,BlogLike
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
from rest_framework.permissions import IsAuthenticated # Import IsAuthenticated
from rest_framework.permissions import AllowAny
from .serializers import ListenerSerializer
from django.core.mail import send_mail
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os
from django.utils.crypto import get_random_string

#User = get_user_model() 

class RegisterView(APIView):
     permission_classes = [AllowAny]
     def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                otp = random.randint(100000, 999999)
                receiver_email = serializer.validated_data.get("email")

                # Use Django's send_mail function for cleaner, more maintainable code
                send_mail(
                    subject='Your OTP Code',
                    message=f'Your OTP is: {otp}',
                    from_email=None,  # Uses EMAIL_HOST_USER from settings.py
                    recipient_list=[receiver_email],
                    fail_silently=False,
                )

            except Exception as e:
                print(f"Error sending email: {e}")
                return Response({"error": "Failed to send verification email."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # The serializer's .create() method handles creating the User, Profile, and Preferences
            serializer.save(otp=str(otp))
            
            return Response(
                {"message": "OTP sent to your email. Please verify your account."}, 
                status=status.HTTP_201_CREATED
            )
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]
 
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
 
        if serializer.is_valid():
            user = serializer.validated_data  # The user object from serializer.validate()
 
            # Check if the user's email is verified
            if not user.status:  # assuming status=False → email not verified
                return Response({"message": "Verify your email first"}, status=status.HTTP_403_FORBIDDEN)
 
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            user.token = access_token  
            user.save(update_fields=['token'])
            return Response({
                "user": {
                    "id": user.u_id,
                    "name": user.full_name,
                    "email": user.email,
                    "status": user.status,
                    "user_type": user.user_type,
                    # Add any other fields you need
                },
                "message": "Login successful",
                "refresh": str(refresh),
                "access": str(access_token),
            }, status=status.HTTP_200_OK)
 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class OTPView(APIView):
     permission_classes = [AllowAny]
     def post(self, request):
        # Use the serializer to handle all validation
        serializer = OTPSerializer(data=request.data)
        
        if serializer.is_valid():
            # Get the user object that the serializer found and validated
            user = serializer.validated_data['user']
            
            # Activate the user and clear the OTP
            user.is_active = True
            user.status = True  # Assuming status=True means the user is active
            user.otp = None
            user.otp_verified = True

            user_type = user.user_type
            preferences = user.temp_preferences
            
            profile = None
            # 2. CREATE the correct profile (Seeker or Listener)
            if user_type == 'seeker' or user_type == 'Seeker':
                profile = Seeker.objects.create(user=user)
            elif user_type == 'listener' or user_type == 'Listener':
                profile = Listener.objects.create(user=user)

            # 3. POPULATE the preferences on the new profile
            if profile and preferences:
                profile.preferences.set(preferences)
            
            # 4. (Optional) Clear the temporary data from the User model
            user.temp_preferences = []
            user.save()

            # Optional: Return login tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Account verified successfully.",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)
            
        # If validation fails, return the errors from the serializer
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class ForgotPassword(APIView):
    permission_classes = [AllowAny]
    def post (self,request):
        email = request.data.get("email")    
        if not email:
            return Response({"message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Do not reveal user existence
            return Response({"message": "If that address exists, an email was sent"}, status=status.HTTP_200_OK)
    
        try:
            otp = random.randint(100000, 999999)
            user.otp = str(otp)
            user.save(update_fields=["otp"])
            send_mail(
                subject='Password Reset OTP',
                message=f'Your OTP for password reset is: {otp}',
                from_email=None,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            print("Error sending email:", e)
            return Response({"error": "Failed to send email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "If that address exists, an email was sent"}, status=status.HTTP_200_OK)

class CategoryList(APIView):
    def get(self, request):
        categories = Category.objects.all().order_by('id')
        category_data = [{"id": cat.id, "name": cat.Category_name,"description":cat.description,"icon":cat.icon,"supportText":cat.supportText,"slug":cat.slug} for cat in categories]
        return Response(category_data, status=status.HTTP_200_OK)
    
class ListenersBasedOnPreference(APIView):
    # Use DRF's permission system to handle authentication.
    # This automatically rejects requests from non-logged-in users. 
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Using GET is more appropriate here since we are retrieving data, not creating it.
        user = request.user

        try:
            # 1. Get the seeker profile for the currently logged-in user.
            seeker = Seeker.objects.get(user=user)
        except Seeker.DoesNotExist:
            return Response({"error": "Seeker profile not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        # 2. Get the list of ALL preference IDs for that seeker.
        seeker_preference_ids = seeker.preferences.all().values_list('id', flat=True)

        if not seeker_preference_ids.exists():
            return Response({"message": "No preferences found for this seeker."}, status=status.HTTP_200_OK)

        # 3. Find all listeners who have at least one of those preferences.
        #    - `preferences__id__in` checks against the list of IDs.
        #    - `distinct()` ensures each listener appears only once.
        listeners = Listener.objects.filter(
            preferences__id__in=seeker_preference_ids
        ).distinct()

        # 4. Use the serializer to format the output data correctly.
        serializer = ListenerSerializer(listeners, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ConnectionRequest(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        seeker = Seeker.objects.get(user=request.user)
        listener_id = request.data.get("listener_id")

        if not listener_id:
            return Response({"error": "Listener ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            listener = Listener.objects.get(l_id=listener_id)
        except Listener.DoesNotExist:
            return Response({"error": "Listener not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if connection already exists
        try:
            existing_connection = Connections.objects.get(seeker=seeker, listener=listener)
            return Response({"error": "Connection request already sent."}, status=status.HTTP_400_BAD_REQUEST)
        except Connections.DoesNotExist:
            # Create a new connection
            connection = Connections.objects.create(seeker=seeker, listener=listener)
            return Response({"message": "Connection request sent."}, status=status.HTTP_201_CREATED)

class ConnectionList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            # Case 1: User is Seeker
            seeker = Seeker.objects.get(user=user)
            connections = (
                Connections.objects
                .filter(seeker=seeker)
                .select_related('listener__user')
            )

            data = []
            for conn in connections:
                listener = conn.listener
                data.append({
                    "connection_id": conn.id,
                    "user_id": listener.user.u_id,
                    "full_name": listener.user.full_name,
                    "role": "Listener",
                    "status":conn.get_status(),
                    "listener_profile": ListenerSerializer(listener).data,
                    "listener_user": {
                        "id": listener.user.u_id,
                        "full_name": listener.user.full_name,
                        "email": listener.user.email,
                    },
                })

            return Response(data, status=status.HTTP_200_OK)

        except Seeker.DoesNotExist:
            try:
                # Case 2: User is Listener
                listener = Listener.objects.get(user=user)
                connections = (
                    Connections.objects
                    .filter(listener=listener)
                    .select_related('seeker__user')
                )

                data = []
                for conn in connections:
                    seeker = conn.seeker
                    data.append({
                        "connection_id": conn.id,
                        "user_id": seeker.user.u_id,
                        "full_name": seeker.user.full_name,
                        "role": "Seeker",
                        "status": conn.get_status(),
                        "seeker_profile": SeekerSerializer(seeker).data,
                        "seeker_user": {
                            "id": seeker.user.u_id,
                            "full_name": seeker.user.full_name,
                            "email": seeker.user.email,
                        },
                    })

                return Response(data, status=status.HTTP_200_OK)

            except Listener.DoesNotExist:
                return Response(
                    {"error": "No Seeker or Listener profile found for this user."},
                    status=status.HTTP_404_NOT_FOUND,
                )

class AcceptConnection(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        connection_id = request.data.get("connection_id")
        action = request.data.get("action")

        # 1. Validate that both required fields are present
        if not connection_id or not action:
            return Response(
                {"error": "Connection ID and action ('accept' or 'reject') are required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Get the connection, ensuring the current user is the listener
        try:
            connection = Connections.objects.get(id=connection_id, listener__user=request.user)
        except Connections.DoesNotExist:
            return Response(
                {"error": "Connection not found or you are not authorized to respond."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # 3. Check if the connection is still pending
        if not connection.pending:
            return Response(
                {"error": "This connection request has already been responded to."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4. Process the action
        if action == "accept":
            connection.pending = False
            connection.accepted = True
            connection.rejected = False # Ensure rejected is false
            connection.save()
            return Response({"message": "Connection accepted."}, status=status.HTTP_200_OK)
            
        elif action == "reject":
            connection.pending = False
            connection.accepted = False
            connection.rejected = True
            connection.save()
            return Response({"message": "Connection rejected."}, status=status.HTTP_200_OK)
            
        else:
            # 5. Handle invalid actions
            return Response({"error": "Invalid action. Must be 'accept' or 'reject'."}, status=status.HTTP_400_BAD_REQUEST)
        
class AcceptedListSeeker(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            seeker = Seeker.objects.get(user=user)
        except Seeker.DoesNotExist:
            return Response({"error": "Seeker profile not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        # Get all connections where the current user is the seeker
        connections = Connections.objects.filter(seeker=seeker, accepted=True)

        friend_list = []
        for conn in connections:
            friend_list.append({
                "id": conn.listener.l_id,
                "full_name": conn.listener.user.full_name,  # Use .full_name
                "status": "Accepted"
            })

        return Response(friend_list, status=status.HTTP_200_OK)      

# from .serializers import ConnectionSerializer # You'll need a simple ConnectionSerializer

class AcceptedConnectionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Find connections where the user is either the seeker or the listener
        sent_connections = Connections.objects.filter(seeker__user=request.user, accepted=True)
        received_connections = Connections.objects.filter(listener__user=request.user, accepted=True)

        # We'll just serialize the user on the other end of the connection
        connection_data = []
        for conn in sent_connections:
            connection_data.append({'user_id': conn.listener.user.id, 'full_name': conn.listener.user.full_name})
        for conn in received_connections:
            connection_data.append({'user_id': conn.seeker.user.id, 'full_name': conn.seeker.user.full_name})
            
        return Response(connection_data, status=status.HTTP_200_OK)  

class TestAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "This is a test response."}, status=status.HTTP_200_OK)
class LogoutView(APIView):
    permission_classes = [IsAuthenticated] # Ensures only authenticated users can logout

    def post(self, request):
        try:
            # Get the refresh token from the request body
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token not provided."}, status=status.HTTP_400_BAD_REQUEST)

            # Create a RefreshToken instance from the token string
            token = RefreshToken(refresh_token)
            
            # Blacklist the token
            token.blacklist()

            return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        
        except TokenError as e:
            # This exception is raised if the token is invalid or expired
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Catch any other unexpected errors
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# Import AllowAny
# ... your other imports for Listener and ListenerSerializer

class ListenerListCreateView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """
        This method is now open to everyone.
        """ 
         # Fetch all listeners with related user and preferences to minimize queries
        listeners = Listener.objects.select_related('user').prefetch_related('preferences').all()
        serializer = ListenerSerializer(listeners, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        # Check if category_id or slug is provided
        if 'category_id' in request.data:
            category_id = request.data.get("category_id")
            # Try to filter by ID first, then by slug if ID fails
            try:
                # Try to convert to integer for ID lookup
                category_id_int = int(category_id)
                listeners = Listener.objects.filter(preferences__id=category_id_int).distinct()
            except (ValueError, TypeError):
                # If conversion fails, try slug lookup
                listeners = Listener.objects.filter(preferences__slug=category_id).distinct()
        
            # Optimize the query to prevent N+1 issues
            listeners = listeners.select_related('user').prefetch_related('preferences')

            serializer = ListenerSerializer(listeners, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif 'listener_id' in request.data:
            listener_id = request.data.get("listener_id")

            try:
                # Also optimize this single object lookup
                listener = Listener.objects.select_related('user').prefetch_related('preferences').get(l_id=listener_id)
            except Listener.DoesNotExist:
                return Response({"error": "Listener not found."}, status=status.HTTP_404_NOT_FOUND)

            serializer = ListenerSerializer(listener)
            return Response(serializer.data, status=status.HTTP_200_OK)
    
        else:
            # Handle the case where neither key is provided
            return Response(
                {"error": "Please provide either a 'category_id' or 'listener_id'."},
                status=status.HTTP_400_BAD_REQUEST
            )

class getConnectionListForListener(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            # Ensure the user is a listener
            listener = Listener.objects.get(user=user)
        except Listener.DoesNotExist:
            return Response({"error": "Listener profile not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        # Get all connections where the current user is the listener
        connections = Connections.objects.filter(listener=listener)
        print("sss",connections)
        friend_list = []
        for conn in connections:
            friend_list.append({
                "id": conn.id,
                "user_id": conn.seeker.user.u_id,  # Add user ID for chat functionality
                "full_name": conn.seeker.user.full_name,  # Use .full_name
                "status": "Accepted" if conn.accepted else "Pending" if conn.pending else "Rejected"
            })

        return Response(friend_list, status=status.HTTP_200_OK)   
    
# ---------------- User Profile API Views ----------------
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get current user's profile with listener data"""
        serializer = UserProfileSerializer(request.user)
    
        try:
            listener_data = Listener.objects.get(user_id=request.user.u_id)
            listener_serialized = {
            "l_id": listener_data.l_id,
            "description": listener_data.description,
            "rating": listener_data.rating,
        }
        except Listener.DoesNotExist:
            listener_serialized = None

        combined_data = {
        "user": serializer.data,
        "listener": listener_serialized
        }

        return Response(combined_data, status=status.HTTP_200_OK)

    
    def put(self, request):
        """Update current user's profile"""
        profile_image = request.FILES.get('image')
        data = request.data.copy()
        print("data",data)
        if profile_image:
            filename_base, ext = os.path.splitext(profile_image.name)
            safe_name = f"profile_{get_random_string(8)}{ext.lower()}"
            path = os.path.join('public/profile', safe_name)
            saved_path = default_storage.save(path, ContentFile(profile_image.read()))
            data['profile_image'] = saved_path
        serializer = UserProfileUpdateSerializer(request.user,data=data, partial=True)    
        if serializer.is_valid():
            serializer.save()

            description = data.get("description")
            print("eeeee",description)
            if description is not None:
                Listener_data = Listener.objects.get(user_id=request.user.u_id)
                Listener_data.description = description
                Listener_data.save()

            # Return updated profile
            profile_serializer = UserProfileSerializer(request.user)
            return Response({
                "message": "Profile updated successfully",
                "user": profile_serializer.data
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
 
class BlogCreateView(APIView):
    def get(self,request):
        blogs = Blog.objects.all().order_by('-date')
        serializer = BlogSerializer(blogs, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class BlogDetailBySlugView(APIView):
    def get(self, request, slug):
        try:
            print(slug)
            blog = Blog.objects.get(slug=slug)
            serializer = BlogSerializer(blog, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

class ListenerProfile(APIView):
    permission_classes = [IsAuthenticated]   # ✅ fixed typo

    def get(self, request):
        user = request.user
        listener = Listener.objects.get(user=user)   # ✅ fixed variable name
        serializer = ListenerProfileSerializer(listener)    # ✅ serialize the object
        return Response(serializer.data, status=status.HTTP_200_OK)

# ---------------- Notification API Views ----------------
class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get all notifications for the current user"""
        notifications = Notification.objects.filter(recipient=request.user)
        
        # Filter by notification type if provided
        notification_type = request.query_params.get('type')
        if notification_type:
            notifications = notifications.filter(notification_type=notification_type)
        
        # Filter by read status if provided
        is_read = request.query_params.get('is_read')
        if is_read is not None:
            notifications = notifications.filter(is_read=is_read.lower() == 'true')
        
        # Pagination
        page_size = int(request.query_params.get('page_size', 20))
        page = int(request.query_params.get('page', 1))
        start = (page - 1) * page_size
        end = start + page_size
        
        notifications = notifications[start:end]
        serializer = NotificationSerializer(notifications, many=True)
        
        return Response({
            'notifications': serializer.data,
            'page': page,
            'page_size': page_size,
            'total': Notification.objects.filter(recipient=request.user).count()
        }, status=status.HTTP_200_OK)

class NotificationDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, notification_id):
        """Get a specific notification"""
        try:
            notification = Notification.objects.get(id=notification_id, recipient=request.user)
            serializer = NotificationSerializer(notification)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, notification_id):
        """Mark notification as read/unread"""
        try:
            notification = Notification.objects.get(id=notification_id, recipient=request.user)
            serializer = NotificationUpdateSerializer(notification, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, notification_id):
        """Delete a notification"""
        try:
            notification = Notification.objects.get(id=notification_id, recipient=request.user)
            notification.delete()
            return Response({'message': 'Notification deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)

class NotificationMarkAllReadView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Mark all notifications as read for the current user"""
        updated_count = Notification.objects.filter(
            recipient=request.user, 
            is_read=False
        ).update(is_read=True)
        
        return Response({
            'message': f'{updated_count} notifications marked as read'
        }, status=status.HTTP_200_OK)

class NotificationStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get notification statistics for the current user"""
        user_notifications = Notification.objects.filter(recipient=request.user)
        
        stats = {
            'total_notifications': user_notifications.count(),
            'unread_notifications': user_notifications.filter(is_read=False).count(),
            'message_notifications': user_notifications.filter(notification_type='message').count(),
            'connection_notifications': user_notifications.filter(notification_type__in=['connection_request', 'connection_accepted', 'connection_rejected']).count(),
            'system_notifications': user_notifications.filter(notification_type='system').count(),
        }
        
        serializer = NotificationStatsSerializer(stats)
        return Response(serializer.data, status=status.HTTP_200_OK)

class NotificationSettingsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get notification settings for the current user"""
        settings, created = NotificationSettings.objects.get_or_create(user=request.user)
        serializer = NotificationSettingsSerializer(settings)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def put(self, request):
        """Update notification settings for the current user"""
        settings, created = NotificationSettings.objects.get_or_create(user=request.user)
        serializer = NotificationSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CreateMessageNotificationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Create a message notification (used by chat system)"""
        serializer = NotificationCreateSerializer(data=request.data)
        if serializer.is_valid():
            # Check if user has message notifications enabled
            settings, created = NotificationSettings.objects.get_or_create(user=request.data['recipient'])
            if not settings.message_notifications:
                return Response({'message': 'Message notifications disabled for this user'}, status=status.HTTP_200_OK)
            
            notification = serializer.save()
            response_serializer = NotificationSerializer(notification)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TestNotificationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Create a test notification for debugging"""
        try:
            # Create a test notification for the current user
            notification = Notification.objects.create(
                recipient=request.user,
                notification_type='message',
                title='Test Notification',
                message='This is a test notification to verify the system is working',
                chat_room_id=1,
                message_id=1
            )
            
            serializer = NotificationSerializer(notification)
            return Response({
                'message': 'Test notification created successfully',
                'notification': serializer.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'error': f'Failed to create test notification: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

class TestimonialView(APIView):
    permission_classes = [AllowAny]  # Allow public access to view testimonials
    
    def get(self, request):
        """Get all testimonials"""
        testimonials = Testimonial.objects.all().order_by('-created_at')
        serializer = TestimonialSerializer(testimonials, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        """Create a new testimonial (requires authentication)"""
        # For creating testimonials, we might want to require authentication
        # Change permission_classes to [IsAuthenticated] if needed
        serializer = TestimonialSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TestimonialDetailView(APIView):
    permission_classes = [AllowAny]  # Allow public access to view individual testimonials
    
    def get(self, request, pk):
        """Get a specific testimonial by ID"""
        try:
            testimonial = Testimonial.objects.get(pk=pk)
            serializer = TestimonialSerializer(testimonial)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Testimonial.DoesNotExist:
            return Response({"error": "Testimonial not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request, pk):
        """Update a testimonial (requires authentication)"""
        # For updating testimonials, we might want to require authentication
        # Change permission_classes to [IsAuthenticated] if needed
        try:
            testimonial = Testimonial.objects.get(pk=pk)
        except Testimonial.DoesNotExist:
            return Response({"error": "Testimonial not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = TestimonialSerializer(testimonial, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Delete a testimonial (requires authentication)"""
        # For deleting testimonials, we might want to require authentication
        # Change permission_classes to [IsAuthenticated] if needed
        try:
            testimonial = Testimonial.objects.get(pk=pk)
            testimonial.delete()
            return Response({"message": "Testimonial deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Testimonial.DoesNotExist:
            return Response({"error": "Testimonial not found"}, status=status.HTTP_404_NOT_FOUND)

# ---------------- Blog Like API Views ----------------
class BlogLikeView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, blog_id):
        """Like a blog post"""
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if user already liked this blog
        like, created = BlogLike.objects.get_or_create(
            user=request.user,
            blog=blog
        )
        
        if created:
            return Response({
                "message": "Blog liked successfully",
                "like_count": blog.likes.count(),
                "is_liked": True
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                "message": "Blog already liked",
                "like_count": blog.likes.count(),
                "is_liked": True
            }, status=status.HTTP_200_OK)
    
    def delete(self, request, blog_id):
        """Unlike a blog post"""
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            like = BlogLike.objects.get(user=request.user, blog=blog)
            like.delete()
            return Response({
                "message": "Blog unliked successfully",
                "like_count": blog.likes.count(),
                "is_liked": False
            }, status=status.HTTP_200_OK)
        except BlogLike.DoesNotExist:
            return Response({
                "message": "Blog not liked by user",
                "like_count": blog.likes.count(),
                "is_liked": False
            }, status=status.HTTP_200_OK)

class BlogLikeToggleView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, blog_id):
        """Toggle like status for a blog post"""
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
        
        like, created = BlogLike.objects.get_or_create(
            user=request.user,
            blog=blog
        )
        
        if created:
            # Blog was liked
            return Response({
                "message": "Blog liked successfully",
                "like_count": blog.likes.count(),
                "is_liked": True
            }, status=status.HTTP_201_CREATED)
        else:
            # Blog was already liked, so unlike it
            like.delete()
            return Response({
                "message": "Blog unliked successfully",
                "like_count": blog.likes.count(),
                "is_liked": False
            }, status=status.HTTP_200_OK)

class BlogLikesListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, blog_id):
        """Get all likes for a specific blog"""
        try:
            blog = Blog.objects.get(id=blog_id)
        except Blog.DoesNotExist:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
        
        likes = BlogLike.objects.filter(blog=blog).select_related('user')
        serializer = BlogLikeSerializer(likes, many=True)
        
        return Response({
            "blog_id": blog_id,
            "blog_title": blog.title,
            "like_count": likes.count(),
            "likes": serializer.data
        }, status=status.HTTP_200_OK)

