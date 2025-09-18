# chat_api/serializers.py

from rest_framework import serializers
from .models import ChatRoom, Message, MessageReadStatus

class MessageSerializer(serializers.ModelSerializer):
    author_full_name = serializers.CharField(source='author.full_name', read_only=True)
    author_username = serializers.CharField(source='author.full_name', read_only=True)  # Keep for backward compatibility
    is_read = serializers.SerializerMethodField()
    
    class Meta:
        model = Message
        fields = ['id', 'author_full_name', 'author_username', 'content', 'timestamp', 'is_read']
    
    def get_is_read(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return MessageReadStatus.objects.filter(message=obj, user=request.user).exists()
        return False

class MessageReadStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageReadStatus
        fields = ['id', 'message', 'user', 'read_at']

class ChatRoomSerializer(serializers.ModelSerializer):
    participants = serializers.StringRelatedField(many=True, read_only=True)
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'type', 'participants', 'created_at', 'unread_count']
    
    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Count messages in this room that the current user hasn't read
            read_message_ids = MessageReadStatus.objects.filter(
                user=request.user,
                message__room=obj
            ).values_list('message_id', flat=True)
            
            unread_count = Message.objects.filter(
                room=obj
            ).exclude(
                id__in=read_message_ids
            ).exclude(
                author=request.user  # Don't count own messages as unread
            ).count()
            
            return unread_count
        return 0