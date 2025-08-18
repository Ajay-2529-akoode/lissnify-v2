# myapp/serializers.py
from rest_framework import serializers
from .models import User
import uuid
import hashlib

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['u_name', 'email', 'password','otp','status']
        extra_kwargs = {'otp': {'read_only': True}, 'status': {'read_only': True}}

    def create(self, validated_data):
        # hash password before saving
        validated_data['password'] = hashlib.sha256(validated_data['password'].encode()).hexdigest()
        validated_data['token'] = str(uuid.uuid4())
        return User.objects.create(**validated_data)


class UserLoginSerializer(serializers.Serializer):
    u_name = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        hashed_pw = hashlib.sha256(data['password'].encode()).hexdigest()
        try:
            user = User.objects.get(u_name=data['u_name'], password=hashed_pw)
            return user
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid username or password")

class OTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        """
        Custom validation to check OTP and user status.
        """
        email = data.get("email")
        otp = data.get("otp")

        # 1. Find the user by email first.
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Keep error messages generic to prevent user enumeration attacks.
            raise serializers.ValidationError("Invalid OTP or email.")

        # 2. Check if the user is already verified.
        # This logic comes from your `elif user.status == True` check.
        if user.status is True:
            # This validation error will result in a 400 Bad Request.
            # You can handle the specific message in your view if needed.
            raise serializers.ValidationError("This user has already been verified.")

        # 3. Check if the provided OTP matches the one in the database.
        # This logic comes from your `if user.otp != otp` check.
        if user.otp != otp:
            raise serializers.ValidationError("Invalid OTP or email.")
        
        # If all checks pass, attach the user object to the validated data.
        # This makes it easy to access the user in your view without another query.
        data['user'] = user
        return data