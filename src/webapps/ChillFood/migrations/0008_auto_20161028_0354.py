# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-28 03:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0007_auto_20161027_2215'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(choices=[('veg', 'veg'), ('vegan', 'vegan'), ('non-veg', 'non-veg')], max_length=200),
        ),
    ]
