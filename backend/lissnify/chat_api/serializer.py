# chat_api/serializers.py

from rest_framework import serializers
from .models import ChatRoom, Message, MessageReadStatus


class MessageSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    author_full_name = serializers.CharField(source="author.full_name", read_only=True)
    is_read = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ["id", "author_username", "author_full_name", "content", "timestamp", "is_read"]

    
    
    def get_is_read(self, obj):
        request_user = self.context["request"].user

    # If current user is the sender → check if ALL recipients have read
        if obj.author == request_user:
            participants = obj.room.participants.exclude(pk=request_user.pk)  # ✅ use pk instead of id
            read_count = MessageReadStatus.objects.filter(
            message=obj, user__in=participants
            ).count()
            return read_count == participants.count()

    # If current user is a recipient → optional, usually False until marked read
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
        user = getattr(request, "user", None)

        if user and user.is_authenticated:
            read_message_ids = MessageReadStatus.objects.filter(
                user=user,
                message__room=obj
            ).values_list('message_id', flat=True)

            unread_count = Message.objects.filter(
                room=obj
            ).exclude(
                id__in=read_message_ids
            ).exclude(
                author=user  # don’t count own messages
            ).count()

            return unread_count
        return 0
