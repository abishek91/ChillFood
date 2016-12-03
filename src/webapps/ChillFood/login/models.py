from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.exceptions import ValidationError
from django.core import serializers
from math import radians, cos, sin, asin, sqrt
import datetime, sys


# Validators
def no_future_dates(value):
  if value >= datetime.date.today():
    raise ValidationError("This date needs to be in the past.")

class User(AbstractUser):
  name = models.TextField(max_length=100)
  bio = models.TextField(max_length=420, blank=True)
  birthdate = models.DateField(null=True, blank=True, validators=[no_future_dates])
  photo = models.CharField(max_length = 2000, blank=True)
  following = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='followers', symmetrical=False)
  is_confirmed = models.BooleanField(default=False)
  location_lat = models.DecimalField(max_digits=9, decimal_places=6, default=0)
  location_lon = models.DecimalField(max_digits=9, decimal_places=6, default=0)
  
  def __unicode__(self):
    return self.name

  def get_full_name(self):
    if len(self.name):
      return self.name
    return '%s %s' % (self.first_name, self.last_name)

  def to_json(self):
    return {
      "id": self.id,
      "name": self.get_full_name(),
      "photo": str(self.photo),
      "bio": self.bio,
      "birthdate": self.birthdate,
      "following": serializers.serialize('json',self.following.all()),
      "followers": serializers.serialize('json',self.followers.all())
    }

  def to_json_full(self):
    return {
      "id": self.id,
      "name": self.name,
      "photo": str(self.photo),
      "preferences": self.preferences.to_json()
    }

  def get_age(self):
    from datetime import date
    today = date.today()

    if self.birthdate:
      return today.year - self.birthdate.year - (
        (today.month, today.day) < (self.birthdate.month, self.birthdate.day))
    else:
      return 0

  age = property(get_age)

  def distance(self,lon,lat):
    """
    Calculate the great circle distance between two points 
    on the earth (specified in decimal degrees)
    """
    if not self.location_lon or not self.location_lat:
      return None

    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [self.location_lon, self.location_lat, lon, lat])
    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    km = 6367 * c
    return km
