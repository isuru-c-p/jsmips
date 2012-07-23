import os
import subprocess

targets = [
    "./node/node_4kc.parts",
    "./browser/browser_4kc.parts"
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
os.chdir("common/autogen")
subprocess.check_call(['python','build.py'])
os.chdir(curDir)

   
for target in targets:
    try:
        buildFile(target)
        print("target built: %s"%target)
    except:
        print("target failed: %s"%target)
