from django.contrib import admin
from .models import Station, Installation, Sensor, Message


admin.site.register(Station)
admin.site.register(Installation)
admin.site.register(Sensor)
admin.site.register(Message)
