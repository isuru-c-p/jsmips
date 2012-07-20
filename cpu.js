

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
    for(var i = 1; i < 32; i++) {
        this.C0Registers[i] = new GeneralRegister();
    }
    
    this.HI = new GeneralRegister();
	this.LO = new GeneralRegister();
    
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
	
	this.doDelaySlot = function() {
		this.PC.incr(4);
	    var delayInsAddr = this.PC.asUInt32();
	    DEBUG("Executing delay slot ins at " + delayInsAddr.toString(16));
	    var ins = this.mmu.readWord(delayInsAddr);
	    this.delaySlot = true;
	    this.doOp(ins);
	    this.delaySlot = false;
	
	};
	
	
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
	    var ins = this.mmu.readWord(pcVal);
	    DEBUG("instruction word: " + ins.toString(16));
	    this.doOp(ins);
	    
	}
	
	this.OR = function ( op ) {
		DEBUG("OR");
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
		
		
		DEBUG("ORI rs: " + rs.toString(16) + ", rt: " + rt.toString(16) + ", c: " + c.toString(16) + ", rs_val: " + rs_val + ", result: " + this.genRegisters[rt].asUInt32());
	}

    this.SB = function ( op ){
        var rs = getRs(op);
        var rt = getRt(op);
        var offset = getSigned16(op & 0x0000ffff);

        var rs_val = (this.genRegisters[rs].asUInt32() & 0xff) >>> 0;

        var addr = ((rs_val + offset) & 0xffffffff) >>> 0; 

        this.mmu.writeByte(addr, rs_val);
        
        this.advancePC();
    }
	
	this.XOR = function ( op ) {
        DEBUG("XOR");
		var rs = getRs(op);
		var rt = getRt(op);
		var rd = getRd(op);
		
		var rs_val = this.genRegisters[rs].asUInt32();
		var rt_val = this.genRegisters[rt].asUInt32();
		
		DEBUG("XOR");
		
		this.genRegisters[rd].putUInt32(rs_val ^ rt_val);
		this.advancePC();
	}

    this.XORI = function ( op ) {
        DEBUG("XORI");
        var rs = getRs(op);
        var c = (op & 0x0000ffff);
        var rt = getRt(op);

        var rs_val = this.genRegisters[rs].asUInt32();
        var result = (rs_val ^ c);

        this.genRegisters[rt].putUInt32(result);
        this.advancePC();
    }
	
	this.NOR = function ( op ) {
		DEBUG("NOR");
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
		DEBUG("SLT");
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
		DEBUG("SLTI");
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
		DEBUG("SLTIU");
		var rs = getRs(op);
		var rt = getRt(op);
		var c = (op&0x0000ffff) >>> 0;
		
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
		DEBUG("SLTU");
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
	
	this.SLL = function ( op ){
		DEBUG("SLL");
		var rd = getRd(op);
		var rt = getRt(op);
		var sa = getSHAMT(op);
		var val = this.genRegisters[rt].asUInt32() * Math.pow(2,sa);
		
		this.genRegisters[rd].putUInt32(val);
		this.advancePC();
	}
	
	this.SLLV = function ( op ){
		DEBUG("SLLV");
		var rd = getRd(op);
		var rt = getRt(op);
		var rs = getRs(op);
		var val = (this.genRegisters[rt].asUInt32()) * Math.pow(2,this.genRegisters[rs].asUInt32()&0x0000001f);
		this.genRegisters[rd].putUInt32(val);
		this.advancePC();
	}
	
	this.SRL = function ( op ){
		DEBUG("SRL");
		var rd = getRd(op);
		var rt = getRt(op);
		var sa = getSHAMT(op);
		var val = this.genRegisters[rt].asUInt32() >>> sa;
		
		this.genRegisters[rd].putUInt32(val);
		this.advancePC();
	}
	
	this.SRLV = function ( op ){
		DEBUG("SRLV");
		var rd = getRd(op);
		var rt = getRt(op);
		var rs = getRs(op);
		var val = (this.genRegisters[rt].asUInt32()) / Math.pow(2,this.genRegisters[rs].asUInt32()&0x0000001f);
		this.genRegisters[rd].putUInt32(val);
		this.advancePC();
	}
	
	this.SRA = function ( op ){
		DEBUG("SRA");
		var rd = getRd(op);
		var rt = getRt(op);
		var rt_val = this.genRegisters[rt].asUInt32();
		var shamt = getSHAMT(op);
		
		var sign = (rt_val >>> 31);
		var val = (rt_val & 0x7fffffff) >>> 0;
		var shifted_val = (val >>> shamt);
		
		if(sign != 0)
		{
			var shamt_mask = (~(0xffffffff >>> shamt) >>> 0);
			shifted_val = (shifted_val | shamt_mask);
		}
		
		
		this.genRegisters[rd].putUInt32(shifted_val);
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
		DEBUG("AND");
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
		DEBUG("ANDI");
		var rs = getRs(op);
		var rt = getRt(op);
		var imm = (op&0x0000ffff);
		
		var result = this.genRegisters[rs].asUInt32();
		result = ((result & 0x0000ffff) & imm) >>> 0;
		
		this.genRegisters[rt].putUInt32(result);
		this.advancePC();
	}
	
	this.ADDIU = function ( op ){
	    var imm = getSigned16(op&0x0000ffff);
	    var rs = getRs(op);
	    var rt = getRt(op);
	    DEBUG("add reg "+rs + " with imm " + imm + " and save in reg " + rt );
	    var res = this.genRegisters[rs].asUInt32() + imm;
	    res = res % 4294967296; // handle overflow
	    this.genRegisters[rt].putUInt32(res);
	    this.advancePC();
	    
	}
	
	this.ADDU = function ( op ){
	    
	    var rs = getRs(op);
	    var rt = getRt(op);
	    var rd = getRd(op);
	    
	    DEBUG("addu");
	    var res = this.genRegisters[rt].asUInt32() + this.genRegisters[rs].asUInt32();
	    res = res % 4294967296; // handle overflow
	    this.genRegisters[rd].putUInt32(res);
	    this.advancePC();
	    
	}
	
	this.MULT = function ( op ){
		var rs = getRs(op);
		var rt = getRt(op);
		
		var number1 = this.genRegisters[rs].asUInt32();
		var number2 = this.genRegisters[rt].asUInt32();
		
		var sign = (number1/number1) * (number2/number2);
				
		var number1Hi = number1 >>> 16;
		var number1Lo = (number1 & 0xffff);
		var number2Hi = number2 >>> 16;
		var number2Lo = (number2 & 0xffff);
		var z2 = (number1Hi * number2Hi);
		var z1 = (number1Hi * number2Lo) + (number1Lo * number2Hi);
		var z0 = (number1Lo * number2Lo);


		var result = (z2*Math.pow(2,32) + z1*Math.pow(2,16) + z0);

		var t1 = (z1*Math.pow(2,16) + z0);
		this.HI.putUInt32((z2 + ((t1-t1%4294967296) / 4294967296)) >>> 0);
		this.LO.putUInt32(((z1*Math.pow(2,16) + z0) & 0xffffffff) >>> 0);

		var HI_val = this.HI.asUInt32();
		var LO_val = this.LO.asUInt32();
		
		if(sign < 0)
		{
			LO_val = (~(LO_val) + 1);
			var carry = (LO_val - LO_val%Math.pow(2,32)) / Math.pow(2,32);
			LO_val = LO_val & 0xffffffff;
		
		
			HI_val = (~(HI_val) + carry) & 0xffffffff;
			this.HI.putUInt32(HI_val);
			this.L0.putUInt32(LO_val);
		}
		//console.log("A: " + number1 + ", B:" + number2);
		//console.log("Result: 0x"+result.toString(16)+", HI: 0x"+this.HI.asUInt32().toString(16)+", LO: 0x"+this.LO.asUInt32().toString(16));
		this.advancePC();
	}

    this.MUL = function ( op ) {
        var HI_old = this.HI.asUInt32();
        var LO_old = this.LO.asUInt32();

        this.MULT(op);

        var rd = getRd(op);
        this.genRegisters[rd].putUInt32(this.LO.asUInt32());

        this.HI.setUInt32(HI_old);
        this.LO.setUInt32(LO_old);

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
            var carry = LO_old >>> 32;
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
            var carry = LO_new >>> 32;
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
        DEBUG("MFC0");
        var rt = getRt(op);
        var cd = getRd(op);

        this.genRegisters[rt].putUInt32(this.C0Registers[cd].asUInt32());
        this.advancePC();
    }
	
	this.MFHI = function ( op ) {
        DEBUG("MFHI");
		var rd = getRd(op);
		this.genRegisters[rd].putUInt32(this.HI.asUInt32());
		//console.log("MFHI: " + this.genRegisters[rd].asUInt32());
		this.advancePC();
	}
	
	this.MFLO = function ( op ) {
        DEBUG("MFLO");
		var rd = getRd(op);
		this.genRegisters[rd].putUInt32(this.LO.asUInt32());
		this.advancePC();
	}

    this.MOVN = function ( op ) {
        DEBUG("MOVN");
        var rt = getRt(op);
        var rs = getRs(op);
        var rd = getRd(op);

        if(rt != 0)
        {
            this.genRegisters[rd].putUInt32(this.genRegisters[rs].asUInt32());
        }
        
        this.advancePC();
    }

    this.MOVZ = function ( op ){
        DEBUG("MOVZ");
        var rt = getRt(op);
        var rs = getRs(op);
        var rd = getRd(op);

        if(rt == 0)
        {
            this.genRegisters[rd].putUInt32(this.genRegisters[rs].asUInt32());
        }
        
        this.advancePC();
    }

    this.MSUB = function ( op ){
        DEBUG("MSUB");
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
        DEBUG("MSUBU");
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


	
	this.J = function ( op ) {
        
        var top = this.PC.asUInt32()&0xc0000000;
        var addr = top| ((op&0x3ffffff)*4);
        DEBUG("jumping to address " + addr.toString(16));
        this.doDelaySlot();
        this.PC.putUInt32(addr);
        	
	}
	
	this.JR = function ( op ) {
		var rs = getRs(op);
		var addr = this.genRegisters[rs].asUInt32();
        DEBUG("JR (rs: " + rs + ") jumping to address " + addr.toString(16));
		this.doDelaySlot();
		this.PC.putUInt32(addr);
	}
	
	this.JAL = function ( op ) {
	    //same as J but saves return address to stack
        DEBUG("JAL");
        var pcval = this.PC.asUInt32();
        var top = pcval&0xc0000000;
        var addr = top| ((op&0x3ffffff)*4);
        this.doDelaySlot();
        DEBUG("jumping to address " + addr.toString(16))
        this.genRegisters[31].putUInt32(pcval+8);
        this.PC.putUInt32(addr);
	}
	
	this.JALR = function ( op ) {
	    //same as J but saves return address to stack
        DEBUG("JALR");
        var pcval = this.PC.asUInt32();
		var rs = getRs(op);
		var addr = this.genRegisters[rs].asUInt32();
		
        this.doDelaySlot();
        DEBUG("jumping to address " + addr.toString(16))
        this.genRegisters[31].putUInt32(pcval+8);
        this.PC.putUInt32(addr);
	}	
	
	this.LUI = function ( op ){
	    var rDest = getRt(op);
	    var c = (op&0x0000ffff) * 65536;
	    DEBUG("loading upper const into reg "+rDest);
	    this.genRegisters[rDest].putUInt32(c);
	    this.advancePC();
	}
	
	this.LB = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		DEBUG("LB");
		
		
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
		DEBUG("LBU");
		
		this.genRegisters[rt].putUInt32(this.genRegisters[rs].asUInt32()+c)
		this.genRegisters[rt].putUInt32(this.mmu.readByte(this.genRegisters[rt].asUInt32()));
		this.advancePC();
	}
	
	this.LH = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		DEBUG("LH");
		
		
		this.genRegisters[rt].putUInt32(this.genRegisters[rs].asUInt32()+c);
		var halfwordVal = this.mmu.readHalfWord(this.genRegisters[rt].asUInt32());
		var signed = (byteVal >>> 15);
		
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
		DEBUG("LHU");
		
		this.genRegisters[rt].putUInt32(this.genRegisters[rs].asUInt32()+c)
		this.genRegisters[rt].putUInt32(this.mmu.readHalfWord(this.genRegisters[rt].asUInt32()));
		this.advancePC();
	}
	
	this.LL = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		DEBUG("LL");
		var addr = this.genRegisters[rs].asUInt32()+c;
		
		this.genRegisters[rt].putUInt32(addr)
		this.genRegisters[rt].putUInt32(this.mmu.readWord(this.genRegisters[rt].asUInt32()));
		this.llAddrRegister.putUInt32(addr);
		// TODO set LL whatever it is
		this.advancePC();
	}	
	
	this.LW = function ( op ){
		var rt = getRt(op);
		var rs = getRs(op);
		var c = getSigned16(op&0x0000ffff);
		DEBUG("LW");
		
		this.genRegisters[rt].putUInt32(this.genRegisters[rs].asUInt32()+c)
		this.genRegisters[rt].putUInt32(this.mmu.readWord(this.genRegisters[rt].asUInt32()));
		this.advancePC();
	}
	
	this.SW = function ( op ){
	
	    DEBUG("SW storing word");
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
	
	this.B = function ( op ) {
		var offset = getSigned16(op & 0x0000ffff);
		this.doDelaySlot();
		DEBUG("B");
		this.PC.incr(offset);
		this.advancePC();
	}
	
	this.BAL = function ( op ){
		var offset = getSigned16(op & 0x0000ffff);
		var ret_addr = this.PC.asUInt32() + 8;
		this.genRegisters[31].putUInt32(ret_addr);
		this.doDelaySlot();
		DEBUG("BAL");
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
			DEBUG("BEQ - taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BEQ - not taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
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
			DEBUG("BEQL - taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BEQL - not taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
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
			DEBUG("BGEZ - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BGEZ - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BGEZAL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BGEZAL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BGEZALL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BGEZALL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BGEZL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BGEZL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BGTZ - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BGTZ - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BGTZL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BGTZL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BLEZ - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BLEZ - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BLEZL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BLEZL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BLTZ - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BLTZ - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BLTZAL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BLTZAL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BLTZALL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BLTZALL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BLTZL - taking branch (offset: " + offset + ") rs_val: " + rs_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BLTZL - not taking branch (offset: " + offset + ") rs_val: " + rs_val);
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
			DEBUG("BNE - taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BNE - not taking branch");
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
			DEBUG("BNEL - taking branch (offset: " + offset + ") rs_val: " + rs_val + " rt_val: " + rt_val);
			this.PC.putUInt32(addr);
		}
		else
		{
			DEBUG("BNEL - not taking branch");
			this.advancePC();
			this.advancePC();
		}
	}	
	
	this.CLO = function ( op ) {
		DEBUG("CLO");
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
		DEBUG("CLZ");
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
		DEBUG("DIV");
		var rs = getRs(op);
		var rt = getRt(op);
		
		var rs_val = getSigned(this.genRegisters[rs].asUInt32());
		var rt_val = Math.abs(getSigned(this.genRegisters[rt].asUInt32()));
		
		var modulo = rs_val % rt_val;
		var answer = (rs_val - modulo)/rt_val;
		
		this.LO.putUInt32(answer);
		this.HI.putUInt32(modulo);
		this.advancePC();
	}
	
	this.DIVU = function ( op ) {
		DEBUG("DIVU");
		var rs = getRs(op);
		var rt = getRt(op);
		
		var rs_val = Math.abs(getSigned(this.genRegisters[rs].asUInt32()));
		var rt_val = Math.abs(getSigned(this.genRegisters[rt].asUInt32()));
		
		var modulo = rs_val % rt_val;
		var answer = (rs_val - modulo)/rt_val;
		
		this.LO.putUInt32(answer);
		this.HI.putUInt32(modulo);
		this.advancePC();
	}
	
	
    this.SYSCALL = function ( op ) {
        DEBUG("SYSCALL");
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

            console.log(stringToPrint);
        }
        
        if(v0_val == 5)
        {
            process.exit(0);
        }
        
        if(v0_val == 6)
        {
            process.exit(1);
        }

		this.advancePC();
    }	
}
