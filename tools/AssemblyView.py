import wx
import socket
from  mips32emu.AssemblyViewPanel import AssemblyViewPanel

class AssemblyView(wx.Frame):
    def __init__(self):
        wx.Frame.__init__(self,None, -1, 'AssemblyView')
        toolbar = self.CreateToolBar()
        load = toolbar.AddLabelTool(wx.ID_ANY, 'load', wx.Bitmap('tools/tload.png'))
        reset = toolbar.AddLabelTool(wx.ID_ANY, 'reset', wx.Bitmap('tools/treset.png'))
        step = toolbar.AddLabelTool(wx.ID_ANY, 'step', wx.Bitmap('tools/tstep.png'))
        run = toolbar.AddLabelTool(wx.ID_ANY, 'run', wx.Bitmap('tools/trun.png'))
        pause = toolbar.AddLabelTool(wx.ID_ANY, 'break', wx.Bitmap('tools/tbreak.png'))
        toolbar.Realize()
        self.Bind(wx.EVT_TOOL, self.onLoad, load)
        self.Bind(wx.EVT_TOOL, self.onStep, step)
        self.Bind(wx.EVT_TOOL, self.onRun, run)
        self.Bind(wx.EVT_TOOL, self.onReset, reset)
        self.Bind(wx.EVT_TOOL, self.onPause, pause)
        self.av = AssemblyViewPanel(self)
        self.srec = None
    def onRun(self,evt):
        try:
            self.av.dbg.run()
        except socket.error:
            wx.MessageBox('Not connected', 'Error', wx.OK | wx.ICON_ERROR)
        except Exception as e:
            wx.MessageBox(str(e), 'Error', wx.OK | wx.ICON_ERROR)
    def onReset(self,evt):
        try:
            if self.srec == None:
                raise Exception("you havent loaded any srecs to reset to yet...")
            self.loadSrec(self.srec)
        except socket.error:
            wx.MessageBox('Not connected', 'Error', wx.OK | wx.ICON_ERROR)
        except Exception as e:
            wx.MessageBox(str(e), 'Error', wx.OK | wx.ICON_ERROR)
    def onPause(self,evt):
        try:
            self.av.dbg.dbgBreak()
        except socket.error:
            wx.MessageBox('Not connected', 'Error', wx.OK | wx.ICON_ERROR)
        except Exception as e:
            wx.MessageBox(str(e), 'Error', wx.OK | wx.ICON_ERROR)            

    def onStep(self,evt):
        try:
            self.av.dbg.step()
        except socket.error:
            wx.MessageBox('Not connected', 'Error', wx.OK | wx.ICON_ERROR)
        except Exception as e:
            wx.MessageBox(str(e), 'Error', wx.OK | wx.ICON_ERROR)
    def onLoad(self,evt):
        diag = wx.FileDialog(None)
        r = diag.ShowModal()   
        if r != wx.ID_OK:
            return
        path = diag.GetPath()
        self.srec = path
        try:
            self.loadSrec(path)
        except socket.error:
            wx.MessageBox('not connected!', 'Error', wx.OK | wx.ICON_ERROR)
        except Exception as e:
            wx.MessageBox('error while loading srec file! - ' + str(e), 'Error', wx.OK | wx.ICON_ERROR)
    def loadSrec(self,fname):
        self.av.dbg.dbgBreak()
        for line in open(fname):
            self.av.dbg.loadSrec(line,1)

app = wx.App()
frame = AssemblyView()
frame.Show()
app.MainLoop()
