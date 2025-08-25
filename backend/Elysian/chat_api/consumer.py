# chat_api/consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, ChatRoom
from api.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the room ID from the URL.
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope['user']

        # --- SECURITY CHECK ---
        # Check if the user is authenticated and is a participant in the room.
        if not self.user.is_authenticated or not await self.is_user_participant(self.user, self.room_id):
            # Reject the connection if the user is not authorized.
            await self.close()
            return

        # Join the room group.
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        # Accept the WebSocket connection.
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group when the connection is closed.
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # This method is called when we receive a message from the WebSocket (i.e., from the user's browser).
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_content = text_data_json['message']

        # Save the message to the database.
        new_message = await self.save_message(self.user, self.room_id, message_content)

        # Broadcast the message to the entire room group.
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message', # This calls the chat_message method below
                'message': new_message.content,
                'author': new_message.author.username
            }
        )

    # This method is called when a message is received from the room group (i.e., from Redis).
    async def chat_message(self, event):
        message = event['message']
        author = event['author']

        # Send the message down the WebSocket to the client's browser.
        await self.send(text_data=json.dumps({
            'message': message,
            'author': author
        }))

    # Helper method to interact with the synchronous Django ORM from an async context.
    @database_sync_to_async
    def is_user_participant(self, user, room_id):
        """
        Checks if a user is a member of a chat room.
        """
        return ChatRoom.objects.filter(id=room_id, participants=user).exists()
    
    @database_sync_to_async
    def save_message(self, author, room_id, content):
        """
        Saves a chat message to the database.
        """
        room = ChatRoom.objects.get(id=room_id)
        return Message.objects.create(author=author, room=room, content=content)