from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    # This defines the structure of the table Django will create.
    u_id = models.BigAutoField(primary_key=True)
    email = models.EmailField(max_length=255, unique=True)  # Use EmailField and ensure it's unique
    password = models.CharField(max_length=255)
    token = models.CharField(max_length=255, blank=True, null=True)
    otp = models.CharField(max_length=6, blank=True, null=True)
    otp_verified = models.BooleanField(default=False)  # Store OTP if needed
    status = models.BooleanField(default=False)  # Active status of the user
    user_type = models.CharField(max_length=255, blank=True, null=True)  # User's preference
    user_status = models.CharField(max_length=255, blank=True, default='active') 
    temp_preferences = models.JSONField(default=list, blank=True)
    DOB = models.DateField(null=True, blank=True)  # Date of Birth field
    is_superuser = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    profile_image= models.CharField(max_length=255, blank=True, null=True)  
    class Meta:
        # This tells Django what to name the table in the database.
        db_table = 'user'

class Category(models.Model):
    id = models.BigAutoField(primary_key=True)
    Category_name = models.CharField(max_length=255)
    description = models.TextField(default='No description')
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    icon = models.CharField(max_length=255, null=True, blank=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:  # auto-generate slug from Category_name
            self.slug = slugify(self.Category_name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.Category_name

    class Meta:
        db_table = 'category'

class Seeker(models.Model):
    # This defines the structure of the table Django will create.
    s_id = models.BigAutoField(primary_key=True)
    # u_id= models.ForeignKey(User, on_delete=models.CASCADE,default=1)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Foreign key to User model
    preferences = models.ManyToManyField(Category)  # Preference field
    
    class Meta:
        db_table = 'seeker'


class Listener(models.Model):
    # name = models.CharField(max_length=100)
    description = models.TextField(default='No description')
    l_id = models.BigAutoField(primary_key=True)
    # category_tag = models.CharField(max_length=100, blank=True,default="General")
    language = models.CharField(max_length=50, blank=True, default='English')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    # created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
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
    def get_status(self):
        """Helper method to return current status"""
        if self.pending:
            return "Pending"
        if self.accepted:
            return "Accepted"
        if self.rejected:
            return "Rejected"
        return "Unknown"


class Blog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blogs")  # ✅ replaced author

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, null=True)
    image = models.ImageField(upload_to="blogs/", null=True, blank=True)

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="blogs")

    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            num = 1
            while Blog.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{num}"
                num += 1
            self.slug = slug
        super(Blog, self).save(*args, **kwargs)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'blog'

class Testimonial(models.Model):
    name = models.CharField(max_length=100)  # Person name
    role = models.CharField(max_length=100, blank=True, null=True)  # e.g., Student, Client
    feedback = models.TextField()  # Testimonial message
    rating = models.PositiveIntegerField(default=5)  # optional star rating (1-5)
    image = models.CharField(max_length=255, blank=True, null=True)  # URL or path to image
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.role}"        
    class Meta:
        db_table = 'testimonial'
