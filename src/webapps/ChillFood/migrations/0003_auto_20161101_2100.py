# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-02 01:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0002_auto_20161101_2058'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='views',
            field=models.IntegerField(default=0),
        ),
    ]