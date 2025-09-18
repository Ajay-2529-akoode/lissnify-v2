# chat_api/urls.py

from django.urls import path
from .views import StartDirectChatView, CommunityChatListView, MessageListView, chatRoomListView, MarkMessagesAsReadView, UnreadCountView

urlpatterns = [
    path('start-direct/', StartDirectChatView.as_view(), name='start-direct-chat'),
    path('community/', CommunityChatListView.as_view(), name='community-chat-list'),
    path('<int:room_id>/messages/', MessageListView.as_view(), name='message-list'),
    path('rooms/', chatRoomListView.as_view(), name='chat-room-list'),
    path('<int:room_id>/mark-read/', MarkMessagesAsReadView.as_view(), name='mark-messages-read'),
    path('unread-counts/', UnreadCountView.as_view(), name='unread-counts'),
]