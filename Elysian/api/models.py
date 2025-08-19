from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # This defines the structure of the table Django will create.
    u_id = models.BigAutoField(primary_key=True)
    u_name = models.CharField(max_length=255, unique=True) # Usernames should be unique
    email = models.EmailField(max_length=255, unique=True)  # Use EmailField and ensure it's unique
    password = models.CharField(max_length=255)
    token = models.CharField(max_length=255, blank=True, null=True)
    otp= models.CharField(max_length=6, blank=True, null=True)  # Store OTP if needed
    status= models.BooleanField(default=False)  # Active status of the user
    user_type = models.CharField(max_length=255, blank=True, null=True)  # User's preference
    user_status = models.CharField(max_length=255, blank=True, default='active') 
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
    u_id= models.ForeignKey(User, on_delete=models.CASCADE,default=1)  # Foreign key to User model
    preferences = models.ManyToManyField(Category)  # Preference field
    
    class Meta:
        db_table = 'seeker'


class Listener(models.Model):
    l_id = models.BigAutoField(primary_key=True)
    u_id= models.ForeignKey(User, on_delete=models.CASCADE,default=1)  # Foreign key to User model
    preferences = models.ManyToManyField(Category)  # Preference field

    class Meta:
        db_table = 'listener'


