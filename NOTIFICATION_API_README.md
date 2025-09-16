# Notification API System

A comprehensive notification system for the Lissnify mental health support platform, specifically designed for message notifications with real-time WebSocket support.

## 🚀 Features

### Backend Features
- **Message Notifications**: Automatic notifications when new messages are sent in chat rooms
- **Real-time WebSocket**: Live notification delivery using Django Channels
- **Notification Types**: Support for message, connection, and system notifications
- **User Settings**: Granular notification preferences per user
- **RESTful API**: Complete CRUD operations for notifications
- **Statistics**: Notification counts and analytics
- **Database Integration**: PostgreSQL with proper indexing and relationships

### Frontend Features
- **Notification Bell**: Real-time notification indicator with unread count
- **Toast Notifications**: Pop-up notifications for new messages
- **Settings Panel**: User-configurable notification preferences
- **Notification Page**: Full notification management interface
- **WebSocket Integration**: Real-time updates without page refresh
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📁 Project Structure

```
backend/lissnify/
├── api/
│   ├── models.py              # Notification and NotificationSettings models
│   ├── serializers.py         # API serializers for notifications
│   ├── views.py               # REST API views
│   └── urls.py                # API routing
├── notification_api/
│   ├── consumer.py            # WebSocket consumer for real-time notifications
│   └── routing.py             # WebSocket routing
├── chat_api/
│   └── consumer.py            # Enhanced chat consumer with notification integration
└── Lissnify/
    ├── asgi.py                # ASGI configuration with WebSocket routing
    └── settings.py            # Django settings with notification app

Front-end/lissnify/src/
├── hooks/
│   ├── useNotifications.ts    # React hook for notification management
│   └── useNotificationWebSocket.ts  # WebSocket hook for real-time updates
├── components/
│   ├── NotificationBell.tsx   # Notification bell component
│   └── NotificationToast.tsx  # Toast notification component
├── contexts/
│   └── NotificationContext.tsx  # React context for global notification state
└── app/
    └── notifications/
        └── page.tsx           # Notification management page
```

## 🛠️ Installation & Setup

### Backend Setup

1. **Install Dependencies**
   ```bash
   pip install django djangorestframework djangorestframework-simplejwt
   pip install channels channels-redis daphne
   pip install django-cors-headers python-decouple
   pip install psycopg2-binary Pillow
   ```

2. **Database Migration**
   ```bash
   cd backend/lissnify
   python manage.py makemigrations api
   python manage.py migrate
   ```

3. **Environment Variables**
   Create a `.env` file in `backend/lissnify/`:
   ```env
   DATABASE_NAME=your_db_name
   DATABASE_USER=your_db_user
   DATABASE_PASSWORD=your_db_password
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   EMAIL_HOST_USER=your_email
   EMAIL_HOST_PASSWORD=your_email_password
   ```

4. **Start Redis Server**
   ```bash
   redis-server
   ```

5. **Run Django Server**
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd Front-end/lissnify
   npm install
   ```

2. **Environment Variables**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_WS_URL=ws://localhost:8000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## 📡 API Endpoints

### Notification Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications/` | Get user notifications (with pagination & filters) |
| GET | `/api/notifications/{id}/` | Get specific notification |
| PATCH | `/api/notifications/{id}/` | Mark notification as read/unread |
| DELETE | `/api/notifications/{id}/` | Delete notification |
| POST | `/api/notifications/mark-all-read/` | Mark all notifications as read |
| GET | `/api/notifications/stats/` | Get notification statistics |
| GET | `/api/notifications/settings/` | Get user notification settings |
| PUT | `/api/notifications/settings/` | Update notification settings |
| POST | `/api/notifications/create-message/` | Create message notification |

### WebSocket Endpoints

| Endpoint | Description |
|----------|-------------|
| `ws://localhost:8000/ws/notifications/` | Real-time notification updates |

## 🔧 Usage Examples

### Frontend Integration

1. **Add Notification Bell to Navbar**
   ```tsx
   import NotificationBell from '@/components/NotificationBell';
   
   function Navbar() {
     return (
       <nav>
         {/* Other navbar items */}
         <NotificationBell />
       </nav>
     );
   }
   ```

