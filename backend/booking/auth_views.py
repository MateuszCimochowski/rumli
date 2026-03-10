from django.contrib.auth import get_user_model
from django.db import IntegrityError
from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = (request.data.get("username") or "").strip()
        password = request.data.get("password") or ""

        if not username:
            return Response({"username": "username is required"}, status=status.HTTP_400_BAD_REQUEST)
        if len(password) < 8:
            return Response(
                {"password": "password must be at least 8 characters"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        User = get_user_model()
        try:
            user = User.objects.create_user(username=username, password=password)
        except IntegrityError:
            return Response(
                {"username": "This username is already taken"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_201_CREATED)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        u = request.user
        return Response({"id": u.id, "username": u.username, "is_staff": u.is_staff})


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

