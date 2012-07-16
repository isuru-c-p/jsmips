fs = require('fs')



emu = new Emulator()

DEBUG("loading "+ process.argv[2]);
emu.mmu.physicalMemory.loadHexString(new String(fs.readFileSync(process.argv[2])),0)

setInterval(function () {

    emu.step();

}, 1)
