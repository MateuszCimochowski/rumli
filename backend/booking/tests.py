from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APIClient, APITestCase

from .models import Reservation, Room


class ReservationOverlapTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="alice", password="pass1234!")
        self.room = Room.objects.create(name="Room A", location="1st floor", capacity=6)
        self.client = APIClient()

        # login -> token
        resp = self.client.post(
            "/api/auth/login/", {"username": "alice", "password": "pass1234!"}, format="json"
        )
        self.token = resp.data["token"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token}")

    def test_cannot_double_book_room_same_time(self):
        start = timezone.now() + timezone.timedelta(hours=2)
        end = start + timezone.timedelta(hours=1)

        Reservation.objects.create(user=self.user, room=self.room, start_at=start, end_at=end)

        resp = self.client.post(
            "/api/reservations/",
            {"room": self.room.id, "start_at": start.isoformat(), "end_at": end.isoformat()},
            format="json",
        )
        self.assertEqual(resp.status_code, 400)

    def test_can_book_non_overlapping(self):
        start1 = timezone.now() + timezone.timedelta(hours=2)
        end1 = start1 + timezone.timedelta(hours=1)
        start2 = end1 + timezone.timedelta(minutes=1)
        end2 = start2 + timezone.timedelta(hours=1)

        Reservation.objects.create(user=self.user, room=self.room, start_at=start1, end_at=end1)

        resp = self.client.post(
            "/api/reservations/",
            {"room": self.room.id, "start_at": start2.isoformat(), "end_at": end2.isoformat()},
            format="json",
        )
        self.assertEqual(resp.status_code, 201)
