from django.shortcuts import render
from django.views import View


# Create your views here.
class MainTraceView(View):

    def get(self, request):
        return render(request, 'tracer/index.html')
