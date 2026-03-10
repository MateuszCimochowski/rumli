from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AvailabilityView, ReservationViewSet, RoomViewSet

router = DefaultRouter()
router.register(r"rooms", RoomViewSet, basename="room")
router.register(r"reservations", ReservationViewSet, basename="reservation")

urlpatterns = [
    path("rooms/availability/", AvailabilityView.as_view(), name="room-availability"),
    path("", include(router.urls)),
]

