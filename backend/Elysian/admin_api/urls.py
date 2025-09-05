from django.urls import path
from .views import (
    DashboardStatsView,
    UserGrowthChartView,
    ActiveUsersChartView,
    UserListView,
    UserDetailView,
    CreateUserView,
    UpdateUserView,
    DeleteUserView,
    CategoryListCreateView,
    CategoryDetailView,           # ✅ newly added
    AdminLogin,
    ToggleUserActive,
    GetConnectionsList
    )

urlpatterns = [
    # ✅ Dashboard
    #path("verify-otp/", AdminVerifyOTP.as_view(), name="admin-verify-otp"),
    path("login/", AdminLogin.as_view(), name="admin-login"),
    path("dashboard/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("user-growth/", UserGrowthChartView.as_view(), name="user-growth"),
    path("active-users/", ActiveUsersChartView.as_view(), name="active-users"),
    path("users/toggle-active/", ToggleUserActive.as_view(), name="toggle-user-active"),
    # ✅ User CRUD
    path("users/", UserListView.as_view(), name="user-list"),                     # list all
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),        # detail by pk
    path("users/create/", CreateUserView.as_view(), name="create-user"),          # create
    path("updatesUser/<str:u_id>/update/", UpdateUserView.as_view(), name="update-user"),  # update by u_id
    path("users/<str:u_id>/delete/", DeleteUserView.as_view(), name="delete-user"),       # ✅ delete by u_id
    path("connections/", GetConnectionsList.as_view(), name="connection-list"),                     # list all
    # ✅ Category CRUD
    path("categories/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:id>/", CategoryDetailView.as_view(), name="category-detail"), # detail by pk
    path("users/<str:u_id>/delete/", DeleteUserView.as_view(), name="delete-user"),  
    
    # path("connections/", GetConnectionsList.as_view(), name="connection-list"),
            # ✅ delete by u_id
]
