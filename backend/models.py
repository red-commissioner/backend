from django.db import models
from django.contrib.auth import get_user_model


class Installation(models.Model):
    name = models.CharField(max_length=30, blank=True)
    slug = models.SlugField(max_length=30)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    ip_address = models.GenericIPAddressField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    location = models.CharField(max_length=30)
    updated_at = models.DateTimeField(null=True)
    
    def position(self):
        return self.latitude, self.longitude

    def __str__(self):
        return f'{self.name} ({self.ip_address}) - {self.location}'


class Station(models.Model):
    STATUS = [
        ('SH', 'Seek Home'),
        ('H', 'Home'),
        ('CP', 'Clean Position'),
        ('S', 'Sunset'),
        ('GT', 'Ghost Tracking'),
        ('T', 'Tracking'),
        ('EM', 'EM Position'),
        ('M', 'Manual Mode'),
        ('A', 'Alarm'),
    ]
    name = models.CharField(max_length=30, blank=True)
    slug = models.SlugField(max_length=30)
    status = models.CharField(max_length=2, choices=STATUS, default='H')
    installation = models.ForeignKey(Installation, on_delete=models.CASCADE)

    @property
    def sensors(self):
        return Sensor.objects.filter(station=self)

    def __str__(self):
        return f'{self.name}: {self.status}'


class Sensor(models.Model):
    station = models.ForeignKey(Station, on_delete=models.CASCADE)
    slug = models.SlugField(max_length=30, blank=True)
    updated_at = models.DateTimeField(null=True)

    @property
    def messages(self):
        return Message.objects.filter(sensor=self)

    def __str__(self):
        return f'{self.slug if self.slug else "Sensor of " + str(self.station)}'


class Message(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, null=True)
    topic = models.CharField(max_length=50)
    payload = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.topic} payload: {self.payload}'
