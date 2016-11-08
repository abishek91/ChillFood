# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-06 06:19
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0007_auto_20161106_0314'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='difficulty',
            field=models.DecimalField(blank=True, decimal_places=1, max_digits=2, null=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='tastiness',
            field=models.DecimalField(blank=True, decimal_places=1, max_digits=2, null=True),
        ),
        migrations.AlterField(
            model_name='comment',
            name='text',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
