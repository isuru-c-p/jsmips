import wx
import DbgEngine
import socket


regalias =  {

    "GR0" : "G0",
    "GR1" : "AT",
    "GR2" : "V0" ,
    "GR3" : "V1" ,
    "GR4" : "A0" ,
    "GR5" : "A1" ,
    "GR6" : "A2" ,
    "GR7" : "A3" ,
    "GR8" : "T0" ,
    "GR9" : "T1" ,
    "GR10" : "T2" ,
    "GR11" : "T3" ,
    "GR12" : "T4" ,
    "GR13" : "T5" ,
    "GR14" : "T6" ,
    "GR15" : "T7" ,
    "GR16" : "S0" ,
    "GR17" : "S1" ,
    "GR18" : "S2" ,
    "GR19" : "S3" ,
    "GR20" : "S4" ,
    "GR21" : "S5" ,
    "GR22" : "S6" ,
    "GR23" : "S7" ,
    "GR24" : "T8" ,
    "GR25" : "T9" ,
    "GR26" : "K0" ,
    "GR27" : "K1" ,
    "GR28" : "GP" ,
    "GR29" : "SP" ,
    "GR30" : "FP" ,
    "GR31" : "RA" ,
}


class RegisterView(wx.Panel):
    def __init__(self,parent,name,id=-1):
        wx.Panel.__init__(self, parent)
        self.parent = parent
        self.name = regalias.get(name,name)
        self.initGUI()
        self.setValue(0)
    def initGUI(self):
        sizer = wx.BoxSizer()
        self.SetSizer(sizer)
        label = wx.StaticText(self,label=self.name+": ")
        sizer.Add(label)
        tctl = wx.TextCtrl(self)
        tctl.SetEditable(False)
        self.tctl = tctl
        sizer.Add(tctl)
    def setValue(self,v):
        if v == None:
            newText = "????????"
        elif  2**32 <= v < 0:
            raise Exception("illegal value for Register view %d"%v)
        else:
            newText = "%08X"%v
        if self.tctl.GetValue() == newText:
            return
        self.tctl.Clear()
        self.tctl.WriteText(newText)
        
        
class CpuViewPanel(wx.Panel):
    def __init__(self,parent,id=-1):
        wx.Panel.__init__(self, parent)
        self.parent = parent
        self.rvs = {}
        self.initGUI()
        self.dbg = DbgEngine.DbgEngine() 
        self.timer = wx.Timer(self)
        self.Bind(wx.EVT_TIMER, self.timerHandler, self.timer)
        self.timer.Start(1500,False)
    def timerHandler(self,evt):
        self.updateDebuggerDisplay()
        self.Refresh() 
    def initGUI(self):
        gridSizer = wx.GridSizer(9,4,0,0)
        self.SetSizer(gridSizer)
        for i in range(32):
            rname = "GR%d"%i
            rv = RegisterView(self,rname)
            self.rvs[rname] = rv
            gridSizer.Add(rv)
            
        rv = RegisterView(self,"PC")
        self.rvs["PC"] = rv
        gridSizer.Add(rv)
        rv = RegisterView(self,"HI")
        self.rvs["HI"] = rv
        gridSizer.Add(rv)
        rv = RegisterView(self,"LO")
        self.rvs["LO"] = rv
        gridSizer.Add(rv)
    def updateDebuggerDisplay(self):
        registers= ["PC","LO","HI"] + ["GR%d"%i for i in range(32) ]
        try:
            self.dbg.pingAndReconnect()
            for r in registers:
                try:
                    self.rvs[r].setValue(self.dbg.readReg(r))
                except Exception as e:
                    self.rvs[r].setValue(None)
        except socket.error:
            for r in registers:
                self.rvs[r].setValue(None)

