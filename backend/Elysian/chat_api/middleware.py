# In your app's middleware.py

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs

@database_sync_to_async
def get_user_from_token(token_key):
    """
    Asynchronously retrieves a user from the database given a JWT access token.
    Returns AnonymousUser if the token is invalid or the user doesn't exist.
    """
    User = get_user_model()
    try:
        # Decode the token to get the user_id
        access_token = AccessToken(token_key)
        user_id = access_token['user_id']
        return User.objects.get(id=user_id)
    except Exception:
        # Token is invalid, expired, or user not found
        return AnonymousUser()

class JWTAuthMiddleware:
    """
    Custom JWT authentication middleware for Django Channels.
    """
    def __init__(self, app):
        # Store the ASGI application we were passed
        self.app = app

    async def __call__(self, scope, receive, send):
        # The 'scope' dictionary contains connection information.
        # For WebSockets, query_string is where auth tokens are often sent.
        query_string = scope.get('query_string', b'').decode('utf-8')
        query_params = parse_qs(query_string)
        
        # Get token from query parameters, e.g., /ws/chat/2/?token=YOUR_JWT
        token = query_params.get('token', [None])[0]

        if token:
            # Get the user asynchronously and add it to the scope
            scope['user'] = await get_user_from_token(token)
        else:
            scope['user'] = AnonymousUser()

        # Call the next ASGI application in the stack
        return await self.app(scope, receive, send)