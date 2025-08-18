# myapp/urls.py
from django.urls import path
from .views import RegisterView, LoginView,OTPView

urlpatterns = [
    path('register/', RegisterView.as_view(),name='register'),
    path('login/', LoginView.as_view()),
    path('otp/', OTPView.as_view()),
    path('verify-otp/', OTPView.as_view()),
]
