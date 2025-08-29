# myapp/views.py
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import OTPSerializer, UserRegisterSerializer, UserLoginSerializer
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
from .models import User,Seeker,Listener,Category,Connections
from rest_framework_simplejwt.tokens import RefreshToken,TokenError
from rest_framework.permissions import IsAuthenticated # Import IsAuthenticated
from rest_framework.permissions import AllowAny
from .serializers import ListenerSerializer
from django.core.mail import send_mail
from rest_framework import generics, permissions
from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission

# User = get_user_model() 

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

            return Response({
                "user": {
                    "id": user.u_id,
                    "name": user.username,
                    "email": user.email,
                    "status": user.status,
                    "user_type": user.user_type,
                    # Add any other fields you need
                },
                "message": "Login successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
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
        category_data = [{"id": cat.id, "name": cat.Category_name} for cat in categories]
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

        # Create a new connection
        connection = Connections.objects.create(seeker=seeker, listener=listener)
        return Response({"message": "Connection request sent."}, status=status.HTTP_201_CREATED)

class ConnectionList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            seeker = Seeker.objects.get(user=user)
        except Seeker.DoesNotExist:
            return Response({"error": "Seeker profile not found for this user."}, status=status.HTTP_404_NOT_FOUND)

        connections = (
            Connections.objects
            .filter(seeker=seeker)
            .select_related('listener__user')
        )
        data = [
            {
                "id": conn.id,
                "listener": conn.listener.user.username,
                "status": "Pending" if conn.pending else ("Accepted" if conn.accepted else ("Rejected" if conn.rejected else "Unknown"))
            }
            for conn in connections
        ]

        return Response(data, status=status.HTTP_200_OK)

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
                "username": conn.listener.user.username,  # Use .username
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
            connection_data.append({'user_id': conn.listener.user.id, 'username': conn.listener.user.username})
        for conn in received_connections:
            connection_data.append({'user_id': conn.seeker.user.id, 'username': conn.seeker.user.username})
            
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
