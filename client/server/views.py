from django.http import JsonResponse
from server.models import GameCompletion

import json

def complete_game(request):
    data = json.loads(request.body.decode('utf-8') or "{}")
    kwargs = {
        'game': "{W}x{H}x{M}".format(**data),
        'seed': data['S'],
    }
    if request.user.is_authenticated:
        kwargs['user'] = request.user
    else:
        kwargs['session'] = request.sesssion
    gc = GameCompletion.objects.filter(**kwargs).first()
    if not gc:
        gc = GameCompletion.objects.create(flag=data['flag'], **kwargs)
    gc.flag = data['flag']
    gc.actions = data['actions']
    gc.save()
    return JsonResponse({})