# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-28 18:55
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0015_auto_20161028_1851'),
    ]

    operations = [
        migrations.RenameField(
            model_name='recipeingredient',
            old_name='Ingredient',
            new_name='ingredient',
        ),
    ]
