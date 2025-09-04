# your_app/middleware.py

from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from urllib.parse import parse_qs

@database_sync_to_async
def get_user_from_token(token_key):
    """
    Asynchronously retrieves a user from the database given a JWT.
    Returns AnonymousUser if the token is invalid or the user is not found.
    """
    User = get_user_model()
    try:
        access_token = AccessToken(token_key)
        user_id = access_token['user_id']
        return User.objects.get(u_id=user_id)
    except (InvalidToken, TokenError, User.DoesNotExist):
        return AnonymousUser()

class JWTAuthMiddleware:
    """
    Custom JWT authentication middleware for Django Channels.
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # scope['query_string'] is a bytes string, so we decode it.
        query_params = parse_qs(scope.get('query_string', b'').decode("utf-8"))
        token = query_params.get('token', [None])[0]

        if token:
            # Asynchronously get the user and attach it to the scope.
            scope['user'] = await get_user_from_token(token)
        else:
            scope['user'] = AnonymousUser()

        # Call the next application in the stack.
        return await self.app(scope, receive, send)