# myapp/serializers.py
from rest_framework import serializers
from .models import User, Seeker, Listener, Connections
import uuid
import hashlib
from django.contrib.auth.hashers import check_password


# ---------------- User Register ----------------
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
            'status': {'read_only': True}
        }

    def create(self, validated_data):
        preferences_data = validated_data.pop('preferences', [])
        # hash password before saving
        validated_data['password'] = hashlib.sha256(
            validated_data['password'].encode()
        ).hexdigest()
        validated_data['token'] = str(uuid.uuid4())
        user = User.objects.create(**validated_data)
        user.temp_preferences = preferences_data
        user.save()
        return user


# ---------------- User Login ----------------
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        hashed_pw = hashlib.sha256(data['password'].encode()).hexdigest()
        try:
            user = User.objects.get(username=data['username'], password=hashed_pw)
            return user
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid username or password")


# ---------------- OTP Verify ----------------
class OTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data.get("email")
        otp = data.get("otp")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP or email.")

        if user.status is True:
            raise serializers.ValidationError("This account has already been verified.")

        if user.otp != otp:
            raise serializers.ValidationError("Invalid OTP or email.")

        data['user'] = user
        return data


# ---------------- Listener ----------------
class ListenerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Listener
        fields = ['l_id', 'username']


# ---------------- User Summary ----------------
class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


# ---------------- Connections ----------------
class ConnectionSerializer(serializers.ModelSerializer):
    seeker = UserSummarySerializer(source='seeker.user', read_only=True)
    listener = UserSummarySerializer(source='listener.user', read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Connections
        fields = ['id', 'seeker', 'listener', 'status', 'created_at']

    def get_status(self, obj):
        if obj.pending:
            return "Pending"
        if obj.accepted:
            return "Accepted"
        if obj.rejected:
            return "Rejected"
        return "Unknown"



