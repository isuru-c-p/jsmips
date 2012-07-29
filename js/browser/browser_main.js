$(document).ready(function() {
INFO("Starting MIPS 4kc js emulator.");
emu = new Emulator();
INFO("Parsing SREC.");
emu.mmu.loadSREC(browser_srec, 1);

PCLogCounter = 0;

setInterval(function () {

    PCLogCounter += 1;
    for(var i = 0 ; i < 500 ; i++){
        emu.step();
    }
    
    if(PCLogCounter >= 10000){
        PCLogCounter = 0;
        INFO("PCsampler: " + emu.cpu.PC.asUInt32().toString(16))
    }

}, 0);
});
