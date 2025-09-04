import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, ChatRoom
from api.models import User


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("\n--- WebSocket: connect() method initiated ---")

        # Extract room_id from URL route
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope["user"]

        print(f"User: {self.user}, Attempting to connect to room: {self.room_id}")

        # Authentication & participation check
        if not self.user.is_authenticated:
            print("--- WebSocket: Anonymous user tried to connect. Closing connection. ---")
            await self.close()
            return

        print("--> STEP 1: Checking user participation (database query)...")
        is_participant = await self.is_user_participant(self.user, self.room_id)
        print(f"<-- ...Database check complete. Is participant: {is_participant}")

        if not is_participant:
            print("--- WebSocket: User is NOT in this chat room. Closing connection. ---")
            await self.close()
            return

        # Add to group
        print("--> STEP 2: Adding channel to Redis group...")
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        print("<-- ...Added to Redis group.")

        # Accept connection
        print("--> STEP 3: Accepting connection...")
        await self.accept()
        print("--- WebSocket: Connection ACCEPTED successfully. ---")

    async def disconnect(self, close_code):
        # Remove from group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"--- WebSocket disconnected. Code: {close_code} ---")

    async def receive(self, text_data):
        """
        Handles messages received from WebSocket client
        """
        try:
            text_data_json = json.loads(text_data)
            message_content = text_data_json.get("message", "").strip()

            if not message_content:
                return  # Ignore empty messages

            # Save message to DB
            new_message = await self.save_message(
                author=self.user,
                room_id=self.room_id,
                content=message_content
            )
            if not new_message:
                print("Chat room does not exist. Message not saved.")
                return

            # Broadcast to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": new_message.content,
                    "author": new_message.author.username,
                }
            )

        except Exception as e:
            print(f"Error in receive(): {e}")

    async def chat_message(self, event):
        """
        Handles messages from Redis and sends to WebSocket client
        """
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "author": event["author"],
        }))

    # --- DB Helper Methods ---
    @database_sync_to_async
    def is_user_participant(self, user, room_id):
        """Check if user is a participant of the room"""
        return ChatRoom.objects.filter(id=room_id, participants=user).exists()

    @database_sync_to_async
    def save_message(self, author, room_id, content):
        """Save a message in DB"""
        try:
            room = ChatRoom.objects.get(id=room_id)
            return Message.objects.create(author=author, room=room, content=content)
        except ChatRoom.DoesNotExist:
            return None
