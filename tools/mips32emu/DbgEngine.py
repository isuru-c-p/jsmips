import util
import tempfile
import os
import subprocess
import struct
import socket

class CommandException(Exception):
    pass

class DbgEngine(object):
    def __init__(self):
        try:
            self.reconnect()
        except socket.error:
            pass
        self.pctofnLookup = {}
        self.disasmCache = util.Cache(50000)
    def reconnect(self):
        self.s =  socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.s.connect(('localhost', 8123))

    
    def ping(self):
        self.readReg("PC")
    def pingAndReconnect(self):
        try:
            self.ping()
        except socket.error:
            self.reconnect()
    
    def disassemble(self,op):
        try:
            return self.disasmCache.get(op)
        except:
            t,fname = tempfile.mkstemp()
            os.write(t,struct.pack(">L",op))
            os.close(t)
            dis = subprocess.check_output(['mips-linux-objdump','-bbinary', '-mmips','-EB',  '-D', fname])
            os.remove(fname)
            dis = [l[6:] for l in dis.split("\n") if l.startswith("   0:\t") ].pop()
            self.disasmCache.put(op,dis)
            return dis
    def dbgBreak(self):
        self.s.send("break\n")
        res = self.s.recv(1024)
        if res.startswith('ok'):
            return
        else:
            raise CommandException("break failed")
    def step(self):
        self.s.send("step\n")
        res = self.s.recv(1024)
        if res.startswith('ok'):
            return
        else:
            raise CommandException("step failed") 
    def readByte(self,addr,phys):
        if phys:
            c = 'readpb '
        else:
            c = 'readb '
        self.s.send(c+hex(addr)+'\n')
        res = self.s.recv(1024)
        if res.startswith('ok'):
            return int(res.split(' ')[1],16)
        else:
            raise CommandException("reading byte failed")
    def readWord(self,addr):
        self.s.send("readword "+hex(addr)+'\n')
        res = self.s.recv(1024)
        if res.startswith('ok'):
            return int(res.split(' ')[1],16)
        else:
            raise CommandException("reading byte failed")
    def writeByte(self,addr,val):
        assert( 0 <= val < 256)
        self.s.send("writeb "+hex(addr)+" "+hex(val)+'\n')
        res = self.s.recv(1024)
        if not res.startswith('ok'):
            raise CommandException("writing byte failed - "+res)
    def readReg(self,r):
        self.s.send("readreg "+r+'\n')
        res = self.s.recv(1024)
        if res.startswith('ok'):
            return int(res.split(' ')[1],16)
        else:
            raise CommandException("reading register failed")
    def writeReg(self,r,val):
        assert( 0 <= val < 2**32)
        self.s.send("writereg "+r+" "+hex(val)+'\n')
        res = self.s.recv(1024)
        if not res.startswith('ok'):
            raise CommandException("writing reg failed - "+res)
    def isRunning(self):
        self.s.send("isrunning\n")
        res = self.s.recv(1024)
        if res.startswith('ok'):
            return res[3] == '1'
        raise CommandException("some strange error")
    def getPhysMemorySize(self):
        self.s.send("physmemsize");
        res = self.s.recv(1024)
        if res.startswith('ok'):
            return int(res.split(' ')[1],16)
        else:
            raise CommandException("reading physMemSize failed")
            
    def getFunctionName(self,pc):
        distance = 0xffffffff
        ret = "???"
        for k in self.pctofnLookup.keys():
            diff = pc - k
            if  diff < distance and diff >= 0:
                distance = diff
                ret = self.pctofnLookup[k]
        return ret
    def loadSystemMapFile(self,mf):
        self.pctofnLookup = {}
        for line in open(mf):
            fields = line.split(" ")
            addr = int(fields[0],16)
            fn = fields[2].strip()
            self.pctofnLookup[addr] = fn

    def loadSrec(self,srecString,setEntry):
        self.s.send("loadsrec %s %s" % (setEntry,srecString))
        res = self.s.recv(1024)
        if not res.startswith('ok'):
            raise CommandException("loading srec string failed")
