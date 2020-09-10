from django.db import models
from django.conf import settings

def parseGame(s):
    W, H, M = [int(n) for n in s.split('-')[0].split('x')]
    return dict(W=W, H=H, M=M)

class GameCompletion(models.Model):
    game = models.CharField(max_length=32) # "WxHxM"
    seed = models.IntegerField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    session = models.ForeignKey('sessions.Session', null=True, on_delete=models.SET_NULL)
    first = models.BooleanField(default=False)
    flag = models.CharField(max_length=8)
    created = models.DateTimeField(auto_now_add=True)
    actions = models.JSONField(default=dict)
    def save(self, *args, **kwargs):
        cache, _ = GameCache.objects.get_or_create(game=self.game)
        if not cache.first_user_id[self.seed]:
            cache.first_user_id[self.seed] = self.user_id
            cache.first_flag[self.seed] = self.flag
            self.first = True
        cache.first_user_id[self.seed] = self.user_id
        cache.first_flag[self.seed] = self.flag
        cache.save()
        super().save(*args, **kwargs)

class GameCache(models.Model):
    game = models.CharField(max_length=32) # "WxHxM" is there to make parseGame not fail
    first_flag = models.JSONField(models.CharField(max_length=8, blank=True), default=list)
    last_flag = models.JSONField(models.CharField(max_length=8, blank=True), default=list)
    first_user_id = models.JSONField(models.IntegerField(null=True), default=list)
    last_user_id = models.JSONField(models.IntegerField(null=True), default=list)

    def to_json(self):
        return {
            key: getattr(self, key)
            for key in ['game', 'first_flag', 'last_flag']
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.first_flag:
            config = parseGame(self.game)
            AREA = config['W'] * config['H']
            self.first_flag = ['' for _ in range(AREA)]
            self.first_user_id = [None for _ in range(AREA)]
            self.last_flag = ['' for _ in range(AREA)]
            self.last_user_id = [None for _ in range(AREA)]
