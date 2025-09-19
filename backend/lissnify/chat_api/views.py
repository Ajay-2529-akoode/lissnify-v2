from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from django.utils import timezone

# Import models from both apps
from .models import ChatRoom, Message, MessageReadStatus
from api.models import Seeker, Listener, Connections
from .serializer import ChatRoomSerializer, MessageSerializer, MessageReadStatusSerializer


class StartDirectChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        recipient_id = request.data.get('recipient_id')
        if not recipient_id:
            return Response({"error": "'recipient_id' is required."}, status=status.HTTP_400_BAD_REQUEST)

        requester = request.user
        try:
            if Seeker.objects.filter(user=requester).exists():
                seeker_profile = Seeker.objects.get(user=requester)
                listener_profile = Listener.objects.get(user_id=recipient_id)
            else:
                listener_profile = Listener.objects.get(user=requester)
                seeker_profile = Seeker.objects.get(user_id=recipient_id)
        except (Seeker.DoesNotExist, Listener.DoesNotExist):
            return Response({"error": "Valid Seeker or Listener not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure connection exists
        if not Connections.objects.filter(seeker=seeker_profile, listener=listener_profile, accepted=True).exists():
            return Response({"error": "An accepted connection is required to start a chat."}, status=status.HTTP_403_FORBIDDEN)

        # Find or create one-to-one room
        room = ChatRoom.objects.annotate(num_participants=Count('participants')) \
                               .filter(type='one_to_one', num_participants=2) \
                               .filter(participants=seeker_profile.user) \
                               .filter(participants=listener_profile.user).first()

        if not room:
            room = ChatRoom.objects.create(type='one_to_one')
            room.participants.add(seeker_profile.user, listener_profile.user)

        serializer = ChatRoomSerializer(room, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class CommunityChatListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        community_rooms = ChatRoom.objects.filter(type='community')
        serializer = ChatRoomSerializer(community_rooms, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        name = request.data.get('name')
        if not name:
            return Response({"error": "A name is required for a community chat."}, status=status.HTTP_400_BAD_REQUEST)

        room = ChatRoom.objects.create(name=name, type='community')
        room.participants.add(request.user)
        serializer = ChatRoomSerializer(room, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MessageListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, room_id):
        if not request.user.chat_rooms.filter(id=room_id).exists():
            return Response({"error": "You are not a member of this chat room."}, status=status.HTTP_403_FORBIDDEN)

        # Fetch ordered messages - DO NOT mark as read here
        messages = Message.objects.filter(room__id=room_id).order_by("timestamp")

        # Just return the messages with their current read status
        serializer = MessageSerializer(messages, many=True, context={'request': request})
        return Response(serializer.data)


class ChatRoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        chat_rooms = ChatRoom.objects.filter(participants=user)
        serializer = ChatRoomSerializer(chat_rooms, many=True, context={'request': request})
        return Response(serializer.data)


class MarkMessagesAsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):
        """Mark all messages in a room as read for the current user"""
        if not request.user.chat_rooms.filter(id=room_id).exists():
            return Response({"error": "You are not a member of this chat room."}, status=status.HTTP_403_FORBIDDEN)

        read_message_ids = MessageReadStatus.objects.filter(
            user=request.user,
            message__room_id=room_id
        ).values_list('message_id', flat=True)

        unread_messages = Message.objects.filter(
            room_id=room_id
        ).exclude(
            id__in=read_message_ids
        ).exclude(
            author=request.user
        )

        read_statuses = []
        for message in unread_messages:
            read_status, created = MessageReadStatus.objects.get_or_create(
                message=message,
                user=request.user,
                defaults={'read_at': timezone.now()}
            )
            if created:
                read_statuses.append(read_status)

        return Response({
            "message": f"Marked {len(read_statuses)} messages as read",
            "read_count": len(read_statuses)
        }, status=status.HTTP_200_OK)


class UnreadCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get unread message counts for all chat rooms of the current user"""
        user = request.user
        chat_rooms = ChatRoom.objects.filter(participants=user)

        unread_counts = {}
        for room in chat_rooms:
            read_message_ids = MessageReadStatus.objects.filter(
                user=user,
                message__room=room
            ).values_list('message_id', flat=True)

            unread_count = Message.objects.filter(
                room=room
            ).exclude(
                id__in=read_message_ids
            ).exclude(
                author=user
            ).count()

            unread_counts[room.id] = unread_count

        return Response(unread_counts, status=status.HTTP_200_OK)
