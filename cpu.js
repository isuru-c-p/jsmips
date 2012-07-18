

function GeneralRegister() { // 32 bit register
    
    this.val = 0;
    
    this.asUInt32 = function () {
        return this.val;
    }
    
    this.putUInt32 = function ( val ) {
        this.val = val;
    }
    
    this.incr = function ( v ) {
        this.val += v;
    }

}

function ZeroRegister() { // 32 bit register
    
    
    this.asUInt32 = function () {
        return 0;
    }
    
    this.putUInt32 = function ( val ) {
    }

}


// CP0 Register 12, Select 0
function StatusRegister() {
	this.CU = 1; // Controls access to co-processors, bits 31:28
	this.RP = 0; // Enables reduced power mode, bit 27
	this.R = 0; // This bit must be ignored on writes and read as zero, bit 26
	this.RE = 0; // Used to enable reverse-endian memory references, bit 25
	this.zero = 0; // This bit must be written as zero; returns zero on read, bit 24:23
	this.BEV = 1; // Controls the location of exception vectors, bit 22
	this.TS = 0; // TLB shutdown, bit 21
	this.SR = 0; // bit 20
	this.NMI = 0; // bit 19
	// bit 18 is same as this.zero
	// bits 17:16 are reserved
	this.IM = 0; // Interrupt mask, bits 15:8
	// bits 7:5 are reserved
	this.UM = 0; // User Mode, bits 4
	// bit 3 is reserved
	this.ERL = 1; // Error Level, bit 2
	this.EXL = 0; // Exception Level, bit 1
	this.IE = 0; // Interrupt Enable, bit 0
	
	this.asUInt32 = function()
	{
		return ((this.CU * Math.pow(2, 28)) + (this.RP * Math.pow(2,27)) + (this.R * Math.pow(2,26)) + (this.RE * Math.pow(2, 25)) + (this.BEV * Math.pow(2,22)) + (this.TS * Math.pow(2, 21)) + (this.SR * Math.pow(2,20)) + (this.NMI * Math.pow(2, 19)) + (this.IM * Math.pow(2, 8)) + (this.UM * Math.pow(2,4)) + (this.ERL * Math.pow(2,2)) + (this.EXL * Math.pow(2,1)) + this.IE);   
	}
	
	this.setValue = function(value)
	{
		this.CU = (value >>> 28) & 0xf;
		this.RP = (value >>> 27) & 0x1;
		this.R = (value >>> 26) & 0x1;
		this.RE = (value >>> 25) & 0x1;
		// this.zero ro
		this.BEV = (value >>> 22) & 0x1;
		this.TS = (value >>> 21) & 0x1;
		this.SR = (value >>> 20) & 0x1;
		this.NMI = (value >>> 19) & 0x1;
		this.IM = (value >>> 8) & 0xff;
		this.UM = (value >>> 4) & 0x1;
		this.ERL = (value >>> 2) & 0x1;
		this.EXL = (value >>> 1) & 0x1;
		this.IE = value & 0x1;
	}

}

// CP0 Register 16, Select 0
function ConfigRegister()
{
	// all fields except K0 are read only by software
	this.M = 1; // bit 31
	this.K23 = 0; // bits 30:28
	this.KU = 0; // bits 27:25
	this.ISP = 0; // bit 24
	this.DSP = 0; // bit 23
	this.zero = 0; // bit 22
	this.SB = 0; // bit 21
	this.MDU = 0; // bit 20
	// bit 19 same as this.zero
	this.MM = 0; // bits 18:17
	this.BM = 0; // bit 16
	this.BE = 1; // bit 15
	this.AT = 0; // bits 14:13
	this.AR = 0; // bits 12:10
	this.MT = 1; // bits 9:7
	// bit 6 same as this.zero
	this.K0 = 2; // bits 2:0
	
	this.asUInt32 = function()
	{
		return ((this.M * Math.pow(2,31)) + (this.K23 * Math.pow(2,28)) + (this.KU * Math.pow(2,25)) + (this.ISP * Math.pow(2,24)) + (this.DSP * Math.pow(2,23)) + (this.SB * Math.pow(2,21)) + (this.MDU * Math.pow(2,20)) + (this.MM * Math.pow(2,17)) + (this.BM * Math.pow(2,16)) + (this.BE * Math.pow(2,15)) + (this.AT * Math.pow(2,13)) + (this.AR * Math.pow(2,10)) + (this.MT * Math.pow(2,7)) + this.K0);
	}
	
	this.setValue = function(value)
	{
		this.K0 = value & 0x7;
	}
	
}

