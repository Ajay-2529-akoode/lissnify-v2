from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    # This defines the structure of the table Django will create.
    u_id = models.BigAutoField(primary_key=True)
    email = models.EmailField(max_length=255, unique=True)  # Use EmailField and ensure it's unique
    password = models.CharField(max_length=255)
    token = models.CharField(max_length=255, blank=True, null=True)
    otp= models.CharField(max_length=6, blank=True, null=True)
    otp_verified= models.BooleanField(default=False)  # Store OTP if needed
    status= models.BooleanField(default=False)  # Active status of the user
    user_type = models.CharField(max_length=255, blank=True, null=True)  # User's preference
    user_status = models.CharField(max_length=255, blank=True, default='active') 
    temp_preferences = models.JSONField(default=list, blank=True)
    DOB = models.DateField(null=True, blank=True)  # Date of Birth field
    class Meta:
        # This tells Django what to name the table in the database.
        db_table = 'user'

class Category(models.Model):
    id=models.BigAutoField(primary_key=True)
    Category_name=models.CharField(max_length=255)

    class Meta:
        db_table='category'

class Seeker(models.Model):
    # This defines the structure of the table Django will create.
    s_id = models.BigAutoField(primary_key=True)
    # u_id= models.ForeignKey(User, on_delete=models.CASCADE,default=1)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Foreign key to User model
    preferences = models.ManyToManyField(Category)  # Preference field
    
    class Meta:
        db_table = 'seeker'


class Listener(models.Model):
    l_id = models.BigAutoField(primary_key=True)
    # u_id= models.ForeignKey(User, on_delete=models.CASCADE,default=1)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Foreign key to User model
    preferences = models.ManyToManyField(Category)  # Preference field

    class Meta:
        db_table = 'listener'


class Connections(models.Model):
    id = models.BigAutoField(primary_key=True)
    seeker = models.ForeignKey(Seeker, on_delete=models.CASCADE, related_name='connections')
    listener = models.ForeignKey(Listener, on_delete=models.CASCADE, related_name='connections')
    pending = models.BooleanField(default=True)
    accepted = models.BooleanField(default=False)
    rejected = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'connections'
        unique_together = ('seeker', 'listener')  # Ensure a unique connection between seeker and listener