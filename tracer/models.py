from django.db import models

class JeepneyRoute(models.Model):
    name = models.CharField()
    coordinates = models.TextField(null=True, blank=True)
