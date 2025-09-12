# myapp/urls.py
from django.urls import path
from .views import RegisterView,UserProfileView, LoginView,OTPView,ForgotPassword,CategoryList,ListenersBasedOnPreference,ConnectionRequest,ConnectionList,AcceptConnection,AcceptedListSeeker,TestAPIView,LogoutView,ListenerListCreateView,getConnectionListForListener,BlogCreateView,BlogDetailBySlugView,ListenerProfile,NotificationListView,NotificationDetailView,NotificationMarkAllReadView,NotificationStatsView,NotificationSettingsView,CreateMessageNotificationView,TestNotificationView,TestimonialView,TestimonialDetailView

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
    path('get-connection-list/', getConnectionListForListener.as_view()),
    path('user-profile/', UserProfileView.as_view()),
    path('blogs/',BlogCreateView.as_view()),
    path('blogs/<str:slug>/',BlogDetailBySlugView.as_view()),
    path('listener-profile/',ListenerProfile.as_view()),
    
    # Notification URLs
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:notification_id>/', NotificationDetailView.as_view(), name='notification-detail'),
    path('notifications/mark-all-read/', NotificationMarkAllReadView.as_view(), name='notification-mark-all-read'),
    path('notifications/stats/', NotificationStatsView.as_view(), name='notification-stats'),
    path('notifications/settings/', NotificationSettingsView.as_view(), name='notification-settings'),
    path('notifications/create-message/', CreateMessageNotificationView.as_view(), name='create-message-notification'),
    path('notifications/test/', TestNotificationView.as_view(), name='test-notification'),
    
    # Testimonial URLs
    path('testimonials/', TestimonialView.as_view(), name='testimonial-list-create'),
    path('testimonials/<int:pk>/', TestimonialDetailView.as_view(), name='testimonial-detail'),
   
]

