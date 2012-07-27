import sys
import time
import mips32emu.DbgEngine
import re



lookup = {}

def getFunctionName(pc):
    distance = 0xffffffff
    ret = "???"
    for k in lookup.keys():
        diff = pc - k
        if  diff < distance and diff >= 0:
            distance = diff
            ret = lookup[k]
    return ret

if len(sys.argv) == 2:
    for line in open(sys.argv[1]):
        fields = line.split(" ")
        addr = int(fields[0],16)
        fn = fields[2].strip()
        lookup[addr] = fn

dbg = mips32emu.DbgEngine.DbgEngine()

while 1:
    time.sleep(1)
    pc = dbg.readReg("PC")
    print("PC: %08X  (%s)"%(pc,lookup.get(pc,getFunctionName(pc))))
