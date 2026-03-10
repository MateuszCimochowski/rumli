from django.utils import timezone
from rest_framework import serializers

from .models import Reservation, Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["id", "name", "location", "capacity"]


class ReservationSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    room_name = serializers.ReadOnlyField(source="room.name")

    class Meta:
        model = Reservation
        fields = ["id", "user", "room", "room_name", "start_at", "end_at", "created_at"]
        read_only_fields = ["id", "created_at", "user", "room_name"]

    def validate(self, attrs):
        request = self.context["request"]
        room = attrs.get("room") or getattr(self.instance, "room", None)
        start_at = attrs.get("start_at") or getattr(self.instance, "start_at", None)
        end_at = attrs.get("end_at") or getattr(self.instance, "end_at", None)

        if start_at is None or end_at is None or room is None:
            return attrs

        if start_at >= end_at:
            raise serializers.ValidationError({"end_at": "end_at must be after start_at"})
        if timezone.is_naive(start_at) or timezone.is_naive(end_at):
            raise serializers.ValidationError("start_at and end_at must be timezone-aware")

        qs = Reservation.objects.filter(room=room, start_at__lt=end_at, end_at__gt=start_at)
        if self.instance is not None:
            qs = qs.exclude(pk=self.instance.pk)

        if qs.exists():
            raise serializers.ValidationError(
                "This room is already reserved in the selected time range."
            )

        # Optional: prevent users from creating reservations in the past
        if start_at < timezone.now():
            raise serializers.ValidationError({"start_at": "start_at cannot be in the past"})

        # Ensure request exists (serializer used through API)
        _ = request.user

        return attrs

