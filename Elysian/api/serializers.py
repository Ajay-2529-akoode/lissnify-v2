# myapp/serializers.py
from rest_framework import serializers
from .models import User
import uuid
import hashlib
from django.contrib.auth.hashers import check_password

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['u_name', 'email', 'password','otp','status','user_type']
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
        try:
            user = User.objects.get(email=email)
            print(user.status, user.otp)
        except User.DoesNotExist:
           
            raise serializers.ValidationError("Invalid OTP or email.")
        if user.status is True:
            
            raise serializers.ValidationError("This user has already been verified.")
        if user.otp != otp:
            raise serializers.ValidationError("Invalid OTP or email.")
        
        data['user'] = user
        return data