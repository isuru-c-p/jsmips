/* Memory management unit (mmu)

This class provides the memory access abstractions including the translation
from virtual address's to physical addresses.

The context of a memory access depends on the cpu state and so the mmu will
behave and access memory, this means it requires access to the cpu state.

*/



function Mmu(size) {
    //member cpu , to save space i wont make a setter. its set by the emu object
    this.physicalMemory = new OctetBuffer(size);
    // structure of tlb, each tlb entry = 4 array entries, 2 tag entry (1 for page mask) + 2 data entries
    this.tlb = new Uint32Array(4*16);

    this.addressTranslation = function(va, write) {
        function tlbLookup(addr, wr) {
           var asid = this.cpu.EntryHiReg.ASID;
           var vpn = addr >>> 12;
           var tlb = this.tlb;
           for(i = 0; i < 64; i+= 4)
           {
               var tlbentry = tlb[i+1];

               if(((tlbentry & 0xff) == asid) | ((tlbentry >>> 8) == 0))
               {
                    var pagemask_raw = tlb[i];
                    var pagemask = Math.pow(2,pagemask_raw*2)-1;
                    var pagemask_n = ~(pagemask) >>> 0;
                    var vpn2entry = (tlbentry >>> 9) & pagemask_n ;
                    var vpncomp = (vpn & pagemask_n);
                    if(vpn2entry == vpncomp)
                    {
                         var evenoddbit = 12 + pagemask_raw*2;
                         var evenoddbitVal = (va >>> evenoddbit) & 0x1;
                         var dataEntry = tlb[i+2+evenoddbitVal];
                         var validBit = dataEntry & 0x1;
                         var dirtyBit = (dataEntry >>> 1) & 0x1;
                         
                         if(!validBit)
                         {
                            // TODO: TLB invalid exception
                            break;
                         } 

                         if(write && !dirtyBit)
                         {
                            // TODO: TLB modified exception
                            break;
                         }

                         var offset_mask = 2047 | (pagemask * 4096); // (2^11-1) | (pagemask << 12)  
                         var pa = (dataEntry & pagemask_n) | (va & offset_mask); 
                         return pa;
                    }
               }
 
           }
        }        

        if(this.cpu.isKernelMode())
        {
            var top3 = va >>> 29;

            // kseg0
            if(top3 == 0x4)
            {
                return (va - 0x80000000);
            }
            // kseg1
            else if(top3 == 5)
            {
                return (va - 0xa0000000);
            }
            // kuseg when ERL = 1
            else if((top3 < 0x4) & (this.cpu.statusRegister.ERL == 1))
            {
               return va; 
            }
            // kseg3 in debug mode
            // TODO
            // kuseg (ERL=0), kseg2 and kseg3
            else
            {
                return tlbLookup(va,write);
            }
        }
        else
        {
            if((va >>> 31) == 0)
            {
                return tlbLookup(va,write);
            }
            else
            {
                // trigger address error exception
            }
        }
    }
    
    this.getPhysicalSize = function() {
        return this.physicalMemory.getSize();
    }

	this.readHalfWord = function(address)
	{
		return this.physicalMemory.getUInt16LE(address);
	}
	
    this.writeHalfWord = function(address, val)
    {
        this.physicalMemory.putUInt16LE(address, val);
    }	

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
