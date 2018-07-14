from django.urls import path

from .views import MainTraceView

app_name = 'tracer'

urlpatterns = [
    path('', MainTraceView.as_view(), name="main_tracer"),
]
