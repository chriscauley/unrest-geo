from django.conf import settings
from django.contrib import admin
from django.urls import path, re_path, include

import server.forms # adds schema form urls
from server import views

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path('', include('unrest.urls')),
    path('api/complete_game/', views.complete_game),
]

if settings.DEBUG: # pragma: no cover
    from django.views.static import serve
    urlpatterns += [
        re_path(r'^media/(?P<path>.*)$', serve, {
            'document_root': settings.MEDIA_ROOT,
            'show_indexes': True
        }),
    ]

