# chat_api/urls.py

from django.urls import path
from .views import StartDirectChatView, CommunityChatListView, MessageListView

urlpatterns = [
    path('start-direct/', StartDirectChatView.as_view(), name='start-direct-chat'),
    path('community/', CommunityChatListView.as_view(), name='community-chat-list'),
    path('<int:room_id>/messages/', MessageListView.as_view(), name='message-list'),
]