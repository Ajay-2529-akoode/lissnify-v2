from django.db import models

class User(models.Model):
    # This defines the structure of the table Django will create.
    u_id = models.BigAutoField(primary_key=True)
    u_name = models.CharField(max_length=255, unique=True) # Usernames should be unique
    email = models.EmailField(max_length=255, unique=True)  # Use EmailField and ensure it's unique
    password = models.CharField(max_length=255)
    token = models.CharField(max_length=255, blank=True, null=True)
    otp= models.CharField(max_length=6, blank=True, null=True)  # Store OTP if needed
    status= models.BooleanField(default=False)  # Active status of the user

    class Meta:
        # This tells Django what to name the table in the database.
        db_table = 'user'
