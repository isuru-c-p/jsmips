import util
import tempfile
import os
import subprocess
import struct
import socket

class DbgEngine(object):
    def __init__(self):
        self.s =  socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.s.connect(('localhost', 8123))
        self.disasmCache = util.Cache(50000)
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
    def readByte(self,addr):
        self.s.send("readb "+hex(addr)+'\n')
        res = self.s.recv(1024)
        if res.startswith('ok'):
            return int(res.split(' ')[1],16)
        else:
            raise Exception("reading register failed")
    def readReg(self,r):
        self.s.send("readreg "+r+'\n')
        res = self.s.recv(1024)
        if res.startswith('ok'):
            return int(res.split(' ')[1],16)
        else:
            raise Exception("reading register failed")
    def isRunning(self):
        self.s.send("isrunning\n")
        res = self.s.recv(1024)
        if res.startswith('ok'):
            return res[3] == '1'
        raise Exception("some strange error")
