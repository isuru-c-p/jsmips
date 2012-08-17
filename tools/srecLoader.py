import sys
import mips32emu.DbgEngine
import os


if __name__ == "__main__":
    dbg = mips32emu.DbgEngine.DbgEngine()
    dbg.dbgBreak()

    if "--setentry" in sys.argv:
        setEntry = 1
    else:
        setEntry = 0

    #for line in open(sys.argv[1]):
    #    dbg.loadSrec(line,setEntry) 
    dbg.filesrecload(os.path.abspath(sys.argv[1]),setEntry)
        


#for l in open(sys.argv[1]):
#    t = l[1]
#    if l[0] != 'S':
#        raise Exception("bad srec entry - " + line)
#    if t == '0':
#        print ("ignoring srec header")
#    elif t == '1':
#        count = l[2:4] # we can probably ignore this
#        addr = l[4:8]
#        data = l[8:-2]
#        print("data 1 srec %s %s"%(addr,data))
#    elif t == '2':
#        count = l[2:4] # we can probably ignore this
#        addr = l[4:10]
#        data = l[10:-2]
#        print("data 2 srec %s %s"%(addr,data))
#    elif t == '3':
#        count = l[2:4] # we can probably ignore this
#        addr = l[4:12]
#        data = l[12:-2]
#        print("data 3 srec %s %s"%(addr,data))
#    elif t == '5':
#        print ("ignoring srec record count field")
#   elif t == '7' or t == '8' or t =='9':
#        count = int(l[2:4],16)*2 - 2
#        addr = l[4:4+count]
#        print("entry point srec: %s"%addr)
#        if "--setentry" in sys.argv:
#            print("setting PC to entry point")
#            dbg.writeReg('PC',int(addr,16))
#    else:
#        raise Exception("unknown screc type")
#        
#    if t in ['1','2','3']:
#        assert(len(data) % 2 == 0)
#        addr = int(addr,16)
#        for offset,i in enumerate(range(0,len(data),2)):
#            b = int(data[i:i+2],16)
#            dbg.writeByte(addr+offset,b)
