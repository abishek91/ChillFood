from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.exceptions import ValidationError
import datetime


# Validators
def no_future_dates(value):
  if value >= datetime.date.today():
    raise ValidationError("This date needs to be in the past.")

class User(AbstractUser):
  name = models.TextField(max_length=100)
  bio = models.TextField(max_length=420, blank=True)
  birthdate = models.DateField(null=True, blank=True, validators=[no_future_dates])
  photo = models.ImageField(upload_to="user_photo", blank=True)
  following = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='followers', symmetrical=False)
  is_confirmed = models.BooleanField(default=False)
  
  def __unicode__(self):
    return self.get_full_name

  def to_json(self):
    return {
      "id": self.id,
      "name": self.get_full_name(),
      "photo": str(self.photo)
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
