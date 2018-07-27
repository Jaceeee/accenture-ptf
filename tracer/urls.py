from django.urls import path

from .views import MainTraceView, save_route

app_name = 'tracer'

urlpatterns = [
    path('', MainTraceView.as_view(), name="main_tracer"),
    path('save_route/', save_route, name="save_route"),
]
