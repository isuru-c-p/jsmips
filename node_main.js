fs = require('fs')



emu = new Emulator()

DEBUG("loading "+ process.argv[2]);
emu.mmu.physicalMemory.loadHexString(new String(fs.readFileSync(process.argv[2])),0)
entryPoint = parseInt(process.argv[3], 16);


tracer = new Tracer("mips.trace")

emu.cpu.PC.putUInt32(entryPoint)


setInterval(function () {

    for(var i = 0 ; i < 500 ; i++){
        //tracer.writeTrace(emu);
        emu.step();
    }

}, 0)
