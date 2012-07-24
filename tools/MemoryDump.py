import sys
import mips32emu.DbgEngine

dbg = mips32emu.DbgEngine.DbgEngine()

for i in range(dbg.getPhysMemorySize()):
    sys.stdout.write(chr(dbg.readByte(i)))
    sys.stdout.flush()
