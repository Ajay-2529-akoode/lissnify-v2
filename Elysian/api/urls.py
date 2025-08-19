# myapp/urls.py
from django.urls import path
from .views import RegisterView, LoginView,OTPView,ForgotPassword,CategoryList

urlpatterns = [
    path('register/', RegisterView.as_view(),name='register'),
    path('login/', LoginView.as_view()),
    path('otp/', OTPView.as_view()),
    path('verify-otp/', OTPView.as_view()),
    path('forgot-password/', ForgotPassword.as_view()),
    # path('select-category/', SelectCategory.as_view())
    path('categories/', CategoryList.as_view()),
]
