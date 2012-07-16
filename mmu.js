/* Memory management unit (mmu)

This class provides the memory access abstractions including the translation
from virtual address's to physical addresses.

The context of a memory access depends on the cpu state and so the mmu will
behave and access memory, this means it requires access to the cpu state.

*/



function Mmu(size) {
    //member cpu , to save space i wont make a setter. its set by the emu object
    this.physicalMemory = new OctetBuffer(size)    
}
