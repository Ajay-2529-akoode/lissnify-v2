# myapp/serializers.py
from rest_framework import serializers
from .models import User
import uuid
import hashlib
from django.contrib.auth.hashers import check_password
from .models import User, Seeker, Listener,Connections
from .models import Listener

class UserRegisterSerializer(serializers.ModelSerializer):
    preferences = serializers.ListField(
        child=serializers.IntegerField(), 
        write_only=True, 
        required=False
    )
    class Meta:
        model = User
        fields = ['username', 'email', 'password','otp','status','user_type','preferences','DOB']
        extra_kwargs = {'otp': {'read_only': True}, 'status': {'read_only': True}}

    def create(self, validated_data):
        preferences_data = validated_data.pop('preferences', [])
        # hash password before saving
        validated_data['password'] = hashlib.sha256(validated_data['password'].encode()).hexdigest()
        validated_data['token'] = str(uuid.uuid4())
        user=User.objects.create(**validated_data)
        user.temp_preferences = preferences_data
        user.save()
        return user

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




class OTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        """
        Custom validation to check OTP and user status.
        """
        email = data.get("email")
        otp = data.get("otp")
        
        # 1. Find the user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP or email.")

        # 2. Check if the user is already active
        if user.status is True:
            raise serializers.ValidationError("This account has already been verified.")
            
        # 3. Check if the OTP is correct
        if user.otp != otp:
            raise serializers.ValidationError("Invalid OTP or email.")
        
        # 4. Attach the validated user object to the data for use in the view
        data['user'] = user
        return data
    
class ListenerSerializer(serializers.ModelSerializer):

    # This field gets the username from the related User model
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Listener
        # Use the correct field names from your models.py
        fields = ['l_id', 'username']    

class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ConnectionSerializer(serializers.ModelSerializer):
    """
    Serializes a Connection object to show the participants and the connection status.
    """
    # We use the UserSummarySerializer to show nested details about the seeker and listener.
    # The `source` argument tells the serializer to follow the foreign key relationship
    # from Connection -> Seeker -> User.
    seeker = UserSummarySerializer(source='seeker.user', read_only=True)
    listener = UserSummarySerializer(source='listener.user', read_only=True)
    
    # This creates a custom, read-only field whose value is determined by the `get_status` method below.
    status = serializers.SerializerMethodField()

    class Meta:
        model = Connections
        fields = ['id', 'seeker', 'listener', 'status', 'created_at']

    def get_status(self, obj):
        """
        This method takes a Connection object ('obj') and returns a simple string
        representing its current state.
        """
        if obj.pending:
            return "Pending"
        if obj.accepted:
            return "Accepted"
        if obj.rejected:
            return "Rejected"
        return "Unknown"        