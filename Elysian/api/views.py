# myapp/views.py
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import OTPSerializer, UserRegisterSerializer, UserLoginSerializer
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random
from .models import User,Seeker,Listener


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

class  LoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            if user.status is True:
                print("User is not verified")
                return Response({"message": "Login successful", "token": user.token})
            else:
                return Response({"message": "Verify your email first"}, status=status.HTTP_403_FORBIDDEN)
               
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OTPView(APIView):
    def post(self, request):
        otp = request.data.get("otp")
        email = request.data.get("email")

        if not otp or not email:
            return Response({"message": "OTP and email are required"}, status=status.HTTP_400_BAD_REQUEST)

        # Serialize & validate
        serializer = OTPSerializer(data=request.data)
        print("OTPView data:", serializer.is_valid(), serializer.errors)
        if serializer.is_valid():
            # Find the user

            user = serializer.validated_data['user']
            if(user.user_type=='seeker'):
                seeker = Seeker.objects.create(u_id_id=user.u_id)
                if(seeker):
                    user.status = True  # Or any other status flag you want
                    user.otp = None         # Clear OTP after verification
                    user.save()
                    return Response({"message": "Seeker registered successfully", "seeker_id": seeker.s_id}, status=status.HTTP_201_CREATED)
            elif(user.user_type=='listener'):
                print("11")
                listener = Listener.objects.create(u_id_id=user.u_id)
                if(listener):
                    user.status = True
                    user.otp = None  # Clear OTP after verification
                    user.save()
                    return Response({"message": "Listener registered successfully", "listener_id": listener.l_id}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Unable to create User"}, status=status.HTTP_400_BAD_REQUEST)
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


class SelectCategory(APIView):
    def post(self,request):
        string=request.headers['Authorization']
        token=string.split(' ')[1]
        user = User.objects.get(token=token)
        # if not user:
        #     return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        # else:


        # category = request.data.get("category")
        

        # if not category:
        #     return Response({"message": "Category is required"}, status=status.HTTP_400_BAD_REQUEST)

        # # Save the selected category to the user's profile
        # user.profile.category = category
        # user.profile.save()

        return Response({"message": "Category selected successfully"}, status=status.HTTP_200_OK)