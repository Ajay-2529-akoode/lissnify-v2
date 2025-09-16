# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from django.urls import path
# from django.template.response import TemplateResponse
# from .models import User, Category, Seeker, Listener, Connections


# class CustomUserAdmin(UserAdmin):
#     model = User
#     list_display = ('u_id', 'username', 'email', 'role', 'is_verified', 'status', 'is_staff', 'is_active', 'date_joined')
#     list_filter = ('role', 'is_verified', 'status', 'is_staff', 'is_active')
#     search_fields = ('username', 'email')
#     ordering = ('u_id',)

#     fieldsets = (
#         (None, {'fields': ('username', 'email', 'password')}),
#         ('Personal Info', {'fields': ('first_name', 'last_name', 'DOB')}),
#         ('Permissions', {'fields': ('role', 'is_verified', 'status', 'user_status', 'is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
#         ('Important Dates', {'fields': ('last_login', 'date_joined')}),
#     )

#     add_fieldsets = (
#         (None, {
#             'classes': ('wide',),
#             'fields': ('username', 'email', 'role', 'password1', 'password2', 'is_staff', 'is_active'),
#         }),
#     )


# # Custom Admin Site
# class MyAdminSite(admin.AdminSite):
#     site_header = 'lissnify Admin'
#     site_title = 'lissnify Admin Portal'
#     index_title = 'Welcome to lissnify Admin'

#     def get_urls(self):
#         urls = super().get_urls()
#         custom_urls = [
#             path('custom-dashboard/', self.admin_view(self.custom_dashboard))
#         ]
#         return custom_urls + urls

#     def custom_dashboard(self, request):
#         # Custom dashboard view logic
#         context = dict(
#             self.each_context(request),
#             key_value="Custom Dashboard Data",
#         )
#         return TemplateResponse(request, "admin/custom_dashboard.html", context)


# # Register models
# custom_admin_site = MyAdminSite(name='myadmin')
# custom_admin_site.register(User, CustomUserAdmin)
# custom_admin_site.register(Category)
# custom_admin_site.register(Seeker)
# custom_admin_site.register(Listener)
# custom_admin_site.register(Connections)