2. **Use Notification Context**
   ```tsx
   import { NotificationProvider } from '@/contexts/NotificationContext';
   
   function App() {
     return (
       <NotificationProvider>
         {/* Your app components */}
       </NotificationProvider>
     );
   }
   ```

3. **Use Notifications Hook**
   ```tsx
   import { useNotifications } from '@/hooks/useNotifications';
   
   function MyComponent() {
     const { notifications, markAsRead, unreadCount } = useNotifications();
     
     return (
       <div>
         <p>Unread: {unreadCount}</p>
         {notifications.map(notification => (
           <div key={notification.id}>
             {notification.title}
           </div>
         ))}
       </div>
     );
   }
   ```

### Backend Integration

1. **Create Message Notification**
   ```python
   from api.models import Notification, NotificationSettings
   
   def create_message_notification(sender, recipient, message, chat_room_id):
       # Check if user has message notifications enabled
       settings, created = NotificationSettings.objects.get_or_create(user=recipient)
       if not settings.message_notifications:
           return
       
       Notification.objects.create(
           recipient=recipient,
           sender=sender,
           notification_type='message',
           title=f'New message from {sender.username}',
           message=message.content[:100],
           chat_room_id=chat_room_id,
           message_id=message.id
       )
   ```

2. **Send WebSocket Notification**
   ```python
   from channels.layers import get_channel_layer
   from asgiref.sync import async_to_sync
   
   def send_notification_websocket(notification):
       channel_layer = get_channel_layer()
       async_to_sync(channel_layer.group_send)(
           f'notifications_{notification.recipient.id}',
           {
               'type': 'notification_message',
               'notification': {
                   'id': notification.id,
                   'title': notification.title,
                   'message': notification.message,
                   'type': notification.notification_type,
               }
           }
       )
   ```

## 🎯 Notification Types

### Message Notifications
- **Trigger**: When a new message is sent in a chat room
- **Recipients**: All other participants in the chat room
- **Content**: Message preview and sender information

### Connection Notifications
- **connection_request**: New connection request received
- **connection_accepted**: Connection request accepted
- **connection_rejected**: Connection request rejected

### System Notifications
- **General**: Platform updates, maintenance notices, etc.

## ⚙️ Configuration

### Notification Settings

Users can configure their notification preferences:

- **message_notifications**: Enable/disable message notifications
- **connection_notifications**: Enable/disable connection notifications
- **system_notifications**: Enable/disable system notifications
- **email_notifications**: Enable/disable email notifications
- **push_notifications**: Enable/disable push notifications

### WebSocket Configuration

The WebSocket connection automatically:
- Authenticates using JWT tokens
- Reconnects on connection loss
- Handles rate limiting
- Manages connection state

## 🚨 Error Handling

### Backend Error Handling
- Database connection errors
- WebSocket connection failures
- Invalid notification data
- User permission errors

### Frontend Error Handling
- Network connectivity issues
- WebSocket reconnection
- API response errors
- Invalid notification data

## 📊 Performance Considerations

### Database Optimization
- Proper indexing on frequently queried fields
- Pagination for large notification lists
- Efficient queries with select_related

### WebSocket Optimization
- Connection pooling
- Message batching
- Rate limiting
- Automatic cleanup of inactive connections

## 🔒 Security Features

- JWT-based authentication
- User-specific notification access
- WebSocket authentication
- CORS configuration
- Input validation and sanitization

## 🧪 Testing

### Backend Testing
```bash
python manage.py test api.tests.test_notifications
```

### Frontend Testing
```bash
npm test
```

## 📈 Monitoring

### Key Metrics
- Notification delivery rate
- WebSocket connection count
- API response times
- Database query performance

### Logging
- WebSocket connection events
- Notification creation/deletion
- API request/response logs
- Error tracking

## 🚀 Deployment

### Production Considerations
- Redis server configuration
- WebSocket load balancing
- Database connection pooling
- Static file serving
- SSL/TLS configuration

### Environment Variables
```env
DEBUG=False
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://user:pass@host:port/db
REDIS_URL=redis://localhost:6379
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This notification system is specifically designed for message notifications but can be easily extended to support other notification types as needed.
