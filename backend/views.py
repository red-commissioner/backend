#!/usr/bin/env python
#-*- coding: utf-8 -*
from datetime import datetime, timedelta

from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

from .models import Station, Sensor, Message, Installation


messages = Message.objects.all()
installations = Installation.objects.all()
stations = Station.objects.all()


def global_context():
    return {
        'installations': installations,
        'all_stations': stations,
        'messages': messages,
        'total_messages': len(messages),
    }


@login_required
def dashboard(request):
    return render(request, 'index.html', context=global_context())


@login_required
def installation(request, installation_name):
    installation = Installation.objects.get(slug=installation_name)
    stations = Station.objects.filter(installation=installation)

    return render(request, 'installation.html', context={
        'stations': stations,
        'name': installation.name,
        **global_context()
    })


@login_required
def station(request, installation_name, station_name):

    station = Station.objects.get(slug=station_name)
    status_icon = {
        'SH': 'house-return',
        'H': 'home',
        'CP': 'soap',
        'S': 'sunset',
        'GT': 'ghost',
        'T': 'paw',
        'EM': 'question',
        'M': 'hand-paper',
        'A': 'exclamation-triangle',
    }

    station = Station.objects.get(slug=station_name)

    return render(request, 'station.html', context={
        'station': station,
        'current_status_icon': status_icon[station.status],
        'station_has_messages': any([sensor.messages() for sensor in station.sensors()]),
        **global_context()
    })


#TODO: Fix this...
@csrf_exempt
def sensor(request, station_id, sensor_name):
    if request.method == 'POST':
        try:
            data = request.POST
            m = Message.objects.create(
                topic=data['topic'],
                payload=data['payload']
            )
            sensor = None
            if sensor_name != 'command':
                sensor = Sensor.objects.get(
                    station=Station.objects.get(slug=station_id), 
                    name=sensor_name
                )
                m.sensor = sensor
            m.save()
            if m.pk:
                if sensor:
                    sensor.update_at = m.created_at
                return HttpResponse(status=200)

            raise Exception
        except ObjectDoesNotExist:
            return HttpResponse(status=400)
        except Exception as e:
            print(e)
            return HttpResponse(status=500)
