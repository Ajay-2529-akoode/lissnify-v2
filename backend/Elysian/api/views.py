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
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated # Import IsAuthenticated
from .serializers import ListenerSerializer
from django.core.mail import send_mail

 

class RegisterView(APIView):
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
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            print("Login serializer is valid")
            user = serializer.validated_data # The user object is returned from validate()

            # Check if the user's email is verified
            if user.status is False: # Assuming status=False means not verified
                 return Response({"message": "Verify your email first"}, status=status.HTTP_403_FORBIDDEN)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            user.token = access_token  
            user.save(update_fields=['token'])
            return Response({
                "message": "Login successful",
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OTPView(APIView):
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
            
            user_type = user.user_type
            preferences = user.temp_preferences
            
            profile = None
            # 2. CREATE the correct profile (Seeker or Listener)
            if user_type == 'seeker':
                profile = Seeker.objects.create(user=user)
            elif user_type == 'listener':
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
    def post (self,request):
        email = request.data.get("email")    
        if email is None:
            return Response({"message": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
          
        user = User.objects.get(email=email)
        if user is None:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
        try:
            otp = random.randint(100000, 999999)
            sender_email = "devakoode@gmail.com"
            sender_password = "dqixhlddcbwsbgjx"
            receiver_email = email

            # Create the email
            message = MIMEMultipart()
            message["From"] = sender_email
            message["To"] = receiver_email
            message["Subject"] = "Password Reset OTP"
            body = f"Your OTP for password reset is: {otp}"
            message.attach(MIMEText(body, "plain"))

            # Connect to SMTP server and send email
            server = smtplib.SMTP("smtp.gmail.com", 587)
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, message.as_string())
            server.quit()
        except Exception as e:
            print("Error sending email:", e)
            return Response({"error": "Failed to send email"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)

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

        connections = Connections.objects.filter(seeker=seeker)
        connection_data = []
        for conn in connections:
            print(conn)
    # --- CORRECTED LOGIC ---
            status_ = "Unknown" # Default status
            if conn.pending:
                status_ = "Pending"
            elif conn.accepted:
                status_ = "Accepted"
            elif conn.rejected:
                status_ = "Rejected"
    # -----------------------

        connection_data.append({
        "id": conn.id,
        "listener": conn.listener.user.username,  # Use .username
        "status": status_
        })

        return Response(connection_data, status=status.HTTP_200_OK)

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

# api/views.py
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