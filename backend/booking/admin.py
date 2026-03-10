from django.contrib import admin

from .models import Reservation, Room


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ["name", "location", "capacity"]
    search_fields = ["name", "location"]


@admin.register(Reservation)
class ReservationAdmin(admin.ModelAdmin):
    list_display = ["room", "user", "start_at", "end_at", "created_at"]
    list_filter = ["room"]
    search_fields = ["room__name", "user__username"]
