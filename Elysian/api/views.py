# myapp/views.py
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import OTPSerializer, UserRegisterSerializer, UserLoginSerializer
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
from .models import User,Seeker,Listener,Category
from rest_framework_simplejwt.tokens import RefreshToken

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            print("Serializer is valid")
            try:
                otp = random.randint(100000, 999999)
                sender_email = "devakoode@gmail.com"
                sender_password = "dqixhlddcbwsbgjx"
                receiver_email = serializer.validated_data.get("email")

                # Create the email
                message = MIMEMultipart()
                message["From"] = sender_email
                message["To"] = receiver_email
                message["Subject"] = "Your OTP Code"
                body = f"Your OTP is: {otp}"  # Replace with actual OTP generation logic
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
            serializer.save(otp=str(otp))  # Save OTP in the user model
            return Response({"message": "OTP sent successfully"}, status=status.HTTP_200_OK)
        print("Serializer errors:", serializer.errors)
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
        otp = request.data.get("otp")
        email = request.data.get("email")

        if not otp or not email:
            return Response({"message": "OTP and email are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Serialize & validate
        serializer = OTPSerializer(data=request.data)
        
        if serializer.is_valid():
            # Find the user
            print("OTPView data:", serializer.validated_data['user'].user_type)
            user = serializer.validated_data['user']
            if(user.user_type=='seeker'):
                seeker = Seeker.objects.create(u_id_id=user.u_id)
                if(seeker):
                    user.status = True  # Or any other status flag you want
                    user.otp = None         # Clear OTP after verification
                    user.save()
                    return Response({"message": "Seeker registered successfully", "seeker_id": seeker.s_id}, status=status.HTTP_201_CREATED)
            elif(user.user_type=='listener'):
                
                listener = Listener.objects.create(u_id_id=user.u_id)
                if(listener):
                    user.status = True
                    user.otp = None  # Clear OTP after verification
                    user.save()
                    return Response({"message": "Listener registered successfully", "listener_id": listener.l_id}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            # return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)

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