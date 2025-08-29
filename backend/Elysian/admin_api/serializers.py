from rest_framework import serializers
from django.contrib.auth import get_user_model
from api.models import User, Seeker, Listener, Connections, Category
import uuid
import hashlib


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        hashed_pw = hashlib.sha256(data['password'].encode()).hexdigest()
        try:
            user = User.objects.get(username=data['username'], password=hashed_pw)
            if not user.is_superuser:
                raise serializers.ValidationError("User is not an admin.")
            return user
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

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
            'u_id', 'username', 'email', 'user_type', 'status', 'temp_preferences','otp_verified'
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
            'user_type', 'preferences', 'DOB',
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


# api/serializers.py



class SeekerSerializer(serializers.ModelSerializer):
    # Get the username from the related User model
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Seeker
        fields = ['s_id', 'username']


class ListenerSerializer(serializers.ModelSerializer):
    # Get the username from the related User model
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Listener
        fields = ['l_id', 'username']          
