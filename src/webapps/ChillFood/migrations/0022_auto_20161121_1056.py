# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-21 15:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0021_auto_20161121_1047'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='location_lat',
            field=models.DecimalField(decimal_places=6, default=0, max_digits=9),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='user',
            name='location_lon',
            field=models.DecimalField(decimal_places=6, default=0, max_digits=9),
            preserve_default=False,
        ),
    ]
