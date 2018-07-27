from django.contrib import admin

from .models import PasaHeroUser
# Register your models here.

class PasaHeroAdmin(admin.ModelAdmin):
	fieldsets = [
		(None, {'fields': ['first_name']}),
		(None, {'fields': ['last_name']}),
		(None, {'fields': ['user']}),
		(None, {'fields': ['created_date']}),
	]


admin.site.register(PasaHeroUser, PasaHeroAdmin)