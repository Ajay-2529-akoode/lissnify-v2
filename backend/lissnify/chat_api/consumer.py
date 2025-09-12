import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, ChatRoom
from api.models import User, Notification, NotificationSettings


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        

        # Extract room_id from URL route
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope["user"]

        # print(f"User: {self.user}, Attempting to connect to room: {self.room_id}")

        # Authentication & participation check
        if not self.user.is_authenticated:
            # print("--- WebSocket: Anonymous user tried to connect. Closing connection. ---")
            await self.close()
            return

        # print("--> STEP 1: Checking user participation (database query)...")
        is_participant = await self.is_user_participant(self.user, self.room_id)
        # print(f"<-- ...Database check complete. Is participant: {is_participant}")

        if not is_participant:
            # print("--- WebSocket: User is NOT in this chat room. Closing connection. ---")
            await self.close()
            return

        # Add to group
        # print("--> STEP 2: Adding channel to Redis group...")
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        # print("<-- ...Added to Redis group.")

        # Accept connection
        # print("--> STEP 3: Accepting connection...")
        await self.accept()
        # print("--- WebSocket: Connection ACCEPTED successfully. ---")

    async def disconnect(self, close_code):
        # Remove from group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        # print(f"--- WebSocket disconnected. Code: {close_code} ---")

    async def receive(self, text_data):
        """
        Handles messages received from WebSocket client
        """
        try:
            # print(f"📨 Received message: {text_data}")
            text_data_json = json.loads(text_data)
            message_content = text_data_json.get("message", "").strip()

            if not message_content:
                # print("❌ Empty message, ignoring")
                return  # Ignore empty messages

            # print(f"💬 Processing message: '{message_content}' from {self.user.username}")

            # Save message to DB
            new_message = await self.save_message(
                author=self.user,
                room_id=self.room_id,
                content=message_content
            )
            if not new_message:
                # print("❌ Chat room does not exist. Message not saved.")
                return

            # print(f"✅ Message saved with ID: {new_message.id}")

            # Create notifications for other participants
            # print("🔔 Creating notifications...")
            await self.create_message_notifications(new_message)

            # Send WebSocket notifications to other participants
            # print("📡 Sending WebSocket notifications...")
            await self.send_notification_websockets(new_message)

            # Broadcast to room group
            # print("📢 Broadcasting to room group...")
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": new_message.content,
                    "author": new_message.author.username,
                    "message_id": new_message.id,
                    "timestamp": new_message.timestamp.isoformat(),
                }
            )
            # print("✅ Message processing completed")

        except Exception as e:
            # print(f"❌ Error in receive(): {e}")
            import traceback
            traceback.print_exc()

    async def chat_message(self, event):
        """
        Handles messages from Redis and sends to WebSocket client
        """
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "author": event["author"],
            "message_id": event.get("message_id"),
            "timestamp": event.get("timestamp"),
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

    @database_sync_to_async
    def create_message_notifications(self, message):
        """Create notifications for other participants in the chat room"""
        try:
            # print(f"🔔 Creating notifications for message: {message.id}")
            room = ChatRoom.objects.get(id=message.room.id)
            participants = room.participants.exclude(u_id=message.author.u_id)
            # print(f"👥 Found {participants.count()} participants to notify")
            
            for participant in participants:
                # print(f"👤 Processing participant: {participant.username}")
                # Check if user has message notifications enabled
                settings, created = NotificationSettings.objects.get_or_create(user=participant)
                # print(f"⚙️ Settings for {participant.username}: message_notifications={settings.message_notifications}")
                
                if not settings.message_notifications:
                    # print(f"❌ Message notifications disabled for {participant.username}")
                    continue
                
                # Create notification
                notification = Notification.objects.create(
                    recipient=participant,
                    sender=message.author,
                    notification_type='message',
                    title=f'New message from {message.author.username}',
                    message=f'{message.content[:100]}{"..." if len(message.content) > 100 else ""}',
                    chat_room_id=message.room.id,
                    message_id=message.id
                )
                # print(f"✅ Created notification {notification.id} for {participant.username}")
        except Exception as e:
            # print(f"❌ Error creating message notifications: {e}")
            import traceback
            traceback.print_exc()

    @database_sync_to_async
    def get_room_participants(self, room_id):
        """Get all participants in a chat room"""
        try:
            room = ChatRoom.objects.get(id=room_id)
            return list(room.participants.values_list('id', flat=True))
        except ChatRoom.DoesNotExist:
            return []

    @database_sync_to_async
    def get_room_participants_for_notifications(self, room_id, exclude_user_id):
        """Get all participants in a chat room for notifications (excluding sender)"""
        try:
            room = ChatRoom.objects.get(id=room_id)
            participants = room.participants.exclude(u_id=exclude_user_id)
            return list(participants.values('u_id', 'username'))
        except ChatRoom.DoesNotExist:
            return []

    @database_sync_to_async
    def get_user_notification_settings(self, user_id):
        """Get notification settings for a user"""
        try:
            settings = NotificationSettings.objects.get(user_id=user_id)
            return {
                'message_notifications': settings.message_notifications,
                'connection_notifications': settings.connection_notifications,
                'system_notifications': settings.system_notifications,
            }
        except NotificationSettings.DoesNotExist:
            # Return default settings if not found
            return {
                'message_notifications': True,
                'connection_notifications': True,
                'system_notifications': True,
            }

    async def send_notification_websockets(self, message):
        """Send WebSocket notifications to other participants"""
        try:
            # print(f"📡 Getting participants for room {message.room.id}, excluding user {message.author.u_id}")
            # Get participants asynchronously
            participants = await self.get_room_participants_for_notifications(message.room.id, message.author.u_id)
            # print(f"👥 Found {len(participants)} participants for WebSocket notifications")
            
            for participant in participants:
                # print(f"👤 Sending WebSocket notification to {participant['username']} (ID: {participant['u_id']})")
                # Check if user has message notifications enabled
                settings = await self.get_user_notification_settings(participant['u_id'])
                # print(f"⚙️ Settings for {participant['username']}: {settings}")
                
                if not settings.get('message_notifications', True):
                    # print(f"❌ Message notifications disabled for {participant['username']}")
                    continue
                
                # Send WebSocket notification
                group_name = f'notifications_{participant["u_id"]}'
                # print(f"📡 Sending to group: {group_name}")
                
                await self.channel_layer.group_send(
                    group_name,
                    {
                        'type': 'notification_message',
                        'notification': {
                            'id': f'temp_{message.id}_{participant["u_id"]}',
                            'title': f'New message from {message.author.username}',
                            'message': f'{message.content[:100]}{"..." if len(message.content) > 100 else ""}',
                            'notification_type': 'message',
                            'sender_username': message.author.username,
                            'created_at': message.timestamp.isoformat(),
                            'chat_room_id': message.room.id,
                            'message_id': message.id,
                        }
                    }
                )
                # print(f"✅ WebSocket notification sent to {participant['username']}")
        except Exception as e:
            # print(f"❌ Error sending WebSocket notifications: {e}")
            import traceback
            traceback.print_exc()
