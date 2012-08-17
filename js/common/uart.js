
function UART_16550()
{
    this.uartRegisters = new Array(8);
    this.baseAddr = 0x1f000900;
    this.endAddr = 0x1f000900 + 0x38;
    this.interruptId = 0;

    for(i = 0; i < 9; i++)
    {
        this.uartRegisters[i] = new GeneralRegister();
    }

    this.getReg = function(addr,write)
    {
        var offset = (addr - this.baseAddr);

        switch(offset)
        {
            case 0x0:
                if(write)
                {
                    return this.uartRegisters[1];
                } 
                else
                {
                    return this.uartRegisters[0];
                }
                break;

            case 0x8:
                return this.uartRegisters[2];
            
            case 0x10:
                if(write)
                {
                    return this.uartRegisters[3];
                }
                else
                {
                    // TODO lazily evaluate interrupt identification from convenience variable this.interruptId
                    return 0;
                }

            case 0x18:
                return this.uartRegisters[4];
            
            case 0x20:
                return this.uartRegisters[5];

            case 0x28:
                return this.uartRegisters[6]; 

            case 0x30:
                return this.uartRegisters[7];

            case 0x38:
                return this.uartRegisters[8];

            default:
                //INFO("Access to invalid UART register address: " + addr.toString(16));
                return undefined;
        }
    }

    this.readByte = function(addr)
    {
        var offset = addr - this.baseAddr;
        // LSTAT
        if(offset == 0x5)
        {
            // THRE & TEMT are set
            return (1 << 5) | (1 << 6); 
        }
        else
        {
            var reg = this.getReg(addr,0);
            if(reg == undefined)
            {
                return 0;
            }
            else
            {
                return reg.asUInt32();
            }
        }
    }

    this.writeByte = function(addr,val)
    {
        var offset = addr - this.baseAddr;
        if(offset == 0x0)
        {
            this.cpu.emu.serialLine.writeToConsole(String.fromCharCode(val));
        }
        else
        {
            var reg = this.getReg(addr,1);
            if(reg != undefined)
            {
                reg.putUInt32(val);
            }
        }
    }

    this.readWord = function(addr)
    {
        return this.readByte(addr+3) +
               this.readByte(addr+2) * 256 +
               this.readByte(addr+1) * 65536 +
               this.readByte(addr)   * 16777216; 
    }

    this.writeWord = function(addr,val)
    {
        var n = addr;
        this.putByte( n+3 , val & 0xff);
        this.putByte( n+2, (val & 0xff00) >>> 8);
        this.putByte( n+1, (val & 0xff0000) >>> 16);
        this.putByte( n+0, (val & 0xff000000) >>> 24);
    }

    this.checkInterrupts = function()
    {
        // todo
        return;
    }
}
