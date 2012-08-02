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
        var entrylo0low = ((entrylo0) & 0x3e) >>> 1;
        var pfn1 = (entrylo1 >>> 6) & 0xfffff;
        var entrylo1low = ((entrylo1) & 0x3e) >>> 1;
        var vpn2 = (entryhi >>> 13);
        var asid = (entryhi & 0xff) >>> 0;

        tlb[index] = pagemask;//(pagemask >>> 13) & 0xfff;
        tlb[index+1] = ((vpn2 << 9) | (g << 8) | asid) >>> 0;
        tlb[index+2] = (pfn0 << 5) | entrylo0low;
        tlb[index+3] = (pfn1 << 5) | entrylo1low;
    }

    this.tlbProbe = function(entryhi)
    {
        var tlb = this.tlb;
        var vpn2 = (entryhi >>> 13);
        var asid = (entryhi & 0xff) >>> 0;

        for(i = 0; i < 64; i+=4)
        {
            var tlbEntry = tlb[i+1];
            var entry_vpn2 = (tlbEntry >>> 9) & 0x7ffff;
            var entry_asid = (tlbEntry & 0xff);
            if((entry_vpn2 == vpn2) && (entry_asid == asid))
            {
                return i;
            }
        }

        return -1;
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

    this.tlbLookup = function (addr, write) {
       //console.log("TLB lookup of addr: " + addr.toString(16));
       var asid = this.cpu.entryHiReg.ASID;
       var vpn2 = addr >>> 13;
       var tlb = this.tlb;

       //console.log("Lookup ASID: " + asid + ", VPN2: " + vpn2);       

       for(var i = 0; i < 64; i+= 4)
       {
           var tlbentry = tlb[i+1];
           //console.log(i);
           //console.log("Entry ASID: " + (tlbentry & 0xff));
           var globalBit = (tlbentry >>> 8) & 0x1;
           
           //console.log("Global: " + globalBit);

           if(((tlbentry & 0xff) == asid) | (globalBit == 0))
           {
                var pagemask_raw = tlb[i];
                var pagemask = Math.pow(2,pagemask_raw*2)-1;
                var pagemask_n = (~(pagemask) & 0xfff) >>> 0;
                var vpn2entry = (tlbentry >>> 9) & pagemask_n ;
                var vpn2comp = (vpn2 & pagemask_n);

                //console.log("VPN2Entry: " + vpn2entry.toString(16) + ", VPN2Comp: " + vpn2comp.toString(16));
                if(vpn2entry == vpn2comp)
                {
                     //console.log("TLB match.");
                     var evenoddbit = 12 + pagemask_raw*2;
                     var evenoddbitVal = (addr >>> evenoddbit) & 0x1;
                     var dataEntry = tlb[i+2+evenoddbitVal];
                     var validBit = dataEntry & 0x1;
                     var dirtyBit = (dataEntry >>> 1) & 0x1;
                     
                     if(!validBit)
                     {
                        this.cpu.entryHiReg.VPN2 = vpn2;
                        this.cpu.C0Registers[8].putUInt32(addr);
                        this.cpu.C0Registers[4].BadVPN2 = vpn2; 
                        // TLB invalid exception
                        INFO("invalid tlb entry, va: " + addr.toString(16));
                        //console.log("invalid tlb entry");
                        if(write == 1)
                        {
                            this.cpu.triggerException(12,3); // excCode = TLBS 
                        }
                        else
                        {
                            this.cpu.triggerException(12,2); // excCode = TLBL
                        }

                        throw 1337;
                        //return addr;
                     } 

                     if(write && !dirtyBit)
                     {
                        INFO("tlb modified exception");
                        this.cpu.entryHiReg.VPN2 = vpn2;
                        this.cpu.entryHiReg.ASID = 
                        this.cpu.C0Registers[8].putUInt32(addr);
                        this.cpu.C0Registers[4].BadVPN2 = vpn2; 
                        // TLB modified exception
                        this.cpu.triggerException(11, 1); // excCode = Mod
                        throw 1337;
                        //return addr;
                     }

                     var pagemask_lsb = pagemask & 0x1;
                     var pagemask_n_lsb = pagemask_n & 0x1;

                     var offset_mask = 4095 | (pagemask_lsb * 4096) | (pagemask * 8192); // (2^12-1) | (pagemask_lsb << 12) | (pagemask << 13)  
                     var pa_mask = pagemask_n_lsb + (pagemask_n << 1) + 1040384; // (0b1111111 << 13) | pagemask_n << 1 | pagemask_n_lsb 
                     var pfn = (dataEntry >>> 5) & pa_mask;
                     var pa = (pfn << 12) | (addr & offset_mask); 
                     //DEBUG("pfn: " + pfn.toString(16) + ", pa: " + pa.toString(16));
                     return pa;
                }
           }

       }

        this.cpu.entryHiReg.VPN2 = vpn2;
        this.cpu.C0Registers[4].BadVPN2 = vpn2; 
        this.cpu.C0Registers[8].putUInt32(addr);

        // TLB refill exception
        if(write == 1)
        {
            this.cpu.triggerException(11,3); // excCode = TLBS
        }
        else
        {
            this.cpu.triggerException(11,2); // excCode = TLBL
        }

        INFO("TLB miss! va: " + addr.toString(16));
        throw 1337;
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
            else if((top3 == 0x6) & (this.cpu.statusRegister.ERL == 1))
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
        //if(address >= 0xbfd00000)
        //{
        //    INFO("IO Reg readHalfWord: " + address.toString(16));
        //    return 0;
        //}
		return this.physicalMemory.getUInt16BE(this.addressTranslation(address,0));
	}
	
    this.writeHalfWord = function(address, val)
    {
        //if(address >= 0xbfd00000)
        //{
        //    INFO("IO Reg writeHalfWord: " + address.toString(16) + ", val: " + val.toString(16));
        //    return;
        // }
        this.physicalMemory.putUInt16BE(this.addressTranslation(address,1), val);
    }	

    this.readByte = function(address)
    {
        //if(address >= 0xbfd00000)
        //{
        //    INFO("IO Reg readByte: " + address.toString(16));
        //    return 0;
        //}
        return this.physicalMemory.getByte(this.addressTranslation(address,0));
    }

    this.writeByte = function(address, val)
    {
        //if(address >= 0xbfd00000)
        //{
        //    INFO("IO Reg writeByte: " + address.toString(16) + ", val: " + val.toString(16));
        //    return;
        //}

        this.physicalMemory.putByte(this.addressTranslation(address,1), val);
    }
	
	this.readWord = function(address)
	{
        //if(address >= 0xbfd00000)
        //{
        //    INFO("IO Reg readWord: " + address.toString(16));
        //    return 0;
        //}
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
        //if(address >= 0xbfd00000)
        //{
        //    INFO("IO Reg writeWord: " + address.toString(16) + ", val: " + val.toString(16));
        //    return;
        //}
        //console.log("VA: " + address.toString(16));
        var addr = this.addressTranslation(address,1);
        //console.log("PA: " + addr.toString(16));
		if(this.cpu.getEndianness() == 0)
		{
			return this.physicalMemory.putUInt32LE(addr, value >>> 0);
		}
		else
		{
			return this.physicalMemory.putUInt32BE(addr, value >>> 0);
		}	
	}

    this.loadSREC = function(srecString, setEntry)
    {
        var srecLines = srecString.split("\n");

        for(i = 0; i < srecLines.length; i++)
        {
            if(srecLines[i] == "")
            {
                continue;
            }

            var l = srecLines[i];
            l = l.replace("\r","");
            var t = l[1];

            if(l[0] != 'S')
            {
                ERROR("Invalid srec record!");
            }

            var count = l.substring(2,4);
            var addr = "";
            var data = "";
            var dataEnd = l.length-2;

            if(t == '0')
            {
                //DEBUG("Ignoring SREC header");
            } 
            else if(t == '1')
            {
                addr = l.substring(4,8);
                data = l.substring(8, dataEnd);  
                //DEBUG("data 1 srec " + addr + " " + data);
            }
            else if(t == '2')
            {
                addr = l.substring(4,10);
                data = l.substring(10, dataEnd);
                //DEBUG("data 2 srec " + addr + " " + data);
            }
            else if(t == '3')
            {
                addr = l.substring(4,12);
                data = l.substring(12, dataEnd);
                //DEBUG("data 3 srec " + addr + " " + data);
            }
            else if(t == '5')
            {
                //DEBUG("Ignoring SREC record count field.");
            }
            else if((t == '7') | (t == '8') | (t == '9'))
            {
                count = parseInt(count,16)*2 -2;
                addr = l.substring(4,4+count);
                DEBUG("Entry point srec: " + addr);
                
                if(setEntry == 1)
                {
                    this.cpu.PC.putUInt32(parseInt(addr,16));
                }
            }
            else
            {
                ERROR("Unknown SREC type: " + t);
                return;
            }

            if((t == '1') | (t == '2') | (t == '3'))
            {
                if((data.length % 2) != 0)
                {
                    ERROR("Length of data in SREC record is not valid: " + data.length);
                }
                
                addr = parseInt(addr, 16);
                
                for(j = 0; j < data.length; j+= 2)
                {
                   var dataByteStr = data.substring(j,j+2);
                   var b = parseInt(dataByteStr,16);
                   var offset = j/2;
                   this.writeByte(addr + offset, b); 
                }
            }
        }
    }
}
