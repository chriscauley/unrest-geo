from django.db import models
from django.conf import settings

def parseGame(s):
    W, H, M, S = [int(n) for n in s.split('-')[0].split('x')]
    x = S % W
    y = int(S / W)
    return dict(W=W, H=H, M=M, S=S, x=x, y=y)

class GameCompletion(models.Model):
    game = models.CharField(max_length=32) # "WxHxM"
    seed = models.IntegerField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    first = models.BooleanField()
    emoji = models.CharField(max_length=8)
    created = models.DateTimeField(auto_now_add=True)
    def save(self, *args, **kwargs):
        new = self.pk is None
        super().save(*args, **kwargs)
        if new:
            cache, _ = GameCache.objects.get_or_create(game=self.game)
            if not cache.first_user[self.seed]:
                cache.first_user[self.seed] = self.user
                cache.first_emoji[self.seed] = self.emoji
                self.first = True
            cache.first_user[self.seed] = self.user
            cache.first_emoji[self.seed] = self.emoji
            cache.save()

class GameCache(models.Model):
    game = models.CharField(max_length=32) # "WxHxMx0" x0 is there to make parseGame not fail
    first_emoji = models.JSONField(models.CharField(max_length=8, blank=True), default=list)
    last_emoji = models.JSONField(models.CharField(max_length=8, blank=True), default=list)
    first_user_id = models.JSONField(models.IntegerField(null=True), default=list)
    last_user_id = models.JSONField(models.IntegerField(null=True), default=list)

    def save(self, *args, **kwargs):
        new = self.pk is None
        super().save(*args, **kwargs)
        if new:
            config = parseGame(self.game)
            AREA = config['W'] * config['H']
            self.first_emoji = ['' for _ in range(AREA)]
            self.first_user = [None for _ in range(AREA)]
            self.last_emoji = ['' for _ in range(AREA)]
            self.last_user = [None for _ in range(AREA)]
