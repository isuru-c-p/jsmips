fs = require('fs')

function Tracer( fname ) {

    this.fname = fname;
    
    try {
        fs.unlinkSync(fname)
    } catch ( e ) {
        //pass
    }
    
    this.regVals = new Array(32);
    for(var i = 0 ; i < 32 ; i++){
        this.regVals[i] = 0;
    }
    this.PC = 0;
    this.HI = 0;
    this.LO = 0;
    this.OP = 0;
    

    this.writeTrace = function(emu) {
    
        
        var out = "";
        
        if(this.PC != emu.cpu.PC.asUInt32()){
            out += "-PC=" + this.PC.toString(16)+ '\n';
            this.PC = emu.cpu.PC.asUInt32();
            out += "+PC=" + this.PC.toString(16)+ '\n';
        }
        
        if(this.OP != emu.mmu.readWord(this.PC)){
            out += "-OP=" + this.OP.toString(16)+ '\n';
            this.OP = emu.mmu.readWord(this.PC);
            out += "+OP=" + this.OP.toString(16)+ '\n';
        }
        
        if(this.HI != emu.cpu.HI.asUInt32()){
            
            out += "-HI=" + this.HI.toString(16)+ '\n';
            this.HI = emu.cpu.HI.asUInt32();
            out += "+HI=" + this.HI.toString(16)+ '\n';
        }
        
        if(this.LO != emu.cpu.LO.asUInt32()){
            
            out += "-LO=" + this.LO.toString(16)+ '\n';
            this.LO = emu.cpu.LO.asUInt32();
            out += "+LO=" + this.LO.toString(16)+ '\n';
        }
        
        for(var i = 0; i < 32 ; i++){
            if(this.regVals[i] != emu.cpu.genRegisters[i].asUInt32()){
                out += "-GR"+i+"=" + this.regVals[i].toString(16) + '\n';
                this.regVals[i] = emu.cpu.genRegisters[i].asUInt32()
                out += "+GR"+i+"=" + this.regVals[i].toString(16) + '\n';
            }
        }
        out += "#\n"
        
        fd = fs.openSync(this.fname,'a');
        fs.writeSync(fd,out,0)
        fs.closeSync(fd)
    
    }

}
