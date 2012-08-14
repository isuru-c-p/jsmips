

function GeneralRegister() { // 32 bit register
    
    this.val = 0;
    
    this.asUInt32 = function () {
        return this.val;
    }
    
    this.putUInt32 = function ( val ) {
        this.val = (val & 0xffffffff) >>> 0;
    }
    
    this.incr = function ( v ) {
        this.putUInt32(this.val+v);
    }

}

function ZeroRegister() { // 32 bit register
    
    
    this.asUInt32 = function () {
        return 0;
    }
    
    this.putUInt32 = function ( val ) {
    }

}

function twosComplement(value)
{
	return (~(value) + 1);
}


// CP0 Register 0, Select 0
function IndexRegister() {
    this.P = 0;
    this.Index = 0;
    
    this.asUInt32 = function() {
        return (this.Index); 
    }
    
    this.putUInt32 = function(val) {
        this.Index = (val & 0xf) >>> 0;
    }
}

// CP0 Register 1, Select 0
function RandomRegister() {
    this._upperBound = 15;
    this.cpu = undefined;
    
    this.asUInt32 = function()
    {
        var wire = this.cpu.C0Registers[6].asUInt32();
        var randRange = (15 - wire);
        
        var random = wire + Math.floor(Math.random() * randRange);    
    
        return random;
    }

    this.putUInt32 = function(val)
    {
    }
}

// CP0 Register 2 and 3, Select 0
function EntryLoRegister() {
    this.PFN = 0;
    this.C = 0;
    this.D = 0;
    this.V = 0;
    this.G = 0;
    
    this.asUInt32 = function()
    {
        return (this.G + (this.V << 1) + (this.D << 2) + (this.C << 3) + (this.PFN << 6));
    }
    
    this.putUInt32 = function(val)
    {
        this.G = val & 0x1;
        this.V = (val >>> 1) & 0x1;
        this.D = (val >>> 2) & 0x1;
        this.C = (val >>> 3) & 0x7;
        this.PFN = (val >>> 6) & 0xfffff;
    }
}

// CP0 Register 4, Select 0
function ContextRegister() {
    this.PTEBase = 0;
    this.BadVPN2 = 0;
    
    this.asUInt32 = function()
    {
        return ((this.PTEBase * Math.pow(2,23)) + (this.BadVPN2 << 4));
    }
    
    this.putUInt32 = function(val)
    {
        this.BadVPN2 = (val >>> 4) & 0x7ffff;
        this.PTEBase = (val >>> 23) & 0xff;
    }
}

// CP0 Register 5, Select 0
function PageMaskRegister() {
    this.Mask = 0;
    
    this.rawUInt32 = function()
    {
        return this.Mask;
    }

    this.asUInt32 = function()
    {
        var mask = Math.pow(2,this.Mask*2)-1;
        return (mask << 13);
    }
    
    this.putUInt32 = function(val)
    {
        var mask = 0;

        switch(val)
        {
            case 0:
                mask = 0;
                break;
            case 3:
                mask = 1;
                break;
            case 15:
                mask = 2;
                break;
            case 63:
                mask = 3;
                break; 
            case 255:
                mask = 4;
                break;
            case 1023:
                mask = 5;
                break;
            case 4095:
                mask = 6; 
                break;
            default:
                ERROR("Invalid page mask.");
                break; 
        }

        this.Mask = mask;
    }
}

// CP0 Register 6, Select 0
function WiredRegister() {
    this.Wired = 0;
    
    this.asUInt32 = function()
    {
        return this.Wired;
    }
    
    this.putUInt32 = function(val)
    {
        this.Wired = val & 0xf;
    }
}

// CP0 Register 8, Select 0
// BadVAddr = GeneralRegister

// CP0 Register 9, Select 0
// Count = GeneralRegister

// CP0 Register 10, Select 0
function EntryHiRegister() {
    this.VPN2 = 0;
    this.ASID = 0;
    
    this.asUInt32 = function() {
        return ((this.VPN2 << 13) + this.ASID);
    }
    
    this.putUInt32 = function(val) {
        this.ASID = val & 0xff;
        this.VPN2 = (val >>> 13) & 0xfff;
    }
}

// CP0 Register 11, Select 0
function CompareRegister(cpu) {
    this.val = 0;
    this.cpu = cpu;
    
    this.asUInt32 = function () {
        return this.val;
    }
    
    this.putUInt32 = function ( val ) {
        this.val = (val & 0xffffffff) >>> 0;
        // clear timer interrupt
        this.cpu.C0Registers[13].IP1 = this.cpu.C0Registers[13].IP1 & "0x1f";
    }
}

// CP0 Register 12, Select 0
function StatusRegister() {
	this.CU = 1; // Controls access to co-processors, bits 31:28
	this.RP = 0; // Enables reduced power mode, bit 27
	this.R = 0; // This bit must be ignored on writes and read as zero, bit 26
	this.RE = 0; // Used to enable reverse-endian memory references, bit 25
	this.zero = 0; // This bit must be written as zero; returns zero on read, bit 24:23
	this.BEV = 0; // Controls the location of exception vectors, bit 22
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
	this.IE = 1; // Interrupt Enable, bit 0
	
	this.asUInt32 = function()
	{
		return ((this.CU * Math.pow(2, 28)) + (this.RP * Math.pow(2,27)) + (this.R * Math.pow(2,26)) + (this.RE * Math.pow(2, 25)) + (this.BEV * Math.pow(2,22)) + (this.TS * Math.pow(2, 21)) + (this.SR * Math.pow(2,20)) + (this.NMI * Math.pow(2, 19)) + (this.IM * Math.pow(2, 8)) + (this.UM * Math.pow(2,4)) + (this.ERL * Math.pow(2,2)) + (this.EXL * Math.pow(2,1)) + this.IE);   
	}
	
	this.putUInt32 = function(value)
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

// CP0 Register 13, Select 0
function CauseRegister()
{
    this.BD = 0;
    this.CE = 0;
    this.IV = 0;
    this.WP = 0;
    this.IP1 = 0;
    this.IP0 = 0;
    this.EXC = 0;
    
    this.asUInt32 = function() {
        return ((this.EXC << 2) + (this.IP0 << 8) + (this.IP1 << 10) + (this.WP << 22) + (this.IV << 23) + (this.CE << 28) + (this.BD * Math.pow(2,31))); 
    }
    
    this.putUInt32 = function(val) {
        this.BD = (val >>> 31);
        this.CE = (val >>> 28) & 0x3;
        this.IV = (val >>> 23) & 0x1;
        this.WP = (val >>> 22) & 0x1;
        this.IP1 = (val >>> 10) & 0x3f;
        this.IP0 = (val >>> 8) & 0x3;
        this.EXC = (val >>> 2) & 0x1f;
    }
}

// CP0 Register 14, Select 0
// ExceptionProgramCounter = GeneralRegister

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
	
	this.putUInt32 = function(value)
	{
		return;
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
        return ((this.M << 31) + (this.K23 << 28) + (this.KU << 25) + (this.ISP << 24) + (this.DSP << 23) + (this.SB << 21) + (this.MDU << 20) + (this.MM << 17) + (this.BM << 16) + (this.BE << 15) + (this.AT << 13) + (this.AR << 10) + (this.MT << 7) + (this.K0)) >>> 0;
	}
	
	this.putUInt32 = function(value)
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
		return ((this.M * Math.pow(2,31)) + (this.MMUSize * Math.pow(2,25)) + (this.IS * Math.pow(2,22)) + (this.IL * Math.pow(2,19)) + (this.IA * 65536) + (this.DS * Math.pow(2,13)) + (this.DL * Math.pow(2,10)) + (this.DA * Math.pow(2,7)) + (this.PC * Math.pow(2,4)) + (this.WR * Math.pow(2,3)) + (this.CA * Math.pow(2,2)) + (this.EP * Math.pow(2,1)) + this.FP);
	}
	
	this.putUInt32 = function(value)
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
	
	this.putUInt32 = function(value)
	{
		return;
	}
}


