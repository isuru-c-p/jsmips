import sys
import time
import mips32emu.DbgEngine
import socket


dbg = mips32emu.DbgEngine.DbgEngine()

if len(sys.argv) >= 2:
    dbg.loadSystemMapFile(sys.argv[1])
    

while 1:
    try:
        time.sleep(2)
        pc = dbg.readReg("PC")
        print("PC: %08X  (%s)"%(pc,dbg.getFunctionName(pc)))
    except socket.error:
        try:
            dbg.pingAndReconnect()
        except socket.error as e:
            print("reconnect failed..." + str(e))
