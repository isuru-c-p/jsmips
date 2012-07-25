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
    for(i = 0; i < 48; i++)
    {
        this.tlb[i] = 0;
    }

    this.writeTLBEntry = function(index, entrylo0, entrylo1, entryhi, pagemask)
    {
        var tlb = this.tlb;
        var g = ((entrylo0 & entrylo1) >>> 0) & 0x1;
        var pfn0 = (entrylo0 >>> 6) & 0xfffff;
        var entrylo0low = ((entrylo0) & 0x3f) >>> 0;
        var pfn1 = (entrylo1 >>> 6) & 0xfffff;
        var entrylo1low = ((entrylo1) & 0x3f) >>> 0;
        var vpn2 = (entryhi >>> 13);
        var asid = (entryhi & 0xff) >>> 0;

        tlb[index] = pagemask;//(pagemask >>> 13) & 0xfff;
        tlb[index+1] = ((vpn2 << 9) | (g << 8) | asid) >>> 0;
        tlb[index+2] = (pfn0 << 5) | entrylo0low;
        tlb[index+3] = (pfn1 << 5) | entrylo1low;
    }

    this.readTLBEntry = function(index)
    {
        var ret = new Array[4];
        var tlb = this.tlb; 

        var pagemask_raw = tlb[index]; 
        var pagemask = Math.pow(2,pagemask_raw*2)-1;

        var tlbTag1 = tlb[index+1];

        var vpn2 = tlbTag1 >>> 9;
        var g = (tlbTag1 >>> 8) & 0x1;
        var asid = (tlbTag1 & 0xff);

        var tlbEntry0 = tlb[index+2];

        var pfn0 = (tlbEntry0 >>> 5) & 0xfffff;
        var entrylo0low = tlbEntry0 & 0x3f;

        var tlbEntry1 = tlb[index+3];
        
        var pfn1 = (tlbEntry1 >>> 5) & 0xfffff;
        var entrylo1low = tlbEntry1 & 0x3f;

        var entrylo0 = entrylo0low | (pfn0 << 6); 
        var entrylo1 = entrylo1low | (pfn1 << 6);

        var entryhi = (asid | (vpn2 << 13)) >>> 0; 

        ret[0] = entrylo0low;
        ret[1] = entrylo1low;
        ret[2] = entryhi;
        ret[3] = pagemask;
        return ret;
    }


    this.tlbLookup = function (addr, wr) {
       var asid = this.cpu.entryHiReg.ASID;
       var vpn2 = addr >>> 13;
       var tlb = this.tlb;
       
       for(i = 0; i < 64; i+= 4)
       {
           var tlbentry = tlb[i+1];

           if(((tlbentry & 0xff) == asid) | ((tlbentry >>> 8) == 0))
           {
                var pagemask_raw = tlb[i];
                var pagemask = Math.pow(2,pagemask_raw*2)-1;
                var pagemask_n = (~(pagemask) & 0xfff) >>> 0;
                var vpn2entry = (tlbentry >>> 9) & pagemask_n ;
                var vpn2comp = (vpn2 & pagemask_n);
                if(vpn2entry == vpn2comp)
                {
                     var evenoddbit = 12 + pagemask_raw*2;
                     var evenoddbitVal = (addr >>> evenoddbit) & 0x1;
                     var dataEntry = tlb[i+2+evenoddbitVal];
                     var validBit = dataEntry & 0x1;
                     var dirtyBit = (dataEntry >>> 1) & 0x1;
                     
                     if(!validBit)
                     {
                        this.cpu.entryHiReg.vpn2 = vpn;
                        // TODO: TLB invalid exception
                        break;
                     } 

                     if(write && !dirtyBit)
                     {
                        this.cpu.entryHiReg.vpn2 = vpn;
                        // TODO: TLB modified exception
                        break;
                     }

                     var offset_mask = 4095 | (pagemask * 4095); // (2^13-1) | (pagemask << 13)  
                     var pa_mask = 1 + (pagemask_n << 1) + 1040384; // (0b1111111 << 13) | pagemask_n << 1 | 1 
                     var pfn = (dataEntry >>> 5) & pa_mask;
                     var pa = (pfn << 12) | (addr & offset_mask); 
                     return pa;
                }
           }

       }

        this.cpu.entryHiReg.vpn2 = vpn;

        if(this.cpu.statusRegister.EXL == 0)
        {
            // TODO: TLB Refill exception
        }
        else
        {
            // TODO: TLB Invalid exception
        }
    }            
    
    this.addressTranslation = function(va, write) {
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
                return this.tlbLookup(va,write);
            }
        }
        else
        {
            if((va >>> 31) == 0)
            {
                return this.tlbLookup(va,write);
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
		return this.physicalMemory.getUInt16LE(this.addressTranslation(address,0));
	}
	
    this.writeHalfWord = function(address, val)
    {
        this.physicalMemory.putUInt16LE(this.addressTranslation(address,1), val);
    }	

    this.readByte = function(address)
    {
        return this.physicalMemory.getByte(this.addressTranslation(address,0));
    }

    this.writeByte = function(address, val)
    {
        this.physicalMemory.putByte(this.addressTranslation(address,1), val);
    }
	
	this.readWord = function(address)
	{
        var addr = this.addressTranslation(address,0);
		if(this.cpu.getEndianness() == 0)
		{
			return this.physicalMemory.getUInt32LE(addr);
		}
		else
		{
			return this.physicalMemory.getUInt32BE(addr);
		}
	}
	
	this.writeWord = function(address, value)
	{
        var addr = this.addressTranslation(address,1);
		if(this.cpu.getEndianness() == 0)
		{
			return this.physicalMemory.putUInt32LE(addr, value >>> 0);
		}
		else
		{
			return this.physicalMemory.putUInt32BE(addr, value >>> 0);
		}	
	}
}
