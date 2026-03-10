from django.utils.dateparse import parse_datetime
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Reservation, Room
from .serializers import ReservationSerializer, RoomSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().order_by("name")
    serializer_class = RoomSerializer
    permission_classes = [IsAdminOrReadOnly]


class ReservationViewSet(viewsets.ModelViewSet):
    serializer_class = ReservationSerializer
    http_method_names = ["get", "post", "delete", "head", "options"]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Reservation.objects.select_related("room", "user").order_by("start_at")
        if self.request.user.is_staff:
            return qs
        return qs.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_staff and instance.user_id != request.user.id:
            return Response(status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=["get"], url_path="mine")
    def mine(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)


class AvailabilityView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        start = parse_datetime(request.query_params.get("start", ""))
        end = parse_datetime(request.query_params.get("end", ""))
        if not start or not end:
            return Response(
                {"detail": "Query params 'start' and 'end' (ISO datetime) are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if start >= end:
            return Response(
                {"detail": "'end' must be after 'start'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        busy_room_ids = (
            Reservation.objects.filter(start_at__lt=end, end_at__gt=start)
            .values_list("room_id", flat=True)
            .distinct()
        )
        available = Room.objects.exclude(id__in=busy_room_ids).order_by("name")
        return Response(RoomSerializer(available, many=True).data)
