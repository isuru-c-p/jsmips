import sys
import subprocess
import tempfile
import os
import struct
import traceback

def disassemble(opcode):
    t,fname = tempfile.mkstemp()
    os.write(t,struct.pack(">L",opcode))
    os.close(t)
    dis = subprocess.check_output(['mips-linux-objdump','-bbinary', '-mmips','-EB',  '-D', fname])
    os.remove(fname)
    return [l[6:] for l in dis.split("\n") if l.startswith("   0:\t") ].pop()

class Trace(object):
    def __init__(self,tracefile):
        self.traceData = open(tracefile).read().split('#')[:-1]
        self.pos = 0
        self.LO = 0
        self.HI = 0
        self.PC = 0
        self.OP = 0
        self.genRegs = [0 for i in range(32)]
        self.breakPoints = set([])
        self.dissassemblyCache = {}
        self.buildDisassemblyCache()
    def buildDisassemblyCache(self):
        print "building the disassembly cache..."
        while True:
            try:
                self.step('+')
            except:
                break
            if self.PC in self.dissassemblyCache:
                if self.OP != self.dissassemblyCache[self.PC][0]:
                    raise Exception("self modifying code unsupported")
            else:
                self.dissassemblyCache[self.PC] = [self.OP,disassemble(self.OP)]

        while True:
            try:
                self.step('-')
            except:
                break
    def getCachedDisassembly(self,addr):
        if addr not in self.dissassemblyCache.keys():
            return "PC: %08X ..."%(addr)
        return "PC: %08X %s"%(addr,self.dissassemblyCache[addr][1])
        
    def runUntilBreak(self,d):
        while True:
            self.step(d)
            if self.PC in self.breakPoints:
                return
    
    def step(self,d):
        if d not in ['+','-']:
            raise Exception("bad direction")
            
        if self.pos <= 0 and d == '-':
            raise Exception("already at start of trace!")
        if self.pos >= len(self.traceData) and d == '+':
            raise Exception("end of trace!")
            
        if self.pos == len(self.traceData):
            self.pos -= 1
            
        for l in self.traceData[self.pos].split('\n'):
            if l.startswith(d+'PC='):
                self.PC=int(l[4:],16)
            if l.startswith(d+'HI='):
                self.HI=int(l[4:],16)
            if l.startswith(d+'LO='):
                self.LO=int(l[4:],16)
            if l.startswith(d+'OP='):
                self.OP=int(l[4:],16)
            for i in range(32):
                s=d+'GR'+str(i)+'='
                if l.startswith(s):
                    self.genRegs[i] = int(l[len(s):],16)
        if d == '+':
            self.pos += 1
        if d == '-':
            self.pos -= 1
           
    def addBreakPoint(self,addr):
        self.breakPoints.add(int(addr,16))
        
    def clearBreakPoint(self,addr):
        self.breakPoints.remove(int(addr,16))
        
    def listBreakPoints(self):
        ret = "BreakPoints:"
        for b in self.breakPoints:
            ret += " %08X\n"%b
        return ret
                               
    def __repr__(self):
        vals = {}
        vals["HI"] = self.HI
        vals["LO"] = self.LO
        vals["OP"] = disassemble(self.OP)
        
        ret = ""
        for i in range(32):
            reg = 'GR%02d'%i
            vals[reg] = self.genRegs[i]
            if i%4 == 0:
                ret += "\n"
            ret += reg + ": %(" +reg +")08X    "
        ret += '\n'
            
        ret += "HI: %(HI)08X LO: %(LO)08X\n\n" + \
            " " + self.getCachedDisassembly(self.PC-8) + '\n' +\
            " " + self.getCachedDisassembly(self.PC-4) + '\n' +\
            ">" + self.getCachedDisassembly(self.PC) + '\n' +\
            " " + self.getCachedDisassembly(self.PC+4) + '\n' +\
            " " + self.getCachedDisassembly(self.PC+8) + '\n'

        return ret%vals
        
t = Trace(sys.argv[1])

print(t)

while True:
    try:
        command = raw_input()
        if(command == 'f'): # step forward
            t.step('+')
            print(t)
        elif(command == 'b'): # step backwards
            t.step('-')
            print(t)
        elif(command == 'rf'):
            t.runUntilBreak('+')
            print(t)
        elif(command == 'rb'):
            t.runUntilBreak('-')
            print(t)        
        elif command.startswith('sbp'): # set break
            t.addBreakPoint(command.split(' ')[1])
        elif command.startswith('cbp'): # clear break
            t.clearBreakPoint(command.split(' ')[1])
        elif command.startswith('lbp'): #list breakpoints
            print(t.listBreakPoints())
        else:
            print("unknown command!")
    except Exception as e:
        print(e)
        traceback.print_exc()
        print(t)