function getRs (op) {
    return (op&0x3e00000) >>> 21;
}

function getRt (op) {
    return (op&0x1f0000) >>> 16;    
}


function getRd (op) {
    return (op&0xf800) >>> 11;
}


function getSHAMT (op) {
    return (op&0x7c0) >>> 6;
}

function getFunct (op) {
    return (op&0x3f) >>> 0;
}

function getSigned (value) {
	return (value & 0xffffffff);
}

function getSigned16 (value) {
	var sign = 0;
	var signedVal = value;
	
	if((value << 16) < 0)
	{
		sign = 1;
	}
	
	if(sign)
	{
		signedVal = /*0signedVal | 0xffff0000;//*/-((~(signedVal) + 1) & 0x0000ffff);
	}
	
	return signedVal;
}



function MipsCpu () {

    //member mmu , to save space i wont make a setter. its set by the emu object
    
    this.genRegisters = new Array(32); // array of 32 32 bit integers
    
    this.genRegisters[0] = new ZeroRegister();
    for(var i = 1 ; i < 32; i++){
        this.genRegisters[i] = new GeneralRegister();
    }

    this.C0Registers = new Array(32);
    this.C0Registers[0] = new IndexRegister();
    this.C0Registers[1] = new RandomRegister();
    this.C0Registers[1].cpu = this;
    this.C0Registers[2] = new EntryLoRegister();
    this.C0Registers[3] = new EntryLoRegister();
    this.C0Registers[4] = new ContextRegister();
    this.C0Registers[5] = new PageMaskRegister();
    this.C0Registers[6] = new WiredRegister();
    this.C0Registers[8] = new GeneralRegister(); // BadVAddr
    this.C0Registers[9] = new GeneralRegister(); // Count
    this.C0Registers[10] = new EntryHiRegister(); 
    this.C0Registers[11] = new CompareRegister(this); //Compare
    this.C0Registers[12] = new StatusRegister();
    this.C0Registers[13] = new CauseRegister();
    this.C0Registers[14] = new GeneralRegister(); // EPC
    this.C0Registers[15] = new processorIDRegister();
    this.C0Registers[17] = new LLAddrRegister();
    // fillers for unimplemented coprocessor registers
    for(i = 18; i <= 31; i++)
    {
        this.C0Registers[i] = new GeneralRegister();
    }

    this.exceptionFlags = new Uint32Array(30);
    this.excCodes = new Uint32Array(30);
 
    this.HI = new GeneralRegister();
	this.LO = new GeneralRegister();
    
    this.entryHiReg = this.C0Registers[10];
	this.statusRegister = this.C0Registers[12];
	this.configRegister = new ConfigRegister();
	this.config1Register = new Config1Register();
	this.llAddrRegister = this.C0Registers[17];
	this.PC = new GeneralRegister();
	this.doOp = doOp;
	
	this.delaySlot = false;
    this.exceptionOccured = false;
    
    this.LLBit = 0;
    this.clockCount = 0;

    this.triggerException = function(exception, exc_code)
    {
        this.exceptionOccured = true;
        this.excCodes[exception] = exc_code;
        this.exceptionFlags[exception] = 1;
    }

    this.triggerInterrupt = function(interrupt_bit)
    {
        var causeReg = this.C0Registers[13];
        var interruptVal;

        if(interrupt_bit < 2)
        {
            interruptVal = 1 << interrupt_bit;
            causeReg.IP0 = causeReg.IP0 | interruptVal;
        }
        else
        {
            interruptVal = 1 << (interrupt_bit - 2); 
            causeReg.IP1 = causeReg.IP1 | interruptVal;
        }
       
        return; 
    }

    this.checkInterrupts = function()
    {
       var c0Registers = this.C0Registers;
       var countRegister = c0Registers[9];
       var compareRegister = c0Registers[11];

       //TODO: if in debug mode check CountDM
       this.clockCount = this.clockCount + 1;

       if(this.clockCount == 2)
       {
            countRegister.putUInt32(countRegister.asUInt32()+1); 

            if(countRegister.asUInt32() == compareRegister.asUInt32())
            {
                this.triggerInterrupt(7); 
            }
            this.clockCount = 0;
       }

       var statusRegister = c0Registers[12];

       if((statusRegister.IE == 1) && (statusRegister.EXL == 0) && (statusRegister.ERL == 0)) 
       {
            var interruptPendingBits = c0Registers[13].IP0 + (c0Registers[13].IP1 << 2);
            var interruptMask = statusRegister.IM; 

            var dispatchInterrupts = interruptMask & interruptPendingBits;

            if(dispatchInterrupts > 0)
            {
                //INFO("Triggering interrupt exception...");
                this.triggerException(6,0);
            }
       }
    }

    this.getExceptionVectorAddress = function(exception)
    {
        var statusRegister = this.C0Registers[12];
        var BEV = statusRegister.BEV;
        var EXL = statusRegister.EXL;
        var IV = this.C0Registers[13].IV;
        var genBase = 0x80000000;
        if(BEV == 1)
        {
            genBase = 0xBFC00200;
        }

        switch(exception)
        {
            case 0:
            case 1:
            case 4:
                return 0xBFC00000;

            /*case 2:
            case 3:
            case 8:
            case 14:
            case 21:
            case 29:
                if(EJTAG ProbTrap==0)
                {
                    return 0xBFC00480;
                }
                else
                {
                    return 0xFF200200;
                }*/

            case 6:
                if(IV == 0)
                {
                    return genBase + 0x180;
                }
                return genBase + 0x200;

            case 11: 
            case 26:
            case 27:
            case 28:
                if(EXL == 1)
                {
                    return genBase + 0x180;
                }
                return genBase;

            default:
                return genBase + 0x180;
        } 
    }

    this.processException = function()
    {
        var PC = this.PC;
        var causeReg = this.C0Registers[13];
        var statusRegister = this.statusRegister;
        if(statusRegister.EXL == 0)
        {
           var EPCval = 0;
           var epcReg = this.C0Registers[14];

           if(this.delaySlot)
           {
               EPCval = (PC.asUInt32() - 4);
               causeReg.BD = 1;
           } 
           else
           {
               EPCval = (PC.asUInt32());
               causeReg.BD = 0;
           }

           epcReg.putUInt32(EPCval);
        }

        var exceptionFlags = this.exceptionFlags;
        var exceptionNum = -1;

        for(i = 0; i < 30; i++)
        {
            if(exceptionFlags[i] == 1)
            {
                exceptionNum = i;
                break;
            }
        }

        if(exceptionNum == -1)
        {
            ERROR("Attempting to process exception but exceptionFlags not set!");
            return;
        }

        causeReg.EXC = this.excCodes[exceptionNum];
        causeReg.CE = 0; // TODO: set CE to a proper value on CoProcessor unusable exception
       
        var excAddress = this.getExceptionVectorAddress(exceptionNum);

        // debug printing for all exceptions except timer interrupt
        if((exceptionNum != 6) && (exceptionNum != 15))
        {
            INFO("Executing exception vector @ " + excAddress.toString(16) + "(exceptionNum:" + exceptionNum + ") EPC: " + this.C0Registers[14].asUInt32().toString(16) + ", v0: " + this.genRegisters[2].asUInt32().toString(16));
        }

        statusRegister.EXL = 1; 
        PC.putUInt32(excAddress);

        this.exceptionOccured = false;
        for(i = 0; i < 30; i++)
        {
            this.exceptionFlags[i] = 0;
        }
    }

    this.isKernelMode = function () {
       return (this.statusRegister.UM == 0) | (this.statusRegister.ERL == 1) | (this.statusRegister.EXL == 1);  
    }

    this.getC0Register = function(index, select)
    {
       if(index != 16)  
       {
            return this.C0Registers[index];
       }
       else if(select == 0)
       {
            return this.configRegister;
       }
       else if(select == 1)
       {
            return this.config1Register;
       }
       else
       {
            ERROR("Error, accessing Coprocessor register at index: " + index + ", select: " + select);
       }
    }
	
	this.advancePC = function () {
	    if(this.delaySlot){
	        return;
	    }
	    this.PC.incr(4);
	}
	
	this.doDelaySlot = function() {
		this.PC.incr(4);
	    var delayInsAddr = this.PC.asUInt32();
	    //DEBUG("Executing delay slot ins at " + delayInsAddr.toString(16));
	    var ins = this.mmu.readWord(delayInsAddr);
	    this.delaySlot = true;

        this.checkInterrupts();
        if(this.exceptionOccured)
        {
            throw 1337;
        }

	    this.doOp(ins);
   
        //this.checkInterrupts();

        if(this.exceptionOccured)
        {
            throw 1337;
            //this.processException();
        }

	    this.delaySlot = false;
	
	};
	
	
	this.getEndianness = function()
	{
		// returns 0 for LE and 1 for BE
		var bigEndian = this.configRegister.BE;
		
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

        this.checkInterrupts();
        if(this.exceptionOccured)
        {
            //console.log("Exception process PC: " + pcVal.toString(16));
            this.processException();
            this.delaySlot = false;
            return;
        }

        this.delaySlot = false;

	    var ins = this.mmu.readWord(pcVal);
	    //DEBUG("Executing instruction at " + pcVal.toString(16));
	    //DEBUG("instruction word: " + ins.toString(16));
        try {   
	        this.doOp(ins);
        }
        catch(err)
        {
            if(err != 1337)
            {
                throw err;
            }
            else
            {
                //this.PC.incr(4);
            }
        }
	    
	}
	
	this.ADD = function ( op ) {
		//DEBUG("ADD");
		var rs = getRs(op);
		var rt = getRt(op);
		var rd = getRd(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		var result = rs_val + rt_val;
		if(result < 4294967296)
		{
			this.genRegisters[rd].putUInt32(result);
		}
		else
		{
            WARN("Overflow trap not implemented.");
			// TODO Overflow trap
		}
		
		this.advancePC();
	}
	
	this.ADDI = function ( op ){
	    var imm = getSigned16(op&0x0000ffff);
	    var rs = getRs(op);
	    var rt = getRt(op);
	    //DEBUG("ADDI reg "+rs + " with imm " + imm + " and save in reg " + rt );
	    var result = this.genRegisters[rs].asUInt32() + imm;
	    //res = res % 4294967296; // handle overflow
		
		if(result < 4294967296)
		{
			this.genRegisters[rt].putUInt32(result);
		}
		else
		{
			// TODO Overflow trap
		}
		
	    this.advancePC();
	}	
	
	this.ADDIU = function ( op ){
	    var imm = getSigned16(op&0x0000ffff);
	    var rs = getRs(op);
	    var rt = getRt(op);
	    //DEBUG("ADDIU reg "+rs + " with imm " + imm + " and save in reg " + rt );
       
        var rsVal = this.genRegisters[rs].asUInt32();
	    var res = this.genRegisters[rs].asUInt32() + imm;
	    res = res % 4294967296; // handle overflow
	    this.genRegisters[rt].putUInt32(res);
	    
		this.advancePC();
	}
	
	this.ADDU = function ( op ){
	    
	    var rs = getRs(op);
	    var rt = getRt(op);
	    var rd = getRd(op);
	    
	    //DEBUG("addu");
	    var res = this.genRegisters[rt].asUInt32() + this.genRegisters[rs].asUInt32();
	    res = res % 4294967296; // handle overflow
	    this.genRegisters[rd].putUInt32(res);
	    this.advancePC();
	    
	}
	
	this.OR = function ( op ) {
		//DEBUG("OR");
		var rs = getRs(op);
		var rt = getRt(op);
		var rd = getRd(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		this.genRegisters[rd].putUInt32(rs_val | rt_val);
		
		this.advancePC();
	}
	
	this.ORI = function ( op ) {
		var rs = getRs(op);
		var rt = getRt(op);
		var c = op&0x0000ffff;
		
		var rs_val = this.genRegisters[rs].asUInt32();
		
		this.genRegisters[rt].putUInt32(rs_val | c);
		this.advancePC();
		
		
		//DEBUG("ORI rs: " + rs.toString(16) + ", rt: " + rt.toString(16) + ", c: " + c.toString(16) + ", rs_val: " + rs_val + ", result: " + this.genRegisters[rt].asUInt32());
	}

    this.PREF = function ( op ) {
        // loads specified line to cache, ignore in our emulator
        this.advancePC();
    }

    this.SB = function ( op ){
        var rs = getRs(op);
        var rt = getRt(op);
        var offset = getSigned16(op & 0x0000ffff);

        var rs_val = this.genRegisters[rs].asUInt32();

        var addr = ((rs_val + offset) & 0xffffffff) >>> 0; 
        var rt_val = (this.genRegisters[rt].asUInt32() & 0xff) >>> 0;

        this.mmu.writeByte(addr, rt_val);
        
        this.advancePC();
    }
	
	this.XOR = function ( op ) {
        //DEBUG("XOR");
		var rs = getRs(op);
		var rt = getRt(op);
		var rd = getRd(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		//DEBUG("XOR");
		
		this.genRegisters[rd].putUInt32(rs_val ^ rt_val);
		this.advancePC();
	}

    this.XORI = function ( op ) {
        //DEBUG("XORI");
        var rs = getRs(op);
        var c = (op & 0x0000ffff);
        var rt = getRt(op);

        var rs_val = this.genRegisters[rs].asUInt32();
        var result = (rs_val ^ c);

        this.genRegisters[rt].putUInt32(result);
        this.advancePC();
    }
	
	this.NOR = function ( op ) {
		//DEBUG("NOR");
		var rs = getRs(op);
		var rt = getRt(op);
		var rd = getRd(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		var result = ~(rs_val | rt_val);
		this.genRegisters[rd].putUInt32(result);
		this.advancePC();
	}
	
	this.SLT = function ( op ){
		//DEBUG("SLT");
		var rs = getRs(op);
		var rt = getRt(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		var rd = getRd(op);
		
		if(getSigned(rs_val) < getSigned(rt_val))
		{
			this.genRegisters[rd].putUInt32(1);	
		}
		else
		{
			this.genRegisters[rd].putUInt32(0);
		}
	
		this.advancePC();
	}
	
	this.SLTI = function ( op ){
		//DEBUG("SLTI");
		var rs = getRs(op);
		var rt = getRt(op);
		var c = (op&0x0000ffff);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		//console.log("rt: " + rt + ", rs: " + rs + ", rs_val: " + rs_val + ", c: " + getSigned16(c));
		
		if(getSigned(rs_val) < getSigned16(c))
		{
			//console.log("set");
			this.genRegisters[rt].putUInt32(1);
		}
		else
		{
			//console.log("not set");
			this.genRegisters[rt].putUInt32(0);
		}
		
		this.advancePC();
	}
	
	this.SLTIU = function ( op ){
		//DEBUG("SLTIU");
		var rs = getRs(op);
		var rt = getRt(op);
		var c = getSigned16(op&0x0000ffff) >>> 0;
		
		var rs_val = this.genRegisters[rs].asUInt32();
		
		
		if(rs_val < c)
		{
			this.genRegisters[rt].putUInt32(1);
		}
		else
		{
			this.genRegisters[rt].putUInt32(0);
		}
		
		this.advancePC();
	}
	
	this.SLTU = function ( op ){
		//DEBUG("SLTU");
		var rs = getRs(op);
		var rt = getRt(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		var rd = getRd(op);
		
		if(rs_val < rt_val)
		{
			this.genRegisters[rd].putUInt32(1);	
		}
		else
		{
			this.genRegisters[rd].putUInt32(0);
		}
	
		this.advancePC();
	}
	
	this.SH = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		//DEBUG("SH");
		
		var address = ((this.genRegisters[rs].asUInt32() + c) & 0xffffffff) >>> 0;
		var rt_val = (this.genRegisters[rt].asUInt32() & 0xffff) >>> 0;
		
		this.mmu.writeHalfWord(address, rt_val);
		this.advancePC();		
	}
	
	this.SLL = function ( op ){
		//DEBUG("SLL");
		var rd = getRd(op);
		var rt = getRt(op);
		var sa = getSHAMT(op);
		var val = this.genRegisters[rt].asUInt32() * Math.pow(2,sa);
		
		this.genRegisters[rd].putUInt32(val);
		this.advancePC();
	}
	
	this.SLLV = function ( op ){
		//DEBUG("SLLV");
		var rd = getRd(op);
		var rt = getRt(op);
		var rs = getRs(op);
		var val = (this.genRegisters[rt].asUInt32()) * Math.pow(2,this.genRegisters[rs].asUInt32()&0x0000001f);
		this.genRegisters[rd].putUInt32(val);
		this.advancePC();
	}
	
	this.SRL = function ( op ){
		//DEBUG("SRL");
		var rd = getRd(op);
		var rt = getRt(op);
		var sa = getSHAMT(op);
		var val = this.genRegisters[rt].asUInt32() >>> sa;
		
		this.genRegisters[rd].putUInt32(val);
		this.advancePC();
	}
	
	this.SRLV = function ( op ){
		//DEBUG("SRLV");
		var rd = getRd(op);
		var rt = getRt(op);
		var rs = getRs(op);
		var val = (this.genRegisters[rt].asUInt32()) / Math.pow(2,this.genRegisters[rs].asUInt32()&0x0000001f);
		this.genRegisters[rd].putUInt32(val);
		this.advancePC();
	}
	
	this.SC = function ( op ) {
		var rt = getRt(op);
		var base = getRs(op);
		var addr = getSigned16(op&0x0000ffff) + this.genRegisters[base].asUInt32();
		//WARN("SC implement address error???")
		addr = addr >>> 0
		var val = this.genRegisters[rt].asUInt32();
		if(this.LLBit == 1){
		    this.mmu.writeWord(addr,val);
		    this.genRegisters[rt].putUInt32(1);
		}else {
		    this.genRegisters[rt].putUInt32(0);
		}
		
		this.LLBit = 0;
		
		
        this.advancePC();
	}
	
	this.TNE = function (op) {
        //DEBUG("TNE");
        var rs = getRs(op);
        var rt = getRt(op);

        var rs_val = this.genRegisters[rs].asUInt32();
        var rt_val = this.genRegisters[rt].asUInt32();

        if(rs_val != rt_val)
        {
            this.triggerException(20, 13);
            return;
        }

	    this.advancePC();
	}

    this.BREAK = function (op) {
        //DEBUG("BREAK");
        this.triggerException(16, 9);
        //this.advancePC();
    }

    this.WAIT = function (op)
    {
        // wait for interrupt 
        return;//
    }
	
	this.SRA = function ( op ){
		//DEBUG("SRA");
		var rd = getRd(op);
		var rt = getRt(op);
		var rt_val = this.genRegisters[rt].asUInt32();
		var shamt = getSHAMT(op);
		
		var sign = (rt_val >>> 31);
		var val = (rt_val & 0xffffffff) >>> 0;
		var shifted_val = (val >>> shamt);
		
		if(sign != 0)
		{
			var shamt_mask = (~(0xffffffff >>> shamt) >>> 0);
			shifted_val = (shifted_val | shamt_mask);
		}
		
		
		this.genRegisters[rd].putUInt32(shifted_val);
		this.advancePC();		
	}	
	
	this.SRAV = function ( op ){
		//DEBUG("SRAV");
		var rd = getRd(op);
		var rt = getRt(op);
		var rs = getRs(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		var shamt = (rs_val & 0x1f) >>> 0;
		
		var sign = (rt_val >>> 31);
		var val = (rt_val & 0xffffffff) >>> 0;
		var shifted_val = (val >>> shamt);
		
		if(sign != 0)
		{
			var shamt_mask = (~(0xffffffff >>> shamt) >>> 0);
			shifted_val = (shifted_val | shamt_mask);
		}
		
		
		this.genRegisters[rd].putUInt32(shifted_val);
		this.advancePC();		
	}	
	
	this.SUB = function ( op ){
		var rs = getRs(op);
		var rd = getRd(op);
		var rt = getRt(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		var result = (rs_val + twosComplement(rt_val)) >>> 0;
		//var result = (rs_val - rt_val) >>> 0;
		
		if(result < 4294967296)
		{
			this.genRegisters[rd].putUInt32(result);
		}
		else
		{
			// TODO trigger overflow exception
		}
		
		this.advancePC();
	}	
	
	this.SUBU = function ( op ){
		var rs = getRs(op);
		var rd = getRd(op);
		var rt = getRt(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		var result = (rs_val + twosComplement(rt_val)) >>> 0;
		//var result = (rs_val - rt_val) >>> 0;
		
		this.genRegisters[rd].putUInt32(result);
		this.advancePC();
	}
	
	this.AND = function ( op ) {
		//DEBUG("AND");
		var rs = getRs(op);
		var rt = getRt(op);
		var rd = getRd(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		var result = (rs_val & rt_val);
		
		this.genRegisters[rd].putUInt32(result);
		this.advancePC();
	}
	
	this.ANDI = function ( op ){
		//DEBUG("ANDI");
		var rs = getRs(op);
		var rt = getRt(op);
		var imm = (op&0x0000ffff);
		
		var result = this.genRegisters[rs].asUInt32();
		result = ((result & 0x0000ffff) & imm) >>> 0;
		
		this.genRegisters[rt].putUInt32(result);
		this.advancePC();
	}
	
	this.MULT = function ( op ){
		var rs = getRs(op);
		var rt = getRt(op);
		
		var number1Signed = getSigned(this.genRegisters[rs].asUInt32());
		var number2Signed = getSigned(this.genRegisters[rt].asUInt32());

        var number1 = Math.abs(number1Signed);
        var number2 = Math.abs(number2Signed);
		
		var sign = (number1Signed/number1) * (number2Signed/number2);
				
		var number1Hi = number1 >>> 16;
		var number1Lo = (number1 & 0xffff);
		var number2Hi = number2 >>> 16;
		var number2Lo = (number2 & 0xffff);
		var z2 = (number1Hi * number2Hi);
		var z1 = (number1Hi * number2Lo) + (number1Lo * number2Hi);
		var z0 = (number1Lo * number2Lo);


		var result = (z2*4294967296 + z1*65536 + z0);

		var t1 = (z1*65536 + z0);
		this.HI.putUInt32((z2 + ((t1-t1%4294967296) / 4294967296)) >>> 0);
		this.LO.putUInt32(((z1*65536 + z0) & 0xffffffff) >>> 0);

		var HI_val = this.HI.asUInt32();
		var LO_val = this.LO.asUInt32();
		
		if(sign < 0)
		{
			LO_val = (~(LO_val) + 1);
			var carry = (LO_val - LO_val%4294967296) / 4294967296;
			LO_val = LO_val & 0xffffffff;
		
		
			HI_val = (~(HI_val) + carry) & 0xffffffff;
			this.HI.putUInt32(HI_val);
			this.LO.putUInt32(LO_val);
		}
		//console.log("A: " + number1 + ", B:" + number2);
		//console.log("Result: 0x"+result.toString(16)+", HI: 0x"+this.HI.asUInt32().toString(16)+", LO: 0x"+this.LO.asUInt32().toString(16));
		this.advancePC();
	}

    this.MULTU = function ( op ) { //karatsuba algorithm
		var rs = getRs(op);
		var rt = getRt(op);
		
		var number1 = this.genRegisters[rs].asUInt32();
		var number2 = this.genRegisters[rt].asUInt32();
				
		var number1Hi = number1 >>> 16;
		var number1Lo = (number1 & 0xffff);
		var number2Hi = number2 >>> 16;
		var number2Lo = (number2 & 0xffff);
		var z2 = (number1Hi * number2Hi);
		var z1 = (number1Hi * number2Lo) + (number1Lo * number2Hi);
		var z0 = (number1Lo * number2Lo);

		var result = (z2*4294967296 + z1*65536 + z0);

		var t1 = (z1*65536 + z0);
		this.HI.putUInt32((z2 + ((t1-t1%4294967296) / 4294967296)) >>> 0);
		this.LO.putUInt32(((z1*65536 + z0) & 0xffffffff) >>> 0);

        this.advancePC();   
    }

    this.MUL = function ( op ) {
        var HI_old = this.HI.asUInt32();
        var LO_old = this.LO.asUInt32();

        this.MULT(op);

        var rd = getRd(op);
        this.genRegisters[rd].putUInt32(this.LO.asUInt32());

        this.HI.putUInt32(HI_old);
        this.LO.putUInt32(LO_old);

        // advancePC() done in this.MULT
    }

    this.MADD = function ( op ) {
        var HI_old = this.HI.asUInt32();
        var LO_old = this.LO.asUInt32(); 

        this.MULT(op);
        var LO_sum = LO_old + this.LO.asUInt32();
        var LO_carry = LO_sum >> 32;
        var HI_sum = HI_old + this.HI.asUInt32() + LO_carry;
        
        this.LO.putUInt32(LO_sum);
        this.HI.putUInt32(HI_sum); 

        // TODO: handle overflow

        // advancePC done in this.MULT
    }

    this.MADDU = function ( op ){
        var HI_old = this.HI.asUInt32();
        var LO_old = this.LO.asUInt32();

        var signed = HI_old >>> 31;

        if(signed)
        {
            LO_old = ((~LO_old & 0xffffffff) >>> 0);
            LO_old += 1;
			var carry = 0;
			
			if(LO_old >= 4294967296)
			{
				carry = 1;
			}
			
            HI_old = ((~HI_old & 0xffffffff) >>> 0) + carry; 
        }

        this.MULT(op);
        var HI_new = this.HI.asUInt32();
        var LO_new = this.LO.asUInt32();


        signed = HI_new >>> 31; 

        if(signed)
        {
            LO_new = ((~LO_new & 0xffffffff) >>> 0);
            LO_new += 1;
			var carry = 0;
			
			if(LO_new >= 4294967296)
			{
				carry = 1;
			}
			
            HI_new = ((~HI_new & 0xffffffff) >>> 0) + carry; 
        }

        var LO_sum = LO_old + LO_new;
        var LO_carry = LO_sum >> 32;
        var HI_sum = HI_old + HI_new + LO_carry;
        
        this.LO.putUInt32(LO_sum);
        this.HI.putUInt32(HI_sum); 

        // advancePC done in this.MULT
    }

    this.MFC0 = function ( op ) {
        //DEBUG("MFC0");
        var rt = getRt(op);
        var cd = getRd(op);
        var select = (op & 0x7);

        this.genRegisters[rt].putUInt32(this.getC0Register(cd, select).asUInt32());
        this.advancePC();
    }
	
    this.MTC0 = function ( op ) {
        //DEBUG("MTC0");
        var rt = getRt(op);
        var cd = getRd(op);
		var rt_val = this.genRegisters[rt].asUInt32();
        var select = (op&0x7);

		this.getC0Register(cd,select).putUInt32(rt_val);
        this.advancePC();
    }	
	
	this.MFHI = function ( op ) {
        //DEBUG("MFHI");
		var rd = getRd(op);
		this.genRegisters[rd].putUInt32(this.HI.asUInt32());
		//console.log("MFHI: " + this.genRegisters[rd].asUInt32());
		this.advancePC();
	}
	
	this.MFLO = function ( op ) {
        //DEBUG("MFLO");
		var rd = getRd(op);
		this.genRegisters[rd].putUInt32(this.LO.asUInt32());
		this.advancePC();
	}

    this.MOVN = function ( op ) {
        //DEBUG("MOVN");
        var rt = getRt(op);
        var rs = getRs(op);
        var rd = getRd(op);

        if(this.genRegisters[rt].asUInt32() != 0)
        {
            this.genRegisters[rd].putUInt32(this.genRegisters[rs].asUInt32());
        }
        
        this.advancePC();
    }

    this.MOVZ = function ( op ){
        //DEBUG("MOVZ");
        var rt = getRt(op);
        var rs = getRs(op);
        var rd = getRd(op);

        if(this.genRegisters[rt].asUInt32() == 0)
        {
            this.genRegisters[rd].putUInt32(this.genRegisters[rs].asUInt32());
        }
        
        this.advancePC();
    }

    this.MSUB = function ( op ){
        //DEBUG("MSUB");
        var HI_old = this.HI.asUInt32();
        var LO_old = this.LO.asUInt32();

        this.MULT(op);

        var HI_new = this.HI.asUInt32();
        var LO_new = this.LO.asUInt32();


        LO_new = (~LO_new & 0xffffffff) >>> 0;
        LO_new += 1;
        var carry = LO_new >> 32;
        HI_new = (~HI_new & 0xffffffff) >>> 0;
        HI_new += carry;


        var LO_sum = LO_old + LO_new;
        carry = LO_sum >> 32;
        var HI_sum = HI_old + HI_new + carry;

        this.HI.putUInt32(HI_sum);
        this.LO.putUInt32(LO_sum);

        // TODO: handle overflow exception

        // advancePC() is done in this.MULT
    }

    this.MSUBU = function ( op ){
        //DEBUG("MSUBU");
        var HI_old = this.HI.asUInt32();
        var LO_old = this.LO.asUInt32();

        this.MULT(op);

        var HI_new = this.HI.asUInt32();
        var LO_new = this.LO.asUInt32();


        LO_new = (~LO_new & 0xffffffff) >>> 0;
        LO_new += 1;
        var carry = LO_new >> 32;
        HI_new = (~HI_new & 0xffffffff) >>> 0;
        HI_new += carry;


        var LO_sum = LO_old + LO_new;
        carry = LO_sum >> 32;
        var HI_sum = HI_old + HI_new + carry;

        this.HI.putUInt32(HI_sum);
        this.LO.putUInt32(LO_sum);

        // advancePC() is done in this.MULT
    }

	this.MTHI = function ( op ){
		//DEBUG("MTHI");
		
		var rs = getRs(op);
		var rs_val = this.genRegisters[rs].asUInt32();
		
		this.HI.putUInt32(rs_val);
		this.advancePC();
	}
	
	this.MTLO = function ( op ){
		//DEBUG("MTLO");
		
		var rs = getRs(op);
		var rs_val = this.genRegisters[rs].asUInt32();
		
		this.LO.putUInt32(rs_val);
		this.advancePC();
	}
	
	
	this.J = function ( op ) {
        
        var top = (this.PC.asUInt32()&0xf0000000) >>> 0;
        var addr = (top| ((op&0x3ffffff)*4)) >>> 0;
        //DEBUG("jumping to address " + addr.toString(16));
        this.doDelaySlot();
        this.PC.putUInt32(addr);
        	
	}
	
	this.JR = function ( op ) {
		var rs = getRs(op);
		var addr = this.genRegisters[rs].asUInt32();
        //DEBUG("JR (rs: " + rs + ") jumping to address " + addr.toString(16));
		this.doDelaySlot();
		this.PC.putUInt32(addr);
	}
	
	this.JAL = function ( op ) {
	    //same as J but saves return address to stack
        //DEBUG("JAL");
        var pcval = this.PC.asUInt32();
        var top = (pcval&0xf0000000) >>> 0;
        var addr = (top| ((op&0x3ffffff)*4)) >>> 0;
        this.doDelaySlot();
        //DEBUG("jumping to address " + addr.toString(16))
        this.genRegisters[31].putUInt32(pcval+8);
        this.PC.putUInt32(addr);
	}
	
	this.JALR = function ( op ) {
	    //same as J but saves return address to stack
        //DEBUG("JALR");
        var pcval = this.PC.asUInt32();
		var rs = getRs(op);
        var rd = getRd(op);
		var addr = this.genRegisters[rs].asUInt32();
		
        this.doDelaySlot();
        //DEBUG("jumping to address " + addr.toString(16))
        this.genRegisters[rd].putUInt32(pcval+8);
        this.PC.putUInt32(addr);
	}	
	
	this.LUI = function ( op ){
	    var rDest = getRt(op);
	    var c = (op&0x0000ffff) * 65536;
	    //DEBUG("loading upper const into reg "+rDest);
	    this.genRegisters[rDest].putUInt32(c);
	    this.advancePC();
	}
	
	this.LB = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		//DEBUG("LB");
		
		
		this.genRegisters[rt].putUInt32(this.genRegisters[rs].asUInt32()+c);
		var byteVal = this.mmu.readByte(this.genRegisters[rt].asUInt32());
		var signed = (byteVal >>> 7);
		
		if(signed)
		{
			byteVal = (byteVal | 0xffffff00) >>> 0;
		}
		
		this.genRegisters[rt].putUInt32(byteVal);
		this.advancePC();
	}	
	
	this.LBU = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		//DEBUG("LBU");
		
		this.genRegisters[rt].putUInt32(this.genRegisters[rs].asUInt32()+c)
		this.genRegisters[rt].putUInt32(this.mmu.readByte(this.genRegisters[rt].asUInt32()));
		this.advancePC();
	}
	
	this.LH = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		//DEBUG("LH");
		
		
		this.genRegisters[rt].putUInt32(this.genRegisters[rs].asUInt32()+c);
		var halfwordVal = this.mmu.readHalfWord(this.genRegisters[rt].asUInt32());
		var signed = (halfwordVal >>> 15);
		
		if(signed)
		{
			halfwordVal = (halfwordVal | 0xffff0000) >>> 0;
		}
		
		this.genRegisters[rt].putUInt32(halfwordVal);
		this.advancePC();
	}	
	
	this.LHU = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		//DEBUG("LHU");
		
		this.genRegisters[rt].putUInt32(this.genRegisters[rs].asUInt32()+c)
		this.genRegisters[rt].putUInt32(this.mmu.readHalfWord(this.genRegisters[rt].asUInt32()));
		this.advancePC();
	}
	
	this.LL = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		//WARN("LL implement address error???")
		var addr = this.genRegisters[rs].asUInt32()+c;
		
		this.genRegisters[rt].putUInt32(addr)
		this.genRegisters[rt].putUInt32(this.mmu.readWord(this.genRegisters[rt].asUInt32()));
		this.llAddrRegister.putUInt32(addr);
		this.LLBit = 1;
		this.advancePC();
	}	


	this.LW = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		//DEBUG("LW");

        var rsVal = this.genRegisters[rs].asUInt32();
        var newRtValAddr = ((rsVal+c) & 0xffffffff) >>> 0;

        var newRtVal = this.mmu.readWord(newRtValAddr);

		this.genRegisters[rt].putUInt32(newRtVal);

		this.advancePC();
	}
	
	this.LWL = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		
		var addr = ((this.genRegisters[rs].asUInt32()+c) & 0xffffffff) >>> 0;
		var rtVal = this.genRegisters[rt].asUInt32()
		var wordVal = this.mmu.readWord(addr);
		
		var offset = addr % 4;
		
		var result;
		
		switch(offset){
		    case 0:
		        result = wordVal;
		        break;
		    case 1:
		        result = (wordVal & 0xffffff00) | (rtVal & 0xff);
		        break;
		    case 2:
		        result = (wordVal & 0xffff0000) | (rtVal & 0xffff);
		        break;
		    case 3:
		        result = (wordVal & 0xff000000) | (rtVal & 0xffffff);
		        break;
		}
		
		
		
		this.genRegisters[rt].putUInt32(result);
		this.advancePC();
	}	
	
	this.LWR = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		

		var addr = ((this.genRegisters[rs].asUInt32()+c) & 0xffffffff) >>> 0;
		var rtVal = this.genRegisters[rt].asUInt32()
		var wordVal = this.mmu.readWord(addr-3);
		var offset = addr % 4;
		

		var result;
		
		switch(offset){
		    case 3:
		        result = wordVal;
		        break;
		    case 2:
		        result = (wordVal & 0x00ffffff) | (rtVal & 0xff000000);
		        break;
		    case 1:
		        result = (wordVal & 0xffff) | (rtVal & 0xffff0000);
		        break;
		    case 0:
		        result = (wordVal & 0xff) | (rtVal & 0xffffff00);
		        break;
		}
		
		this.genRegisters[rt].putUInt32(result);
		this.advancePC();
	}		
	
	this.SW = function ( op ){
	
	    //DEBUG("SW storing word");
	    var c = getSigned16(op&0x0000ffff);
        var rs = getRs(op);
	    var rt = getRt(op);
	    this.mmu.writeWord( (((this.genRegisters[rs].asUInt32() + c) & 0xffffffff) >>> 0), this.genRegisters[rt].asUInt32()  );
		/*if(c == 28)
		{
			console.log("sw: " + this.genRegisters[rt].asUInt32() + ", rs: " + rs + ", rt: " + rt + ", c: " + c + ", address: " + (((this.genRegisters[rs].asUInt32() + c) & 0xffffffff) >>> 0));
	    }*/
		this.advancePC();
	    
	}
	
	this.SWL = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		
		var addr = ((this.genRegisters[rs].asUInt32()+c) & 0xffffffff) >>> 0;
		var rtVal = this.genRegisters[rt].asUInt32()
		var wordVal = this.mmu.readWord(addr);
		
		var offset = addr % 4;
		
		var result;
		
		switch(offset){
		    case 0:
		        result = rtVal;
		        break;
		    case 1:
		        result = (rtVal & 0xffffff00) | (wordVal & 0xff);
		        break;
		    case 2:
		        result = (rtVal & 0xffff0000) | (wordVal & 0xffff);
		        break;
		    case 3:
		        result = (rtVal & 0xff000000) | (wordVal & 0xffffff);
		        break;
		}
		
		
	    this.mmu.writeWord(addr, result);	
		this.advancePC();
	}	
	
	this.SWR = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		

		var addr = ((this.genRegisters[rs].asUInt32()+c) & 0xffffffff) >>> 0;
		var rtVal = this.genRegisters[rt].asUInt32()
		var wordVal = this.mmu.readWord(addr-3);
		var offset = addr % 4;
		

		var result;
		
		switch(offset){
		    case 3:
		        result = rtVal;
		        break;
		    case 2:
		        result = (rtVal & 0x00ffffff) | (wordVal & 0xff000000);
		        break;
		    case 1:
		        result = (rtVal & 0xffff) | (wordVal & 0xffff0000);
		        break;
		    case 0:
		        result = (rtVal & 0xff) | (wordVal & 0xffffff00);
		        break;
		}
		
        this.mmu.writeWord(addr-3,result);
		this.advancePC();
	}		
	
	this.B = function ( op ) {
		var offset = getSigned16(op & 0x0000ffff);
		this.doDelaySlot();
		//DEBUG("B");
		this.PC.incr(offset);
		this.advancePC();
	}
	
	this.BAL = function ( op ){
		var offset = getSigned16(op & 0x0000ffff);
		var ret_addr = this.PC.asUInt32() + 8;
		this.genRegisters[31].putUInt32(ret_addr);
		this.doDelaySlot();
		//DEBUG("BAL");
		this.PC.putUInt32(this.PC.asUInt32() + offset);
		this.advancePC();
	}
	
	this.BEQ = function ( op ) {
		var rs = getRs(op);
		var rt = getRt(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		this.doDelaySlot();
		var pc_val = this.PC.asUInt32();
		var addr = pc_val + offset;
		
		if(rs_val == rt_val)
		{
			//DEBUG("BEQ - taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BEQ - not taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
			this.advancePC();
		}
	}
	
	this.BEQL = function ( op ) {
		var rs = getRs(op);
		var rt = getRt(op);
		var offset = getSigned16(op&0x0000ffff);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		if(rs_val == rt_val)
		{
			this.doDelaySlot();
			var pc_val = this.PC.asUInt32();
			var addr = pc_val + offset;
			//DEBUG("BEQL - taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BEQL - not taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
			this.advancePC();
			this.advancePC();
		}
	}
	
	this.BGEZ = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		this.doDelaySlot();
		var pc_val = this.PC.asUInt32();
		var addr = pc_val + offset;
		
		if(rs_val >= 0)
		{
			//DEBUG("BGEZ - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BGEZ - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
		}
	}

	this.BGEZAL = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		this.doDelaySlot();
		var pc_val = this.PC.asUInt32();
		var addr = pc_val + offset;
		
		this.genRegisters[31].putUInt32(pc_val+4);
		
		if(rs_val >= 0)
		{
			//DEBUG("BGEZAL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BGEZAL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
			this.advancePC();
		}
	}

	this.BGEZALL = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		var pc_val = this.PC.asUInt32();
		
		this.genRegisters[31].putUInt32(pc_val+8);
		
		if(rs_val >= 0)
		{
			this.doDelaySlot();	
			var addr = pc_val + 4 + offset;	
			//DEBUG("BGEZALL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BGEZALL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
			this.advancePC();
		}
	}

	this.BGEZL = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		var pc_val = this.PC.asUInt32();
		
		if(rs_val >= 0)
		{
			this.doDelaySlot();	
			var addr = pc_val + 4 + offset;	
			//DEBUG("BGEZL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BGEZL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
			this.advancePC();
		}
	}	
	
	this.BGTZ = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		this.doDelaySlot();
		var pc_val = this.PC.asUInt32();
		var addr = pc_val + offset;
		
		if(rs_val > 0)
		{
			//DEBUG("BGTZ - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BGTZ - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
		}	
	}
	
	this.BGTZL = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		if(rs_val > 0)
		{
			this.doDelaySlot();
			var pc_val = this.PC.asUInt32();
			var addr = pc_val + offset;
			//DEBUG("BGTZL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BGTZL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
			this.advancePC();
		}	
	}	
	
	this.BLEZ = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		this.doDelaySlot();
		var pc_val = this.PC.asUInt32();
		var addr = pc_val + offset;
		
		if(rs_val <= 0)
		{
			//DEBUG("BLEZ - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BLEZ - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
		}
	}	
	
	this.BLEZL = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		if(rs_val <= 0)
		{
			this.doDelaySlot();
			var pc_val = this.PC.asUInt32();
			var addr = pc_val + offset;
			//DEBUG("BLEZL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BLEZL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
			this.advancePC();
		}
	}

	this.BLTZ = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		this.doDelaySlot();
		var pc_val = this.PC.asUInt32();
		var addr = pc_val + offset;
		
		if(rs_val < 0)
		{
			//DEBUG("BLTZ - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BLTZ - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
		}
	}	
	
	this.BLTZAL = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		this.doDelaySlot();
		var pc_val = this.PC.asUInt32();
		var addr = pc_val + offset;
		
		this.genRegisters[31].putUInt32(pc_val+4);
		
		if(rs_val < 0)
		{
			//DEBUG("BLTZAL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BLTZAL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
		}
	}	
	
	this.BLTZALL = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		var pc_val = this.PC.asUInt32();
		
		this.genRegisters[31].putUInt32(pc_val+8);
		
		if(rs_val < 0)
		{
			this.doDelaySlot();
			var addr = pc_val + 4 + offset;
			//DEBUG("BLTZALL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BLTZALL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
			this.advancePC();
		}
	}	

	this.BLTZL = function ( op ) {
		var rs = getRs(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		
		if(rs_val < 0)
		{
			this.doDelaySlot();
			var pc_val = this.PC.asUInt32();
			var addr = pc_val + offset;
			//DEBUG("BLTZL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BLTZL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.advancePC();
			this.advancePC();
		}
	}
	
	this.BNE = function ( op ) {
		var rs = getRs(op);
		var rt = getRt(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		this.doDelaySlot();
		var pc_val = this.PC.asUInt32();
		var addr = pc_val + offset;
		
		if(rs_val != rt_val)
		{
			//DEBUG("BNE - taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BNE - not taking branch");
			this.advancePC();
		}
	}	

	this.BNEL = function ( op ) {
		var rs = getRs(op);
		var rt = getRt(op);
		var offset = getSigned16((op&0x0000ffff) * 4);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		if(rs_val != rt_val)
		{
			this.doDelaySlot();
			var pc_val = this.PC.asUInt32();
			var addr = pc_val + offset;
			//DEBUG("BNEL - taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			//DEBUG("BNEL - not taking branch");
			this.advancePC();
			this.advancePC();
		}
	}	
	
	this.CLO = function ( op ) {
		//DEBUG("CLO");
		var rs = getRs(op);
		var rd = getRd(op);
		var rs_val = this.genRegisters[rs].asUInt32();
		
		var bit = (rs_val & 0x80000000);
		var count = 0;
		
		while(bit)
		{
			rs_val = ((rs_val * 2) & 0xffffffff) >>> 0;
			bit = (rs_val & 0x80000000);
			count++;
		}		
	
		this.genRegisters[rd].putUInt32(count);
		this.advancePC();
	}
	
	this.CLZ = function ( op ) {
		//DEBUG("CLZ");
		var rs = getRs(op);
		var rd = getRd(op);
		var rs_val = (~this.genRegisters[rs].asUInt32() & 0xffffffff) >>> 0;
		
		var bit = (rs_val & 0x80000000);
		var count = 0;
		
		while(bit)
		{
			rs_val = ((rs_val * 2) & 0xffffffff) >>> 0;
			bit = (rs_val & 0x80000000);
			count++;
		}		
	
		this.genRegisters[rd].putUInt32(count);
		this.advancePC();
	}	
	
	this.DIV = function ( op ) {
		//DEBUG("DIV");
		var rs = getRs(op);
		var rt = getRt(op);
		
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		var rt_val = getSigned(this.genRegisters[rt].asUInt32());
		
		var modulo = rs_val % Math.abs(rt_val);
		var answer = (rs_val - modulo)/rt_val;
		
		this.LO.putUInt32(answer);
		this.HI.putUInt32(modulo);
		this.advancePC();
	}
	
	this.DIVU = function ( op ) {
		//DEBUG("DIVU");
		var rs = getRs(op);
		var rt = getRt(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		var modulo = rs_val % rt_val;
		var answer = (rs_val - modulo)/rt_val;
		
		this.LO.putUInt32(answer);
		this.HI.putUInt32(modulo);
		this.advancePC();
	}

    this.ERET = function ( op ) {
        //DEBUG("ERET");
        var c0registers = this.C0Registers;
        var statusReg = c0registers[12];
        var newPCVal = 0;

        /*if(statusReg.ERL == 1)
        {
            WARN("Error_exception logic not implemented yet!");
            newPCVal = c0registers[30].asUInt32(); 
            statusReg.ERL = 0;
        }
        else
        {*/
            newPCVal = c0registers[14].asUInt32();
            statusReg.EXL = 0;
        //}
    
        this.LLBit = 0;
        //INFO("ERET, PC: " + this.PC.asUInt32().toString(16) + ", newPC: " + newPCVal.toString(16) + ", v0: " + this.genRegisters[2].asUInt32().toString(16));
        this.PC.putUInt32(newPCVal);
        //INFO("new PC: " + this.PC.asUInt32().toString(16));
    }
	
	
    this.SYSCALL = function ( op ) {
        //DEBUG("SYSCALL");
        var v0_val = this.genRegisters[2].asUInt32();
        var a0_val = this.genRegisters[4].asUInt32();

        if(v0_val == 4)
        {
            var characterInt;
            var stringToPrint = "";

            for(characterInt = this.mmu.readByte(a0_val); characterInt != 0; a0_val++)
            {
                stringToPrint += String.fromCharCode(characterInt);
                characterInt = this.mmu.readByte(a0_val+1);
            }

            terminal(stringToPrint);
        }
        else
        {
            //console.log("syscall...");
            this.triggerException(15,8); 
        }
        
        /*if(v0_val == 5)
        {
            process.exit(0);
        }
        
        if(v0_val == 6)
        {
            process.exit(1);
        }*/

		this.advancePC();
    }	

    this.TLBP = function ( op ) {
       //DEBUG("TLBP");
       var c0registers = this.C0Registers;
       var entryHi = c0registers[10].asUInt32();
       var result = this.mmu.tlbProbe(entryHi);
       var indexReg = c0registers[0];

       if(result > -1)
       {
          indexReg.putUInt32(result);
       }
       else
       {
          indexReg.putUInt32(indexReg.asUInt32() | 0x80000000); 
       }
       this.advancePC();
    }

    this.TLBR = function ( op ) {
        //DEBUG("TLBR");
        
        var c0registers = this.C0Registers;
        var index = c0registers[0].asUInt32();
        var tlbParsed = this.mmu.readTLBEntry(index);
        var entryLo0 = c0registers[2];
        var entryLo1 = c0registers[3];
        var pagemask = c0registers[5];
        var entryHi = c0registers[10];

        entryLo0.putUInt32(tlbParsed[0]);
        entryLo1.putUInt32(tlbParsed[1]);
        entryHi.putUInt32(tlbParsed[2]);
        pagemask.putUInt32(tlbParsed[3]);
        this.advancePC();
    }

    this.TLBWI = function ( op ) {
        //DEBUG("TLBWI");
        var c0registers = this.C0Registers;
        var index = c0registers[0].asUInt32();
        var entryHi = c0registers[10].asUInt32();
        var entryLo0 = c0registers[2].asUInt32();
        var entryLo1 = c0registers[3].asUInt32();
        var pagemask = c0registers[5].rawUInt32();
        this.mmu.writeTLBEntry(index, entryLo0, entryLo1, entryHi, pagemask);
        this.advancePC();
    }

    this.TLBWR = function ( op ) {
        //DEBUG("TLBWR");
        var c0registers = this.C0Registers;
        var index = c0registers[1].asUInt32();
        var entryHi = c0registers[10].asUInt32();
        var entryLo0 = c0registers[2].asUInt32();
        var entryLo1 = c0registers[3].asUInt32();
        var pagemask = c0registers[5].asUInt32();
        this.mmu.writeTLBEntry(index, entryLo0, entryLo1, entryHi, pagemask);
        this.advancePC();
    }

    this.SYNC = function ( op ) {
        // ignore in emulator
        this.advancePC();
    }
}
