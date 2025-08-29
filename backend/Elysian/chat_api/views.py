# chat_api/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count

# Import models from both apps
from .models import ChatRoom, Message
from api.models import Seeker, Listener, Connections
from .serializer import ChatRoomSerializer,MessageSerializer


class StartDirectChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # The API now expects a generic 'recipient_id'
        recipient_id = request.data.get('recipient_id')
        if not recipient_id:
            return Response({"error": "'recipient_id' is required."}, status=status.HTTP_400_BAD_REQUEST)

        requester_user = request.user
        seeker_profile = None
        listener_profile = None
        
        # Determine the roles of the two participants
        try:
            # Case 1: The person making the request is a Seeker
            seeker_profile = Seeker.objects.get(user=requester_user)
            print("Seeker Profile:", seeker_profile)
           
            # In this case, the recipient must be a Listener
            listener_profile = Listener.objects.get(user_id=recipient_id)
            print("Listener Profile:", listener_profile)
           
        except Seeker.DoesNotExist:
            # Case 2: The person making the request is a Listener
            try:
                listener_profile = Listener.objects.get(user=requester_user)
                # In this case, the recipient must be a Seeker
                # NOTE: Replace 's_id' with the actual primary key of your Seeker model if different
                seeker_profile = Seeker.objects.get(user_id=recipient_id) 
            except (Listener.DoesNotExist, Seeker.DoesNotExist):
                return Response({"error": "Valid Seeker or Listener profile not found for one or both users."}, status=status.HTTP_404_NOT_FOUND)
        
        except Listener.DoesNotExist:
             return Response({"error": "The specified recipient was not found."}, status=status.HTTP_404_NOT_FOUND)

        # --- From this point on, the logic is the same for everyone ---

        # 1. Check if an accepted connection exists between the identified Seeker and Listener
        if not Connections.objects.filter(seeker=seeker_profile, listener=listener_profile, accepted=True).exists():
            return Response({"error": "An accepted connection is required to start a chat."}, status=status.HTTP_403_FORBIDDEN)

        # 2. Find the existing one-to-one chat room between the two users
        # This query works regardless of who started the chat
        room = ChatRoom.objects.annotate(num_participants=Count('participants')) \
                               .filter(type='one_to_one', num_participants=2) \
                               .filter(participants=seeker_profile.user) \
                               .filter(participants=listener_profile.user).first()

        # 3. If no room exists, create one
        if not room:
            room = ChatRoom.objects.create(type='one_to_one')
            room.participants.add(seeker_profile.user, listener_profile.user)

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
    

