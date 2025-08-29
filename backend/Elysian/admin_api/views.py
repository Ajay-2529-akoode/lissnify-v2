from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated,AllowAny
from django.utils.timezone import now, timedelta
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db.models import Count
from rest_framework import generics, permissions, status
from api.models import Category
from .serializers import CategorySerializer 
from api.models import Seeker, Listener,Connections, User
from chat_api.models import ChatRoom
from chat_api.models import Message
from .serializers import SeekerSerializer, UserSerializer, UserRegisterSerializer,AdminLoginSerializer,ConnectionSerializer,ListenerSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, UserRegisterSerializer
import random



class AdminLogin(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            # Save token in DB (if needed)
            user.token = access_token
            user.save(update_fields=['token'])

            return Response({
                "message": "Admin login successful",
                "refresh": str(refresh),
                "access": access_token,
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

# ✅ Dashboard summary counts (Admin Only)
class DashboardStatsView(APIView):
    """
    Provides statistics for the admin dashboard.
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # --- Core User Stats ---
        total_users = User.objects.count()
        total_seekers = Seeker.objects.count()
        total_listeners = Listener.objects.count()

        # --- Activity Stats ---
        active_users = User.objects.filter(is_active=True).count()

        # --- Connection Stats ---
        active_connections = Connections.objects.filter(accepted=True).count()
        pending_connections = Connections.objects.filter(pending=True).count()

        # --- Chat Stats ---
        total_chat_rooms = ChatRoom.objects.count()
        one_to_one_chats = ChatRoom.objects.filter(type='one_to_one').count()
        community_chats = ChatRoom.objects.filter(type='community').count()

        # --- Daily User Growth (Last 7 Days) ---
        today = now().date()
        daily_growth_data = []
        chart_data = []
        for i in range(7):
            day = today - timedelta(days=i)
            # This query counts users whose join date matches the specific day
            count = User.objects.filter(date_joined__date=day).count()
            daily_growth_data.append({"date": day.strftime("%A"), "count": count})
            chart_data.append({"date": day.strftime("%Y-%m-%d"), "active_count": (
                Message.objects.filter(timestamp__date=day)
                .values("author")
                .distinct()
                .count()
            )})
        
        
            
        # --- Final Response ---
        # Structure the data clearly for the frontend
        return Response({
            "stat_cards": {
                "total_users": total_users,
                "active_users": active_users,
                "active_connections": active_connections,
                "total_chat_rooms": total_chat_rooms,
            },
            "user_breakdown": {
                "seekers": total_seekers,
                "listeners": total_listeners,
            },
            "connection_breakdown": {
                "pending": pending_connections,
            },
            "chat_breakdown": {
                "one_to_one": one_to_one_chats,
                "community": community_chats,
            },
            "daily_user_growth": list(reversed(daily_growth_data)),
            "active_user_pie": chart_data
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
        

class CategoryListCreateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Retrieve + Update + Delete
class CategoryDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get_object(self, id):
        try:
            return Category.objects.get(id=id)
        except Category.DoesNotExist:
            return None

    def get(self, request, id):
        category = self.get_object(id)
        if not category:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        category = self.get_object(id)
        if not category:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        category = self.get_object(id)
        if not category:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
        category = self.get_object(id)
        if not category:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        category.delete()
        return Response({"message": "Category deleted successfully"}, status=status.HTTP_204_NO_CONTENT)