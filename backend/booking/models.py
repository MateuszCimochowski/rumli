from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class Room(models.Model):
    name = models.CharField(max_length=120, unique=True)
    location = models.CharField(max_length=120, blank=True)
    capacity = models.PositiveIntegerField(default=1)

    def __str__(self) -> str:
        return self.name


class Reservation(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reservations"
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="reservations")
    start_at = models.DateTimeField()
    end_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["start_at", "room_id"]
        indexes = [
            models.Index(fields=["room", "start_at", "end_at"]),
            models.Index(fields=["user", "start_at", "end_at"]),
        ]

    def clean(self) -> None:
        if self.start_at >= self.end_at:
            raise ValidationError({"end_at": "end_at must be after start_at"})
        if timezone.is_naive(self.start_at) or timezone.is_naive(self.end_at):
            raise ValidationError("start_at and end_at must be timezone-aware")

    def __str__(self) -> str:
        return f"{self.room} {self.start_at:%Y-%m-%d %H:%M}–{self.end_at:%H:%M} ({self.user})"
