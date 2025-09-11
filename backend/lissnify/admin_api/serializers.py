from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import check_password
from api.models import User, Seeker, Listener, Connections,Category, Blog, Testimonial
import uuid
import hashlib



class AdminLoginSerializer(serializers.Serializer):
    # Accept either username_or_email or username to be backward compatible
    username_or_email = serializers.CharField(required=False, allow_blank=True)
    username = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField()

    def validate(self, data):
        credential = data.get('username_or_email') or data.get('username')
        if not credential:
            raise serializers.ValidationError({"username": "This field is required."})

        raw_password = data['password']

        # Try username first, then email
        try:
            user = User.objects.get(username=credential)
        except User.DoesNotExist:
            try:
                user = User.objects.get(email=credential)
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid credentials")

        # Accept either Django-hashed password or legacy SHA256 stored value
        hashed_pw = hashlib.sha256(raw_password.encode()).hexdigest()
        if not (check_password(raw_password, user.password) or user.password == hashed_pw):
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_superuser:
            raise serializers.ValidationError("User is not an admin.")

        return user

# ✅ Admin view serializer
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'u_id',
            'username',
            'email',
            'user_type',
            'is_staff',
            'is_active',
            
        ]


# ✅ Dashboard stats (cards)
class DashboardStatsSerializer(serializers.Serializer):
    total_users = serializers.IntegerField()
    total_seekers = serializers.IntegerField()
    total_listeners = serializers.IntegerField()
    active_users = serializers.IntegerField()


# ✅ General user serializer (Admin table view)
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'u_id',
            'username',
            'email',
            'user_type',
            'status',          # email/otp verified status boolean
            'user_status',     # textual status e.g., active/suspended
            'is_active',       # Django active flag
            'is_staff',
            'is_superuser',
            'DOB',
            'otp_verified',
            'temp_preferences',
        ]


# ✅ Update user role/status
class UserRoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['u_id', 'user_type', 'status']
        extra_kwargs = {
            'u_id': {'read_only': True},
            'user_type': {'required': True},
            'status': {'required': False},
            'prefrerences': {'required': True},
        }


# ✅ User registration (Admin creates user)
class UserRegisterSerializer(serializers.ModelSerializer):
    preferences = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = User
        fields = [
            'u_id', 'username', 'email', 'password', 'otp', 'status',
            'user_type', 'preferences', 'DOB','is_superuser','is_staff'
        ]
        extra_kwargs = {
            'otp': {'read_only': True},
            'status': {'read_only': True},
            'password': {'write_only': True},  # prevent leaking password
        }

    def create(self, validated_data):
        preferences_data = validated_data.pop('preferences', [])

        # ✅ Hash password
        validated_data['password'] = hashlib.sha256(
            validated_data['password'].encode()
        ).hexdigest()

        # ✅ Generate token
        validated_data['token'] = str(uuid.uuid4())
        user = User.objects.create(**validated_data)

        # Temporary store preferences if needed
        user.temp_preferences = preferences_data
        user.save()
        return user


# ✅ Minimal serializer for deletion confirmation
class UserDeleteSerializer(serializers.Serializer):
    message = serializers.CharField()

class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['u_id', 'username']

class ConnectionSerializer(serializers.ModelSerializer):
    """
    This serializer correctly nests the seeker and listener user details
    and provides a clean status string.
    """
    # This tells the serializer to use UserSummarySerializer for these fields.
    # The `source` argument follows the relationship: Connection -> Seeker -> User.
    seeker = UserSummarySerializer(source='seeker.user', read_only=True)
    listener = UserSummarySerializer(source='listener.user', read_only=True)
    
    # This creates a custom, read-only field whose value is determined by the `get_status` method.
    status = serializers.SerializerMethodField()

    class Meta:
        model = Connections
        # The fields list now includes the nested objects and the custom status.
        fields = ['id', 'seeker', 'listener', 'status', 'created_at']

    def get_status(self, obj):
        """
        This method returns a simple string for the connection's state.
        """
        if obj.pending:
            return "Pending"
        if obj.accepted:
            return "Accepted"
        if obj.rejected:
            return "Rejected"
        return "Unknown"

class SeekerSerializer(serializers.ModelSerializer):
    # Get the username from the related User model
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Seeker
        fields = ['s_id', 'username']


class ListenerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    preferences = serializers.SlugRelatedField(
        many=True,
        slug_field='name',
        queryset=Category.objects.all()
    )

    class Meta:
        model = Listener
        fields = [
            'l_id',
            'description',
            'language',
            'rating',
            'created_at',
            'username',
            'preferences',
        ]
         

class UserDeleteSerializer(serializers.Serializer):
    message = serializers.CharField()

class CategorySerializer(serializers.ModelSerializer):
    icon = serializers.CharField(required=False, allow_null=True, allow_blank=True)

    class Meta:
        model = Category
        fields = ['id', 'Category_name', 'description', 'slug', 'icon', 'meta_title', 'meta_description']
        extra_kwargs = {
            'slug': {'required': False, 'allow_null': True},
            'icon': {'required': False, 'allow_null': True},
            'description': {'required': False, 'allow_null': True},
            'meta_title': {'required': False, 'allow_null': True},
            'meta_description': {'required': False, 'allow_null': True},
        }

class BlogSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True
    )
    image = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    category = CategorySerializer(read_only=True)
    user = serializers.StringRelatedField(read_only=True)  # show username/email instead of just id

    class Meta:
        model = Blog
        fields = [
            'id',
            'title',
            'slug',
            'image',
            'category',
            'category_id',
            'description',
            'date',
            'meta_title',
            'meta_description',
            'user'
        ]
        read_only_fields = ['slug', 'date', 'user']

class TestimonialSerializer(serializers.ModelSerializer):
    image = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    class Meta:
        model = Testimonial
        fields = [
            'name',
            'role',
            'image',
            'rating',
            'feedback'
        ]