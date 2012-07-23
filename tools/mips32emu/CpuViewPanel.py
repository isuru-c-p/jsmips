import wx
import DbgEngine


class RegisterView(wx.Panel):
    def __init__(self,parent,name,id=-1):
        wx.Panel.__init__(self, parent)
        self.parent = parent
        self.name = name
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
        self.tctl.Clear()
        if v == None:
            self.tctl.WriteText("????????")
            return
        if  2**32 <= v < 0:
            raise Exception("illegal value for Register view %d"%v)
        self.tctl.WriteText("%08X"%v)
        
        
class CpuViewPanel(wx.Panel):
    def __init__(self,parent,id=-1):
        wx.Panel.__init__(self, parent)
        self.parent = parent
        self.rvs = {}
        self.initGUI()
        self.dbg = DbgEngine.DbgEngine() 
        self.timer = wx.Timer(self)
        self.Bind(wx.EVT_TIMER, self.timerHandler, self.timer)
        self.timer.Start(700,False)
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
        for r in registers:
            try:
                self.rvs[r].setValue(self.dbg.readReg(r))
            except Exception as e:
                print e
                self.rvs[r].setValue(None)
