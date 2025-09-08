# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DashboardStatsView, UserGrowthChartView, ActiveUsersChartView, UserListView, 
    UserDetailView, CreateUserView, UpdateUserView, DeleteUserView, 
    CategoryListCreateView, CategoryDetailView, AdminLogin, ToggleUserActive, 
    GetConnectionsList, BlogListCreateView, BlogDetailView, TestimonialViewSet
)


urlpatterns = [
    # ✅ Dashboard
    path("login/", AdminLogin.as_view(), name="admin-login"),
    path("dashboard/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("user-growth/", UserGrowthChartView.as_view(), name="user-growth"),
    path("active-users/", ActiveUsersChartView.as_view(), name="active-users"),
    path("users/toggle-active/", ToggleUserActive.as_view(), name="toggle-user-active"),

    # ✅ User CRUD
    path("users/", UserListView.as_view(), name="user-list"),
    path("users/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("users/create/", CreateUserView.as_view(), name="create-user"),
    path("updatesUser/<str:u_id>/update/", UpdateUserView.as_view(), name="update-user"),
    path("users/<str:u_id>/delete/", DeleteUserView.as_view(), name="delete-user"),

    # ✅ Category CRUD
    path("categories/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:id>/", CategoryDetailView.as_view(), name="category-detail"),

    # ✅ Blog CRUD
    path("blogs/", BlogListCreateView.as_view(), name="blog-list-create"),
    path("blogs/<int:id>/", BlogDetailView.as_view(), name="blog-detail"),

    # ✅ Include router URLs
    path("testimonials/", TestimonialViewSet.as_view(), name="testimonial-list-create"),
    path("testimonials/<int:pk>/", TestimonialViewSet.as_view(), name="testimonial-detail"),
    
]
