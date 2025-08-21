# chat_api/serializers.py

from rest_framework import serializers
from .models import ChatRoom, Message

class MessageSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'author_username', 'content', 'timestamp']

class ChatRoomSerializer(serializers.ModelSerializer):
    participants = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = ChatRoom
        fields = ['id', 'name', 'type', 'participants', 'created_at']