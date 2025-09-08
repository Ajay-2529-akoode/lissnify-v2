from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated,AllowAny
from django.utils.timezone import now, timedelta
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db.models import Count
from rest_framework import generics, permissions, status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils.crypto import get_random_string
from django.conf import settings
import os
from api.models import Category
from .serializers import CategorySerializer 
from api.models import Seeker, Listener,Connections, User
from chat_api.models import ChatRoom
from chat_api.models import Message
from .serializers import SeekerSerializer, UserSerializer, UserRegisterSerializer,AdminLoginSerializer,ConnectionSerializer,ListenerSerializer 
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from .serializers import UserSerializer, UserRegisterSerializer
import random
from api.models import Blog
from django.utils.text import slugify
from .serializers import BlogSerializer
from api.models import Testimonial
from .serializers import TestimonialSerializer



        
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
    # permission_classes = [permissions.IsAdminUser]

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
        
class GetConnectionsList(APIView):
    permission_classes = [permissions.IsAdminUser]
 
    def get(self, request):
        try:
            # 1. Fetch all connections.
            # Use `prefetch_related` to optimize the query by fetching all related
            # seeker and listener user data in a minimal number of queries.
            connections = Connections.objects.prefetch_related('seeker__user', 'listener__user').all()
 
            # 2. Serialize the connections.
            # The ConnectionSerializer will handle nesting the seeker and listener details.
            serializer = ConnectionSerializer(connections, many=True)
 
            # 3. Return the single list of connection objects.
            return Response(serializer.data)
 
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CategoryListCreateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        icon_file = request.FILES.get('icon')

        # handle file upload to MEDIA_ROOT (public)
        if icon_file:
            filename_base, ext = os.path.splitext(icon_file.name)
            safe_name = f"category_{get_random_string(8)}{ext.lower()}"
            path = os.path.join('categories', safe_name)
            saved_path = default_storage.save(path, ContentFile(icon_file.read()))
            data['icon'] = saved_path  # store relative path

        serializer = CategorySerializer(data=data)
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

        data = request.data.copy()
        icon_file = request.FILES.get('icon')
        if icon_file:
            filename_base, ext = os.path.splitext(icon_file.name)
            safe_name = f"category_{get_random_string(8)}{ext.lower()}"
            path = os.path.join('categories', safe_name)
            saved_path = default_storage.save(path, ContentFile(icon_file.read()))
            data['icon'] = saved_path

        serializer = CategorySerializer(category, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        category = self.get_object(id)
        if not category:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        icon_file = request.FILES.get('icon')
        if icon_file:
            filename_base, ext = os.path.splitext(icon_file.name)
            safe_name = f"category_{get_random_string(8)}{ext.lower()}"
            path = os.path.join('categories', safe_name)
            saved_path = default_storage.save(path, ContentFile(icon_file.read()))
            data['icon'] = saved_path

        serializer = CategorySerializer(category, data=data, partial=True)
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
    
class ToggleUserActive(APIView):
    def post(self, request):
        u_id = request.data.get("u_id")
        is_active = request.data.get("is_active")

        if not u_id:
            return Response({"error": "u_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(u_id=u_id)
            user.is_active = is_active
            user.save()
            return Response(
                {"message": f"User {u_id} active status updated", "is_active": user.is_active},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)    


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"message": "Logged out (no refresh provided)."}, status=status.HTTP_200_OK)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully."}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({"message": "Logged out (invalid refresh)."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ListenerDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get_object(self, pk):
        try:
            return Listener.objects.get(pk=pk)
        except Listener.DoesNotExist:
            return None

    def get(self, request, pk):
        listener = self.get_object(pk)
        if not listener:
            return Response({"error": "Listener not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ListenerSerializer(listener)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        listener = self.get_object(pk)
        if not listener:
            return Response({"error": "Listener not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ListenerSerializer(listener, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()   # user stays same, only other fields update
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        listener = self.get_object(pk)
        if not listener:
            return Response({"error": "Listener not found"}, status=status.HTTP_404_NOT_FOUND)

        listener.delete()
        return Response({"message": "Listener deleted successfully"}, status=status.HTTP_204_NO_CONTENT)    


class BlogListCreateView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        blogs = Blog.objects.all().order_by('-date')
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()

        # Handle image upload
        image_file = request.FILES.get('image')
        if image_file:
            filename_base, ext = os.path.splitext(image_file.name)
            safe_name = f"blog_{get_random_string(8)}{ext.lower()}"
            path = os.path.join('blogs', safe_name)
            saved_path = default_storage.save(path, ContentFile(image_file.read()))
            data['image'] = saved_path

        # Generate slug
        if 'title' in data and data['title']:
            data['slug'] = slugify(data['title']) + "-" + get_random_string(5)

        serializer = BlogSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # ✅ correctly set user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlogDetailView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get_object(self, id):
        try:
            return Blog.objects.get(id=id)
        except Blog.DoesNotExist:
            return None

    def get(self, request, id):
        blog = self.get_object(id)
        if not blog:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = BlogSerializer(blog)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        blog = self.get_object(id)
        if not blog:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

        # Admin users can edit any blog
        if not request.user.is_staff:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()

        # Handle image update
        image_file = request.FILES.get('image')
        if image_file:
            filename_base, ext = os.path.splitext(image_file.name)
            safe_name = f"blog_{get_random_string(8)}{ext.lower()}"
            path = os.path.join('blogs', safe_name)
            saved_path = default_storage.save(path, ContentFile(image_file.read()))
            data['image'] = saved_path

        serializer = BlogSerializer(blog, data=data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # ✅ ensure user is saved
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, id):
        blog = self.get_object(id)
        if not blog:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

        # Admin users can edit any blog
        if not request.user.is_staff:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()

        image_file = request.FILES.get('image')
        if image_file:
            filename_base, ext = os.path.splitext(image_file.name)
            safe_name = f"blog_{get_random_string(8)}{ext.lower()}"
            path = os.path.join('blogs', safe_name)
            saved_path = default_storage.save(path, ContentFile(image_file.read()))
            data['image'] = saved_path

        serializer = BlogSerializer(blog, data=data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)  # ✅ ensure user is saved
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    TestimonialSerializer
    def delete(self, request, id):
        blog = self.get_object(id)
        if not blog:
            return Response({"error": "Blog not found"}, status=status.HTTP_404_NOT_FOUND)

        # Admin users can edit any blog
        if not request.user.is_staff:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

        blog.delete()
        return Response({"message": "Blog deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    
      #   testmonial   
    
class TestimonialViewSet(APIView):
    permission_classes = [permissions.IsAdminUser]
    def get(self, request):
        Testimonials = Testimonial.objects.all().order_by('-created_at')
        serializer = TestimonialSerializer(Testimonials, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data.copy()
        image_file = request.FILES.get('image')
        if image_file:
            filename_base, ext = os.path.splitext(image_file.name)
            safe_name = f"testimonial_{get_random_string(8)}{ext.lower()}"
            path = os.path.join('public/testimonial', safe_name)
            saved_path = default_storage.save(path, ContentFile(image_file.read()))
            data['image'] = saved_path
        serializer = TestimonialSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            testimonial = Testimonial.objects.get(pk=pk)
            testimonial.delete()
            return Response({"message": "Testimonial deleted successfully"}, status=status.HTTP_200_OK)
        except Testimonial.DoesNotExist:
            return Response({"error": "Testimonial not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            testimonial = Testimonial.objects.get(pk=pk)
        except Testimonial.DoesNotExist:
            return Response({"error": "Testimonial not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TestimonialSerializer(testimonial, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()               
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)          
  