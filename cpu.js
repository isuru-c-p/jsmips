

function GeneralRegister() {
    
    this.val = 0;
    
    this.getValue = function () {
        return this.val;
    }
    
    this.writeValue = function ( val ) {
        this.val = val;
    }

}

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
}



function MipsCpu () {

    //member mmu , to save space i wont make a setter. its set by the emu object
    
    this.genRegisters = new Array(32); // array of 32 32 bit integers
	this.statusRegister = new StatusRegister();
}
