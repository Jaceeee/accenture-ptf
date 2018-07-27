from django.shortcuts import render
from django.views import View
from django.http import JsonResponse
from .models import JeepneyRoute

# Create your views here.
class MainTraceView(View):

    def get(self, request):
        return render(request, 'tracer/index.html')


def save_route(request):
    route = JeepneyRoute(name=request.POST.get('name', None), coordinates=request.POST.get('coordinates', None))
    route.save()
    response = { "created": "Success" }
    return JsonResponse(response)
