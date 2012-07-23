import wx
from  mips32emu.CpuViewPanel import CpuViewPanel

class CpuView(wx.Frame):
    def __init__(self):
        wx.Frame.__init__(self,None, -1, 'CpuView')
        self.av = CpuViewPanel(self)


app = wx.App()
frame = CpuView()
frame.Show()
app.MainLoop()
