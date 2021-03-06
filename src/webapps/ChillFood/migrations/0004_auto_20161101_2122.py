# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-02 01:22
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0003_auto_20161101_2100'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='person',
            name='user',
        ),
        migrations.RemoveField(
            model_name='comment',
            name='person',
        ),
        migrations.RemoveField(
            model_name='preferences',
            name='person',
        ),
        migrations.AddField(
            model_name='comment',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='preferences',
            name='user',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='user',
            name='location',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='cook',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='Person',
        ),
    ]
