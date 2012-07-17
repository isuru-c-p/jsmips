

class Table(object):
    def __init__(self,s):
        self.cols = []
        x = s.split('\n')
        x = x[3:]
        cols += [[op for ops in x.split(' ')]]
        
    def __repr__(self):
        


rawTables = open("optables.txt").read().split('----')
rawTables = [t.trim() for t in rawTables]
tables = [ Table(t) for t in rawTables ]

allOpcodes = set([])

for t in tables:
