$(document).ready(function() {
INFO("Starting MIPS 4kc js emulator.");
emu = new Emulator();
INFO("Parsing SREC.");
emu.mmu.loadSREC(browser_srec, 1);

PCLogCounter = 0;

setInterval(function () {

    for(var i = 0 ; i < 10000 ; i++){
        emu.step();
    }
    
}, 0);
});
