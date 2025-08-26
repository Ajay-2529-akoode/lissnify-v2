from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.utils.timezone import now, timedelta
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db.models import Count
from rest_framework import generics, permissions, status

from api.models import Seeker, Listener
from chat_api.models import Message
from .serializers import UserSerializer, UserRegisterSerializer

import random

User = get_user_model()


# ✅ Dashboard summary counts (Admin Only)
class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        total_users = User.objects.count()
        total_seekers = Seeker.objects.count()
        total_listeners = Listener.objects.count()

        # Active users in last 24 hrs
        active_users = User.objects.filter(last_login__gte=now() - timedelta(days=1)).count()

        return Response({
            "total_users": total_users,
            "total_seekers": total_seekers,
            "total_listeners": total_listeners,
            "active_users": active_users,
        })


# ✅ Chart: User growth (last 7 days) (Admin Only)
class UserGrowthChartView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        today = now().date()
        growth_data = []

        for i in range(7):
            day = today - timedelta(days=i)
            count = User.objects.filter(date_joined__date=day).count()
            growth_data.append({"date": day.strftime("%Y-%m-%d"), "count": count})

        return Response({"user_growth": list(reversed(growth_data))})


# ✅ Chart: Active users by messages sent (last 7 days) (Admin Only)
class ActiveUsersChartView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        today = now().date()
        chart_data = []

        for i in range(7):
            day = today - timedelta(days=i)
            active_count = (
                Message.objects.filter(timestamp__date=day)
                .values("author")
                .distinct()
                .count()
            )
            chart_data.append({"date": day.strftime("%Y-%m-%d"), "active_users": active_count})

        return Response({"active_users_chart": list(reversed(chart_data))})


# ✅ List all users
class UserListView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer


# ✅ Retrieve single user by ID
class UserDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer


# ✅ Create a new user (with OTP email)
class CreateUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request):
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                otp = random.randint(100000, 999999)
                receiver_email = serializer.validated_data.get("email")

                send_mail(
                    subject='Your OTP Code',
                    message=f'Your OTP is: {otp}',
                    from_email=None,  # Uses EMAIL_HOST_USER from settings.py
                    recipient_list=[receiver_email],
                    fail_silently=False,
                )
            except Exception as e:
                return Response(
                    {"error": f"Failed to send verification email: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

            serializer.save(otp=str(otp))
            return Response(
                {"message": "OTP sent to your email. Please verify your account."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Update user details
class UpdateUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def put(self, request, u_id):
        try:
            user = User.objects.get(u_id=u_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ (Optional) Delete user
class DeleteUserView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def delete(self, request, u_id):
        try:
            user = User.objects.get(u_id=u_id)
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
