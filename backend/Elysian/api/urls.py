# myapp/urls.py
from django.urls import path
from .views import RegisterView, LoginView,OTPView,ForgotPassword,CategoryList,ListenersBasedOnPreference,ConnectionRequest,ConnectionList,AcceptConnection,AcceptedListSeeker,TestAPIView,LogoutView,ListenerListCreateView

urlpatterns = [
    path('register/', RegisterView.as_view(),name='register'),
    path('login/', LoginView.as_view(), name="user-login"),      
    path('verify-otp/', OTPView.as_view()),
    path('forgot-password/', ForgotPassword.as_view()),
    # path('select-category/', SelectCategory.as_view())
    path('categories/', CategoryList.as_view()),
    path('listeners-bop/', ListenersBasedOnPreference.as_view()),
    path('connections/', ConnectionList.as_view()),
    path('connection-request/', ConnectionRequest.as_view()),
    path('accept-connection/', AcceptConnection.as_view()),
    path('accepted-list-seeker/',AcceptedListSeeker.as_view()),
    path('test-api/', TestAPIView.as_view()),
    path('logout/', LogoutView.as_view()), 
    path('listenerList/', ListenerListCreateView.as_view()),   
]

