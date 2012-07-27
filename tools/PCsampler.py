import sys
import time
import mips32emu.DbgEngine



dbg = mips32emu.DbgEngine.DbgEngine()

if len(sys.argv) >= 2:
    dbg.loadSystemMapFile(sys.argv[1])
    

while 1:
    time.sleep(1)
    pc = dbg.readReg("PC")
    print("PC: %08X  (%s)"%(pc,dbg.getFunctionName(pc)))
