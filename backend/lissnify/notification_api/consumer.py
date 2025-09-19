import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from api.models import User, Notification, NotificationSettings


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.notification_group_name = f'notifications_{self.user.u_id}'

        # print(f"🔔 NotificationConsumer connect attempt for user {self.user.u_id}")
        # print(f"🔔 User authenticated: {self.user.is_authenticated}")

        if not self.user.is_authenticated:
            print(f"❌ User {self.user.u_id} not authenticated, closing connection")
            await self.close()
            return

        # Join notification group
        # print(f"🔔 Joining notification group: {self.notification_group_name}")
        await self.channel_layer.group_add(
            self.notification_group_name,
            self.channel_name
        )

        await self.accept()
        # print(f"✅ NotificationConsumer connected for user {self.user.u_id}")

    async def disconnect(self, close_code):
        # Leave notification group
        await self.channel_layer.group_discard(
            self.notification_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        """Handle incoming messages from client"""
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')

            if message_type == 'mark_read':
                notification_id = text_data_json.get('notification_id')
                await self.mark_notification_read(notification_id)
            elif message_type == 'get_unread_count':
                count = await self.get_unread_count()
                await self.send(text_data=json.dumps({
                    'type': 'unread_count',
                    'count': count
                }))

        except Exception as e:
            print(f"Error in notification consumer receive: {e}")

    async def notification_message(self, event):
        """Send notification to WebSocket"""
        print(f"🔔 NotificationConsumer received message for user {self.user.u_id}")
        print(f"📬 Notification data: {event['notification']}")
        
        notification = event.get('notification', {})
        
        if notification.get('type') == 'message_read':
            # Handle read receipt notification
            print(f"📖 Sending read receipt to user {self.user.u_id}")
            await self.send(text_data=json.dumps({
                'type': 'message_read',
                'message_ids': notification.get('message_ids', []),
                'room_id': notification.get('room_id')
            }))
            print(f"✅ Read receipt sent to user {self.user.u_id}")
        else:
            # Handle regular notification
            await self.send(text_data=json.dumps({
                'type': 'notification',
                'notification': notification
            }))
        print(f"✅ Notification sent to WebSocket for user {self.user.u_id}")

    async def unread_count_update(self, event):
        """Send unread count update to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'unread_count',
            'count': event['count']
        }))

    @database_sync_to_async
    def mark_notification_read(self, notification_id):
        """Mark a notification as read"""
        try:
            notification = Notification.objects.get(
                id=notification_id, 
                recipient=self.user
            )
            notification.is_read = True
            notification.save()
        except Notification.DoesNotExist:
            pass

    @database_sync_to_async
    def get_unread_count(self):
        """Get unread notification count for user"""
        return Notification.objects.filter(
            recipient=self.user, 
            is_read=False
        ).count()
