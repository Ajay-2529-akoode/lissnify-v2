from rest_framework import serializers
from django.contrib.auth import get_user_model
from api.models import User, Seeker, Listener, Connections
import uuid
import hashlib

User = get_user_model()


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
            'u_id', 'username', 'email', 'user_type', 'status', 'prefrerences'
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
