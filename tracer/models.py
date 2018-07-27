from django.db import models

class JeepneyRoute(models.Model):
    name = models.CharField(max_length=255)
    coordinates = models.TextField(null=True, blank=True)
