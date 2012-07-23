import wx
from  mips32emu.AssemblyViewPanel import AssemblyViewPanel

class AssemblyView(wx.Frame):
    def __init__(self):
        wx.Frame.__init__(self,None, -1, 'AssemblyView')
        self.av = AssemblyViewPanel(self)
    def onStep(self):
        self.av.dbg.step()


app = wx.App()
frame = AssemblyView()
frame.Show()
app.MainLoop()
