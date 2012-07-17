/* This class represents the emulator as a whole, it contains all the hardware.
*/


function Emulator() {
    
    this.mmu = new Mmu(1024*1024*128);
    this.cpu = new MipsCpu();
    
    this.mmu.cpu = this.cpu;
    this.cpu.mmu = this.mmu;
    
    
    this.step = function () {
        DEBUG("emulator tick");
        this.cpu.step();
    }
    
    

}
