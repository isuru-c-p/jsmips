targets = [
    "node_4kc.parts",
]



def buildFile(partsfile):
    out = open(partsfile[:-1*len('.parts')] + ".js" , 'w')
    for fname in open(partsfile):
        fname = fname.strip()
        for num,line in enumerate(open(fname)):
            line = line.rstrip()
            out.write(line + " // %s:%d\n"%(fname,num))
    out.flush()
    out.close()
            
            
for target in targets:
    buildFile(target)
