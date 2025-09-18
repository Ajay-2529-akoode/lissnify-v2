import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, ChatRoom, MessageReadStatus
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
            message_type = text_data_json.get("type", "send_message")
            
            if message_type == "send_message":
                await self.handle_send_message(text_data_json)
            elif message_type == "mark_messages_read":
                await self.handle_mark_messages_read(text_data_json)
            else:
                # Fallback to old message format
                await self.handle_send_message(text_data_json)

        except Exception as e:
            # print(f"❌ Error in receive(): {e}")
            import traceback
            traceback.print_exc()

    async def handle_send_message(self, data):
        """Handle sending a new message"""
        message_content = data.get("message", "").strip()
        message_id = data.get("message_id")

        if not message_content:
            return  # Ignore empty messages

        # Save message to DB
        new_message = await self.save_message(
            author=self.user,
            room_id=self.room_id,
            content=message_content
        )
        if not new_message:
            return

        # Create notifications for other participants
        await self.create_message_notifications(new_message)

        # Send WebSocket notifications to other participants
        await self.send_notification_websockets(new_message)

        # Broadcast to room group with message type
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": new_message.content,
                "author": new_message.author.full_name,
                "author_full_name": new_message.author.full_name,
                "message_id": new_message.id,
                "timestamp": new_message.timestamp.isoformat(),
                "message_type": "new_message"
            }
        )

        # Send delivered confirmation to sender
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message_id": new_message.id,
                "message_type": "message_delivered"
            }
        )

    async def handle_mark_messages_read(self, data):
        """Handle marking messages as read"""
        room_id = data.get("room_id")
        message_ids = data.get("message_ids", [])
        
        print(f"🔍 Received mark_messages_read request:")
        print(f"   Room ID: {room_id}")
        print(f"   Message IDs: {message_ids}")
        print(f"   Current user: {self.user.u_id} ({self.user.full_name})")
        
        if not message_ids:
            print("❌ No message IDs provided")
            return

        # Mark messages as read in database
        result = await self.mark_messages_as_read(self.user, message_ids)
        print(f"📝 Marked messages as read in DB: {result}")

        # Get the sender of these messages to notify them
        sender_id = await self.get_message_sender(message_ids[0])
        print(f"👤 Sender ID: {sender_id}")
        
        if sender_id and sender_id != self.user.u_id:
            # Send read receipt to sender's notification group
            sender_group = f'notifications_{sender_id}'
            print(f"📤 Sending read receipt to group: {sender_group}")
            
            await self.channel_layer.group_send(
                sender_group,
                {
                    "type": "notification_message",
                    "notification": {
                        "type": "message_read",
                        "message_ids": message_ids,
                        "room_id": room_id
                    }
                }
            )
            
            # Also send read receipt through the chat room for immediate update
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message_ids": message_ids,
                    "message_type": "message_read"
                }
            )
            
            print(f"✅ Sent read receipt to sender {sender_id} for messages {message_ids}")
        else:
            print(f"❌ Could not find sender for messages {message_ids} or sender is same as current user")

    async def chat_message(self, event):
        """
        Handles messages from Redis and sends to WebSocket client
        """
        message_type = event.get("message_type", "new_message")
        
        if message_type == "new_message":
            # Get unread count for this room
            unread_count = await self.get_unread_count_for_room(self.room_id, self.user)
            
            await self.send(text_data=json.dumps({
                "type": "new_message",
                "message": event["message"],
                "author": event["author"],
                "author_full_name": event.get("author_full_name", event["author"]),
                "message_id": event.get("message_id"),
                "timestamp": event.get("timestamp"),
                "unread_count": unread_count,
            }))
        elif message_type == "message_delivered":
            await self.send(text_data=json.dumps({
                "type": "message_delivered",
                "message_id": event.get("message_id"),
            }))
        elif message_type == "message_read":
            await self.send(text_data=json.dumps({
                "type": "message_read",
                "message_ids": event.get("message_ids", []),
            }))

    async def notification_message(self, event):
        """
        Handles notification messages (like read receipts)
        """
        notification = event.get("notification", {})
        
        if notification.get("type") == "message_read":
            await self.send(text_data=json.dumps({
                "type": "message_read",
                "message_ids": notification.get("message_ids", []),
                "room_id": notification.get("room_id"),
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
                # print(f"👤 Processing participant: {participant.full_name}")
                # Check if user has message notifications enabled
                settings, created = NotificationSettings.objects.get_or_create(user=participant)
                # print(f"⚙️ Settings for {participant.full_name}: message_notifications={settings.message_notifications}")
                
                if not settings.message_notifications:
                    # print(f"❌ Message notifications disabled for {participant.full_name}")
                    continue
                
                # Create notification
                notification = Notification.objects.create(
                    recipient=participant,
                    sender=message.author,
                    notification_type='message',
                    title=f'New message from {message.author.full_name}',
                    message=f'{message.content[:100]}{"..." if len(message.content) > 100 else ""}',
                    chat_room_id=message.room.id,
                    message_id=message.id
                )
                # print(f"✅ Created notification {notification.id} for {participant.full_name}")
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
            return list(participants.values('u_id', 'full_name'))
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

    @database_sync_to_async
    def get_unread_count_for_room(self, room_id, user):
        """Get unread message count for a specific room and user"""
        try:
            read_message_ids = MessageReadStatus.objects.filter(
                user=user,
                message__room_id=room_id
            ).values_list('message_id', flat=True)
            
            unread_count = Message.objects.filter(
                room_id=room_id
            ).exclude(
                id__in=read_message_ids
            ).exclude(
                author=user  # Don't count own messages as unread
            ).count()
            
            return unread_count
        except Exception as e:
            print(f"Error getting unread count: {e}")
            return 0

    @database_sync_to_async
    def mark_messages_as_read(self, user, message_ids):
        """Mark messages as read for a user"""
        try:
            messages = Message.objects.filter(id__in=message_ids)
            for message in messages:
                MessageReadStatus.objects.get_or_create(
                    message=message,
                    user=user
                )
            return True
        except Exception as e:
            print(f"Error marking messages as read: {e}")
            return False

    @database_sync_to_async
    def get_message_sender(self, message_id):
        """Get the sender ID of a message"""
        try:
            message = Message.objects.get(id=message_id)
            return message.author.u_id
        except Message.DoesNotExist:
            return None

    async def send_notification_websockets(self, message):
        """Send WebSocket notifications to other participants"""
        try:
            # print(f"📡 Getting participants for room {message.room.id}, excluding user {message.author.u_id}")
            # Get participants asynchronously
            participants = await self.get_room_participants_for_notifications(message.room.id, message.author.u_id)
            # print(f"👥 Found {len(participants)} participants for WebSocket notifications")
            
            for participant in participants:
                # print(f"👤 Sending WebSocket notification to {participant['full_name']} (ID: {participant['u_id']})")
                # Check if user has message notifications enabled
                settings = await self.get_user_notification_settings(participant['u_id'])
                # print(f"⚙️ Settings for {participant['full_name']}: {settings}")
                
                if not settings.get('message_notifications', True):
                    # print(f"❌ Message notifications disabled for {participant['full_name']}")
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
                            'title': f'New message from {message.author.full_name}',
                            'message': f'{message.content[:100]}{"..." if len(message.content) > 100 else ""}',
                            'notification_type': 'message',
                            'sender_username': message.author.full_name,
                            'sender_full_name': message.author.full_name,
                            'created_at': message.timestamp.isoformat(),
                            'chat_room_id': message.room.id,
                            'message_id': message.id,
                        }
                    }
                )
                # print(f"✅ WebSocket notification sent to {participant['full_name']}")
        except Exception as e:
            # print(f"❌ Error sending WebSocket notifications: {e}")
            import traceback
            traceback.print_exc()
