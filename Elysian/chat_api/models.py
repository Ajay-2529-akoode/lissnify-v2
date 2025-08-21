from django.db import models
from api.models import User
# Create your models here

class ChatRoom(models.Model):
    ROOM_TYPE_CHOICES = (
        ('one-to-one', 'One-to-One'),
        ('group', 'Group'),
    )
    name=models.CharField(max_length=255, blank=True, null=True)
    type=models.CharField(max_length=20, choices=ROOM_TYPE_CHOICES, default='one-to-one')
    participants=models.ManyToManyField(User, related_name='chat_rooms')
    create_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.type == 'community' and self.name:
            return self.name
        return f"Chat Room #{self.id}"

class Message(models.Model):
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='authored_messages')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.author.username}: {self.content[:20]}"    