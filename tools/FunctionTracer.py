import sys
import mips32emu.DbgEngine



dbg = mips32emu.DbgEngine.DbgEngine()

if len(sys.argv) >= 2:
    dbg.loadSystemMapFile(sys.argv[1])
else:
    raise Exception("function trace requires a system.map file")

pfn = ""
while 1:
    dbg.step()
    pc = dbg.readReg("PC")
    fn = dbg.getFunctionName(pc)
    if fn != pfn:
        print(fn)
        pfn = fn
