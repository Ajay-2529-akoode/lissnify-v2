# myapp/serializers.py
from rest_framework import serializers
from .models import User, Seeker, Listener, Connections, Category, Notification, NotificationSettings, Testimonial, BlogLike, CommunityPost, CommunityPostLike, CommunityPostComment, Rating
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
            'u_id', 'full_name', 'email', 'password', 'otp', 'status',
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
            # Try login with full_name
            user = User.objects.get(full_name=data['username_or_email'])
        except User.DoesNotExist:
            try:
                # Try login with email
                user = User.objects.get(email=data['username_or_email'])
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid full name/email or password")
 
        # Check password using Django's built-in method
        if not user.check_password(data['password']):
            raise serializers.ValidationError("Invalid full name/email or password")
 
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
 
# ---------------- User Summary ----------------
class UserSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['u_id', 'full_name','email','profile_image']
 
# ---------------- Listener ----------------
class ListenerSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True) 
    full_name = serializers.CharField(source='user.full_name', read_only=True)
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
            'full_name',
            'user',
            'preferences'
        ]
 
class SeekerSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)
 
    class Meta:
        model = Seeker
        fields = [
            's_id',
            'user',
            'user_id',
        ]
        read_only_fields = ['s_id', 'user']
    user = UserSummarySerializer(read_only=True)  # Nested serialization of related user
 
    class Meta:
        model = Seeker
        fields = [
            's_id',
            'user',
            'user_id',
              # example extra field
            # include other fields relevant to your model
        ]
        read_only_fields = ['id', 'user']
 
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
        
# ---------------- User Profile Serializer ----------------
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'u_id', 'full_name', 'email', 'first_name', 'last_name', 
            'DOB', 'user_type', 'user_status', 'date_joined','profile_image'
        ]
        read_only_fields = ['u_id', 'email', 'date_joined']  # Email cannot be changed

    def update(self, instance, validated_data):
        # Only allow updating specific fields
        allowed_fields = ['full_name', 'first_name', 'last_name', 'DOB', 'user_status','profile_image']
        for field in allowed_fields:
            if field in validated_data:
                setattr(instance, field, validated_data[field])
        
        instance.save()
        return instance

# ---------------- User Profile Update Serializer ----------------
class UserProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'first_name', 'last_name', 'DOB','profile_image']
        
    def validate_full_name(self, value):
        # Check if full_name is already taken by another user
        if User.objects.filter(full_name=value).exclude(pk=self.instance.pk).exists():
            raise serializers.ValidationError("Full name already exists")
        return value


class ListenerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listener
        fields = '__all__'      

# ---------------- Notification Serializers ----------------
class NotificationSerializer(serializers.ModelSerializer):
    sender_full_name = serializers.CharField(source='sender.full_name', read_only=True)
    recipient_full_name = serializers.CharField(source='recipient.full_name', read_only=True)
    
    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'sender', 'notification_type', 'title', 'message',
            'is_read', 'created_at', 'updated_at', 'chat_room_id', 'message_id',
            'sender_full_name', 'recipient_full_name'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'recipient', 'sender', 'notification_type', 'title', 'message',
            'chat_room_id', 'message_id'
        ]

class NotificationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['is_read']

class NotificationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationSettings
        fields = [
            'message_notifications', 'connection_notifications', 
            'system_notifications', 'email_notifications', 'push_notifications'
        ]

class NotificationStatsSerializer(serializers.Serializer):
    total_notifications = serializers.IntegerField()
    unread_notifications = serializers.IntegerField()
    message_notifications = serializers.IntegerField()
    connection_notifications = serializers.IntegerField()
    system_notifications = serializers.IntegerField()

# ---------------- Testimonial Serializer ----------------
class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'name', 'role', 'rating', 'feedback', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

# ---------------- Blog Like Serializer ----------------
class BlogLikeSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)
    
    class Meta:
        model = BlogLike
        fields = ['id', 'user', 'blog', 'created_at']
        read_only_fields = ['id', 'created_at']

# ---------------- Community Post Serializers ----------------
class CommunityPostCommentSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    
    class Meta:
        model = CommunityPostComment
        fields = ['id', 'author', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class CommunityPostSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    category_name = serializers.CharField(source='category.Category_name', read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    comments = CommunityPostCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = CommunityPost
        fields = [
            'id', 'author', 'post_type', 'title', 'content', 'category', 
            'category_name', 'created_at', 'updated_at', 'is_verified',
            'likes_count', 'comments_count', 'is_liked', 'comments'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

class CommunityPostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommunityPost
        fields = ['title', 'content', 'category', 'post_type']
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

class CommunityPostLikeSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)
    
    class Meta:
        model = CommunityPostLike
        fields = ['id', 'user', 'post', 'created_at']
        read_only_fields = ['id', 'created_at']

# ---------------- Rating Serializers ----------------
class RatingSerializer(serializers.ModelSerializer):
    seeker_name = serializers.CharField(source='seeker.user.full_name', read_only=True)
    seeker_avatar = serializers.CharField(source='seeker.user.profile_image', read_only=True)
    
    class Meta:
        model = Rating
        fields = [
            'id', 'seeker', 'listener', 'rating', 'feedback', 
            'created_at', 'updated_at', 'seeker_name', 'seeker_avatar'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'seeker_name', 'seeker_avatar']

class RatingCreateSerializer(serializers.ModelSerializer):
    listener_id = serializers.CharField(write_only=True)  # Accept listener_id from frontend
    
    class Meta:
        model = Rating
        fields = ['listener_id', 'rating', 'feedback']
    
    def validate_listener_id(self, value):
        try:
            listener = Listener.objects.get(l_id=value)
            return listener
        except Listener.DoesNotExist:
            raise serializers.ValidationError("Listener not found")
    
    def validate_rating(self, value):
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def validate_feedback(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Feedback must be at least 10 characters long")
        if len(value) > 500:
            raise serializers.ValidationError("Feedback must not exceed 500 characters")
        return value.strip()
    
    def create(self, validated_data):
        # Get the seeker from the authenticated user
        user = self.context['request'].user
        try:
            seeker = Seeker.objects.get(user=user)
        except Seeker.DoesNotExist:
            raise serializers.ValidationError("Only seekers can rate listeners")
        
        # Extract listener from validated_data and rename it
        listener = validated_data.pop('listener_id')
        validated_data['listener'] = listener
        validated_data['seeker'] = seeker
        
        return super().create(validated_data)

class RatingStatsSerializer(serializers.Serializer):
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    total_reviews = serializers.IntegerField()
    rating_distribution = serializers.DictField()