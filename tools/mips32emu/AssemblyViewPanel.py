import wx
import DbgEngine
import socket
#this is a panel class which can be used for displaying disassembly

class AssemblyViewPanel(wx.Panel):
    def __init__(self,parent,id=-1):
        wx.Panel.__init__(self, parent)
        self.dbg = DbgEngine.DbgEngine() 
        self.Bind(wx.EVT_PAINT, self.OnPaint)
        self.Bind(wx.EVT_SIZE, self.OnSize)
        self.SetMinSize((100,100))
        self.font = wx.Font(9, wx.FONTFAMILY_DEFAULT, wx.FONTSTYLE_NORMAL,
            wx.FONTWEIGHT_NORMAL, False, 'Courier 10 Pitch')
        self.timer = wx.Timer(self)
        self.Bind(wx.EVT_TIMER, self.timerHandler, self.timer)
        self.timer.Start(1500,False)
    def timerHandler(self,evt):
        self.Refresh()
    def OnSize(self, event):
        self.Refresh()
    def OnPaint(self, event):
        dc = wx.PaintDC(self)
        dc.SetBrush(wx.Brush('#ffffff'))
        sx,sy = self.GetVirtualSize()
        dc.DrawRectangle(0,0, sx, sy)
        dc.SetBrush(wx.Brush('#000000'))
        size = 10
        dc.SetFont(self.font)
        try:
            self.dbg.pingAndReconnect()
            pc = self.dbg.readReg("PC")
        except (socket.error,DbgEngine.CommandException):
            pc = 0
        count = 0
        nInstr = sy//20
        pcIdx = nInstr//2

        for i in range(0,sy,20):
            curInstrAddr = pc + (4*(count-pcIdx))
            dc.DrawLine(0,i,sx,i)
            if curInstrAddr < 0:
                op = None
            else:
                try:
                    op = self.dbg.readWord(curInstrAddr)
                except (socket.error,DbgEngine.CommandException):
                    op = None
            if count == pcIdx:
                dc.SetBrush(wx.Brush('#ff0000'))
                dc.DrawRectangle(0,i+1, sx, 19)
                dc.SetBrush(wx.Brush('#000000'))
            self.drawDisassembly(dc,10,i+5,curInstrAddr,op)
                
            count += 1
            
    def drawDisassembly(self,dc,x,y,pc,op):
        
        if op != None:
            disassem = self.dbg.disassemble(op)
        else:
            disassem = "    ??????????????"
        dc.DrawText("%08X: %s"%(pc,disassem),x,y)
        
