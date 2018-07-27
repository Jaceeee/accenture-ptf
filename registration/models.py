from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


# Create your models here.
class PasaHeroUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    created_date = models.DateTimeField('date created')

    def __str__(self):
        return '{} {}'.format(self.first_name, self.last_name)

    def save(self, *args, **kwargs):
        if self.created_date is None:
            self.created_date = timezone.now()
        return super(PasaHeroUser, self).save(*args, **kwargs)
