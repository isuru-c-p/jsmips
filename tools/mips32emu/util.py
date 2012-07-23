

class Cache(object):
    def __init__(self,n):
        self.c = {}
        self.n = n
    def get(self,k):
        self.c[k][0] += 1
        return self.c[k][1]
    def put(self,k,v):
        if len(self.c) > self.n:
            self.purge()
        self.c[k] = [0,v]
    def dirty(self):
        self.c = {}
    def purge(self):
        for i in range(self.n // 10):
            k = min(self.c , key=lambda x : self.c[x][0] )
            del self.c[k]
