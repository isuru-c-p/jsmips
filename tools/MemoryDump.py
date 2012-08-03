import sys
import mips32emu.DbgEngine

dbg = mips32emu.DbgEngine.DbgEngine()


if len(sys.argv) == 1:
    r = xrange(dbg.getPhysMemorySize())
elif len(sys.argv) == 2:
    r = xrange(int(sys.argv[1],16),dbg.getPhysMemorySize())
elif len(sys.argv) == 3: 
    r = xrange(int(sys.argv[1],16),int(sys.argv[2],16))
else:
    raise Exception("incorrect arguments")

for i in r:
    sys.stdout.write(chr(dbg.readByte(i,True)))
    sys.stdout.flush()
