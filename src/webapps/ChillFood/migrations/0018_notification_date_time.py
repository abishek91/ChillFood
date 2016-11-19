# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-19 02:23
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0017_notification'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='date_time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