// CP0 Register 16, Select 1
function Config1Register()
{
	// all fields read only by software
	this.M = 0; // bit 31
	this.MMUSize = 15; // bits 30:25
	this.IS = 0; // bits 24:22
	this.IL = 0; // bits 21:19
	this.IA = 0; // bits 18:16
	this.DS = 0; // bits 15:13
	this.DL = 0; // bits 12:10
	this.DA = 0; // bits 9:7
	this.zero = 0; // bits 6:5
	this.PC = 0; // bit 4, performance counter registers not program counter
	this.WR = 1; // bit 3
	this.CA = 0; // bit 2
	this.EP = 1; // bit 1
	this.FP = 0; // bit 0
	
	this.asUInt32 = function()
	{
		return ((this.M * Math.pow(2,31)) + (this.MMUSize * Math.pow(2,25)) + (this.IS * Math.pow(2,22)) + (this.IL * Math.pow(2,19)) + (this.IA * Math.pow(2,16)) + (this.DS * Math.pow(2,13)) + (this.DL * Math.pow(2,10)) + (this.DA * Math.pow(2,7)) + (this.PC * Math.pow(2,4)) + (this.WR * Math.pow(2,3)) + (this.CA * Math.pow(2,2)) + (this.EP * Math.pow(2,1)) + this.FP);
	}
	
	this.setValue = function(value)
	{
		return;
	}
}

// CP0 Register 15, Select 0
function processorIDRegister()
{
	// all fields are read only by software
	this.R = 0; // bits 31:24
	this.companyID = 1; // bits 23:16
	this.processorID = 128; // bits 15:8, (128 for 4kc)
	this.revision = 11; // bits 7:0, latest version according to manual
	
	this.asUInt32 = function()
	{
		return ((this.R << 24) + (this.companyID << 16) + (this.processorID << 8) + this.revision);
	}
	
	this.setValue = function(value)
	{
		return;
	}
}

// CP0 Register 17, Select 0
function LLAddrRegister()
{
	this.zero = 0; // bits 31:28
	this.PAddr = 0; // bits 27:0 - physical address read by most recent load linked instruction
	
	this.asUInt32 = function()
	{
		return this.PAddr;
	}
	
	this.setValue = function(value)
	{
		return;
	}
}


function MipsCpu () {

    //member mmu , to save space i wont make a setter. its set by the emu object
    
    this.genRegisters = new Array(32); // array of 32 32 bit integers
    
    this.genRegisters[0] = new ZeroRegister();
    for(var i = 1 ; i < 32; i++){
        this.genRegisters[i] = new GeneralRegister();
    }
    
    
    
	this.statusRegister = new StatusRegister();
	this.configRegister = new ConfigRegister();
	this.config1Register = new Config1Register();
	this.processorIDRegister = new processorIDRegister();
	this.llAddrRegister = new LLAddrRegister();
	this.PC = new GeneralRegister();
	this.doOp = doOp;
	
	this.delaySlot = false;
	
	this.advancePC = function () {
	    if(this.delaySlot){
	        return;
	    }
	    this.PC.incr(4);
	}
	
	
	
	this.getEndianness = function()
	{
		// returns 0 for LE and 1 for BE
		bigEndian = this.configRegister.BE;
		
		// if in user mode, and RE is set, reverse endianness
		if((this.statusRegister.UM == 1) && (this.statusRegister.RE == 1))
		{
			if(bigEndian == 1)
			{
				bigEndian = 0;
			}
			else
			{
				bigEndian = 1;
			}
		}

		return bigEndian;
	}
	
	this.step = function () {
	
	    var pcVal = this.PC.asUInt32();
	    DEBUG("Executing instruction at " + pcVal.toString(16));
	    var ins = this.mmu.readWord(pcVal)
	    DEBUG("instruction word: " + ins.toString(16));
	    this.doOp(ins);
	    
	}
	
	this.ADDIU = function ( op ){
	    var imm = op&0x0000ffff;
	    var rsrc = (op&0x3e00000)>>> 21;
	    var rdest = (op&0x1f0000) >>> 16;
	    DEBUG("add reg "+rsrc + " with imm " + imm + " and save in reg " + rdest )
	    var res = this.genRegisters[rsrc].asUInt32() + imm;
	    res = res % 4294967296; // handle overflow
	    this.genRegisters[rdest].putUInt32(res);
	    this.advancePC();
	    
	}
	
	this.J = function ( op ) {
        
        var top = this.PC.asUInt32()&0xc0000000;
        var addr = top| ((op&0x3ffffff)*4);
        DEBUG("jumping to address " + addr.toString(16))
	    var delayInsAddr = this.PC.asUInt32() + 4;
	    DEBUG("Executing delay slot ins at " + delayInsAddr.toString(16));
	    var ins = this.mmu.readWord(delayInsAddr);
	    this.delaySlot = true;
	    this.doOp(ins);
	    this.delaySlot = false;
        this.PC.putUInt32(addr);
        	
	}
	
	this.LUI = function ( op ){
	    var rDest = (op&0x1f0000) >>> 16;;
	    var c = (op&0x0000ffff) * 65536;
	    DEBUG("loading upper const into reg "+rDest);
	    this.genRegisters[rDest].putUInt32(c);
	    this.advancePC();
	}
	
}
