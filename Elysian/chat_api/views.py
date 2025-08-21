# chat_api/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count

# Import models from both apps
from .models import ChatRoom, Message
from api.models import Seeker, Listener, Connections

# Import serializers
from .serializers import ChatRoomSerializer, MessageSerializer

class StartDirectChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        listener_id = request.data.get('listener_id')
        try:
            seeker = Seeker.objects.get(user=request.user)
            listener = Listener.objects.get(l_id=listener_id)
        except (Seeker.DoesNotExist, Listener.DoesNotExist):
            return Response({"error": "Invalid seeker or listener."}, status=status.HTTP_404_NOT_FOUND)

        if not Connections.objects.filter(seeker=seeker, listener=listener, accepted=True).exists():
            return Response({"error": "You must have an accepted connection to start a chat."}, status=status.HTTP_403_FORBIDDEN)

        room = ChatRoom.objects.annotate(num_participants=Count('participants')) \
                                .filter(type='one_to_one', participants=seeker.user, num_participants=2) \
                                .filter(participants=listener.user).first()

        if not room:
            room = ChatRoom.objects.create(type='one_to_one')
            room.participants.add(seeker.user, listener.user)

        serializer = ChatRoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_200_OK)

class CommunityChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        community_rooms = ChatRoom.objects.filter(type='community')
        serializer = ChatRoomSerializer(community_rooms, many=True)
        return Response(serializer.data)

    def post(self, request):
        name = request.data.get('name')
        if not name:
            return Response({"error": "A name is required for a community chat."}, status=status.HTTP_400_BAD_REQUEST)

        room = ChatRoom.objects.create(name=name, type='community')
        room.participants.add(request.user)
        serializer = ChatRoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        if not request.user.chat_rooms.filter(id=room_id).exists():
            return Response({"error": "You are not a member of this chat room."}, status=status.HTTP_403_FORBIDDEN)
            
        messages = Message.objects.filter(room__id=room_id)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)