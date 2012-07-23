import os
import subprocess

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
            
curDir = os.getcwd()
os.chdir("autogen")
subprocess.check_call(['python','build.py'])
os.chdir(curDir)

   
for target in targets:
    buildFile(target)
