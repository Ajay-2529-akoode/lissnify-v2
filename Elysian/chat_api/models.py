from django.db import models

# Create your models here.
class Conversation(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    is_group = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'conversation'

class Message(models.Model):
    id = models.AutoField(primary_key=True)
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    # sender = models.ForeignKey(  on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'message'

class Participant(models.Model):
    id = models.AutoField(primary_key=True)
    conversation = models.ForeignKey(Conversation, related_name='participants', on_delete=models.CASCADE)
    # user = models.ForeignKey('auth.User', related_name='conversations', on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'participant'