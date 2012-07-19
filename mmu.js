/* Memory management unit (mmu)

This class provides the memory access abstractions including the translation
from virtual address's to physical addresses.

The context of a memory access depends on the cpu state and so the mmu will
behave and access memory, this means it requires access to the cpu state.

*/



function Mmu(size) {
    //member cpu , to save space i wont make a setter. its set by the emu object
    this.physicalMemory = new OctetBuffer(size);

    this.readByte = function(address)
    {
        return this.physicalMemory.getByte(address);
    }

    this.writeByte = function(address, val)
    {
        this.physicalMemory.putByte(address, val);
    }
	
	this.readWord = function(address)
	{
		if(this.cpu.getEndianness() == 0)
		{
			return this.physicalMemory.getUInt32LE(address);
		}
		else
		{
			return this.physicalMemory.getUInt32BE(address);
		}
	}
	
	this.writeWord = function(address, value)
	{
		if(this.cpu.getEndianness() == 0)
		{
			return this.physicalMemory.putUInt32LE(address, value >>> 0);
		}
		else
		{
			return this.physicalMemory.putUInt32BE(address, value >>> 0);
		}	
	}
}
