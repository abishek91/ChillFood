# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-21 00:44
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0019_auto_20161119_1941'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='remote_pic',
            field=models.CharField(blank=True, max_length=2000),
        ),
    ]
