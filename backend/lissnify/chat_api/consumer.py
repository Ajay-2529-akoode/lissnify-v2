# chat_api/consumers.py
import json
import traceback
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message, ChatRoom, MessageReadStatus
from api.models import User, Notification, NotificationSettings


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract room_id from URL route
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'
        self.user = self.scope.get("user")

        # Authentication & participation check
        if not self.user or not self.user.is_authenticated:
            await self.close()
            return

        is_participant = await self.is_user_participant(self.user, self.room_id)
        if not is_participant:
            await self.close()
            return

        # Add to group and accept
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Remove from group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """Handles messages received from WebSocket client"""
        try:
            payload = json.loads(text_data)
            message_type = payload.get("type", "send_message")

            if message_type == "send_message":
                await self.handle_send_message(payload)
            elif message_type == "mark_messages_read":
                await self.handle_mark_messages_read(payload)
            elif message_type == "read_messages":
                await self.handle_read_messages(payload)
            elif message_type == "mark_specific_messages":
                await self.handle_mark_specific_messages(payload)
            else:
                # Fallback: treat as send_message
                await self.handle_send_message(payload)

        except Exception:
            traceback.print_exc()

    async def handle_send_message(self, data):
        """Handle sending a new message"""
        message_content = (data.get("message") or "").strip()
        if not message_content:
            return

        # Save message to DB
        new_message = await self.save_message(author=self.user, room_id=self.room_id, content=message_content)
        if not new_message:
            return

        # Mark the message as read for the sender only
        await self.mark_message_as_read_for_sender(new_message)

        # Create notifications for other participants (DB)
        await self.create_message_notifications(new_message)

        # Broadcast the new message to the room (everyone)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message_type": "new_message",
                "message": new_message.content,
                "author": new_message.author.username,
                "author_full_name": new_message.author.full_name,
                "message_id": new_message.id,
                "timestamp": new_message.timestamp.isoformat(),
            }
        )

        # Send delivered confirmation only to the sender (not broadcast)
        try:
            await self.send(text_data=json.dumps({
                "type": "message_delivered",
                "message_id": new_message.id,
            }))
        except Exception:
            traceback.print_exc()

    async def handle_mark_messages_read(self, data):
        room_id = data.get("room_id")
        message_ids = data.get("message_ids", [])

        if not message_ids:
            return

    # Mark these messages as read in DB
        newly_marked = await self.mark_specific_messages_as_read(self.user, message_ids)

    # Broadcast read receipt to all participants in the room
        for receipt in newly_marked:
            await self.channel_layer.group_send(
                self.room_group_name,
            {
                "type": "chat_message",
                "message_type": "message_read",
                "message_id": receipt['message_id'],
                "user_id": receipt['user_id'],
                "read_at": receipt['read_at'],
            }
        )


    async def handle_read_messages(self, data):
        """Handle marking all messages in a chatroom as read for the current user"""
        chatroom_id = data.get("chatroom") or self.room_id
        if not chatroom_id:
            return

        newly_marked_messages = await self.mark_all_messages_as_read_in_chatroom(self.user, chatroom_id)

        # Broadcast read events for newly marked messages
        for read_receipt in newly_marked_messages:
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message_type": "message_read",
                    "message_id": read_receipt['message_id'],
                    "user_id": read_receipt['user_id'],
                    "read_at": read_receipt['read_at']
                }
            )

    async def handle_mark_specific_messages(self, data):
        """alias to mark specific messages route if used"""
        await self.handle_mark_messages_read(data)

    async def chat_message(self, event):
        """
        Handles messages from Redis group and sends to WebSocket client.
        Event payloads have a `message_type` key to distinguish events.
        """
        message_type = event.get("message_type", "new_message")

        if message_type == "new_message":
            unread_count = await self.get_unread_count_for_room(self.room_id, self.user)
            await self.send(text_data=json.dumps({
                "type": "new_message",
                "message": event.get("message"),
                "author": event.get("author"),
                "author_full_name": event.get("author_full_name", event.get("author")),
                "message_id": event.get("message_id"),
                "timestamp": event.get("timestamp"),
                "unread_count": unread_count,
            }))

        elif message_type == "message_read":
            await self.send(text_data=json.dumps({
                "type": "message_read",
                "message_id": event.get("message_id"),
                "user_id": event.get("user_id"),
                "read_at": event.get("read_at")
            }))

    async def notification_message(self, event):
        """Handles notification messages (like aggregated read receipts)"""
        notification = event.get("notification", {})
        await self.send(text_data=json.dumps({
            "type": notification.get("type", "notification"),
            **notification
        }))

    # --- DB Helper Methods ---
    @database_sync_to_async
    def is_user_participant(self, user, room_id):
        return ChatRoom.objects.filter(id=room_id, participants=user).exists()

    @database_sync_to_async
    def save_message(self, author, room_id, content):
        try:
            room = ChatRoom.objects.get(id=room_id)
            return Message.objects.create(author=author, room=room, content=content)
        except ChatRoom.DoesNotExist:
            return None

    @database_sync_to_async
    def create_message_notifications(self, message):
        try:
            room = ChatRoom.objects.get(id=message.room.id)
            participants = room.participants.exclude(u_id=message.author.u_id)
            for participant in participants:
                settings, _ = NotificationSettings.objects.get_or_create(user=participant)
                if not settings.message_notifications:
                    continue
                Notification.objects.create(
                    recipient=participant,
                    sender=message.author,
                    notification_type='message',
                    title=f'New message from {message.author.full_name}',
                    message=f'{message.content[:100]}{"..." if len(message.content) > 100 else ""}',
                    chat_room_id=message.room.id,
                    message_id=message.id
                )
        except Exception:
            traceback.print_exc()

    @database_sync_to_async
    def get_room_participants_for_notifications(self, room_id, exclude_user_id):
        try:
            room = ChatRoom.objects.get(id=room_id)
            participants = room.participants.exclude(u_id=exclude_user_id)
            return list(participants.values('u_id', 'full_name'))
        except ChatRoom.DoesNotExist:
            return []

    @database_sync_to_async
    def get_user_notification_settings(self, user_id):
        try:
            settings = NotificationSettings.objects.get(user_id=user_id)
            return {
                'message_notifications': settings.message_notifications,
                'connection_notifications': settings.connection_notifications,
                'system_notifications': settings.system_notifications,
            }
        except NotificationSettings.DoesNotExist:
            return {
                'message_notifications': True,
                'connection_notifications': True,
                'system_notifications': True,
            }

    @database_sync_to_async
    def get_unread_count_for_room(self, room_id, user):
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
                author=user
            ).count()

            return unread_count
        except Exception:
            traceback.print_exc()
            return 0

    @database_sync_to_async
    def get_message_sender(self, message_id):
        try:
            message = Message.objects.get(id=message_id)
            return message.author.u_id
        except Message.DoesNotExist:
            return None

    @database_sync_to_async
    def mark_specific_messages_as_read(self, user, message_ids):
        try:
            messages = Message.objects.filter(id__in=message_ids)
            newly_marked_messages = []
            for message in messages:
                if message.author.u_id != user.u_id:
                    read_status, created = MessageReadStatus.objects.get_or_create(
                        message=message,
                        user=user
                    )
                    if created:
                        newly_marked_messages.append({
                            'message_id': message.id,
                            'user_id': user.u_id,
                            'read_at': read_status.read_at.isoformat()
                        })
            return newly_marked_messages
        except Exception:
            traceback.print_exc()
            return []

    @database_sync_to_async
    def mark_all_messages_as_read_in_chatroom(self, user, chatroom_id):
        try:
            read_message_ids = MessageReadStatus.objects.filter(
                user=user,
                message__room_id=chatroom_id
            ).values_list('message_id', flat=True)

            unread_messages = Message.objects.filter(
                room_id=chatroom_id
            ).exclude(
                id__in=read_message_ids
            ).exclude(
                author=user
            )

            newly_marked_messages = []
            for message in unread_messages:
                read_status, created = MessageReadStatus.objects.get_or_create(
                    message=message,
                    user=user
                )
                if created:
                    newly_marked_messages.append({
                        'message_id': message.id,
                        'user_id': user.u_id,
                        'read_at': read_status.read_at.isoformat()
                    })

            return newly_marked_messages
        except Exception:
            traceback.print_exc()
            return []

    @database_sync_to_async
    def mark_message_as_read_for_sender(self, message):
        try:
            MessageReadStatus.objects.get_or_create(
                message=message,
                user=message.author
            )
        except Exception:
            traceback.print_exc()
