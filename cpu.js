

function GeneralRegister() {
    
    this.val = 0;
    
    this.getValue = function () {
        return this.val;
    }
    
    this.writeValue = function ( val ) {
        this.val = val;
    }

}



function MipsCpu () {

    //member mmu , to save space i wont make a setter. its set by the emu object
    
    this.genRegisters = new Array(32); // array of 32 32 bit integers

}
