from django.http import JsonResponse
from server.models import GameCompletion, GameCache

import json

def complete_game(request):
    data = json.loads(request.body.decode('utf-8') or "{}")
    key, seed = data['key'].rsplit('x', 1)
    kwargs = { 'game': key, 'seed': int(seed) }
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

def game_leaderboards(request):
    return JsonResponse({ gc.game: gc.to_json() for gc in GameCache.objects.all()})