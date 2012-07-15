/* Memory management unit (mmu)

This class provides the memory access abstractions including the translation
from virtual address's to physical addresses.

The context of a memory access depends on the cpu state and so the mmu will
behave and access memory, this means it requires access to the cpu state.

*/



function Mmu(cpu,size) {

    this.cpu = cpu
    this.physicalMemory = new OctetBuffer(size)


}
