# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-18 00:09
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0014_auto_20161117_1908'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='preferences',
            name='calories',
        ),
    ]
