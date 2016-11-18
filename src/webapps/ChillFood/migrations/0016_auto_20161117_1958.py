# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-18 00:58
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0015_remove_preferences_calories'),
    ]

    operations = [
        migrations.RenameField(
            model_name='recipe',
            old_name='category',
            new_name='category_set',
        ),
        migrations.RenameField(
            model_name='recipe',
            old_name='cuisine',
            new_name='cuisine_set',
        ),
        migrations.RenameField(
            model_name='recipe',
            old_name='equipment',
            new_name='equipment_set',
        ),
    ]
