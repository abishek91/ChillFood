# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-28 05:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0010_auto_20161028_0422'),
    ]

    operations = [
        migrations.AlterField(
            model_name='step',
            name='instruction',
            field=models.CharField(max_length=1000),
        ),
    ]