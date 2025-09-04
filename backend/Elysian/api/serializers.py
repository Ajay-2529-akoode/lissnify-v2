# myapp/serializers.py
from rest_framework import serializers
from .models import User, Seeker, Listener, Connections,Category
import uuid
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
            'user_type', 'preferences', 'DOB', 'is_superuser','is_staff'
        ]
        extra_kwargs = {
            'otp': {'read_only': True},
            'status': {'read_only': True}
        }

    def create(self, validated_data):
        preferences_data = validated_data.pop('preferences', [])
        raw_password = validated_data.pop('password')
        validated_data['token'] = str(uuid.uuid4())
        user = User(**validated_data)
        user.set_password(raw_password)
        user.save()
        user.temp_preferences = preferences_data
        user.save(update_fields=["temp_preferences"])
        return user


# ---------------- User Login ----------------
class UserLoginSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField()
 
    def validate(self, data):
        try:
            # Try login with username
            user = User.objects.get(username=data['username_or_email'])
        except User.DoesNotExist:
            try:
                # Try login with email
                user = User.objects.get(email=data['username_or_email'])
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid username/email or password")
 
        # Check password using Django's built-in method
        if not user.check_password(data['password']):
            raise serializers.ValidationError("Invalid username/email or password")

        return user


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
    preferences = serializers.SlugRelatedField(
        many=True,
        slug_field='Category_name',
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



