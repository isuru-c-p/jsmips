


void writeEntryHi(int vpn2, int asid)
{
    int entryHiVal = ((vpn2 << 13) & 0x7ffff) | (asid & 0xff);
    asm("mtc0 %0, $10"
        : 
        : "r" (entryHiVal)
        : 
    );
    return;
}

void writeEntryLo(int type, int pfn, int c, int d, int g, int v)
{
    int entryLoVal = ((pfn & 0xfffff) << 6) | ((c & 0x7) << 3) | ((d & 0x1) << 2) | ((v & 0x1) << 1) | (g & 0x1);
   
    if(type == 0)
    { 
        asm("mtc0 %0, $2"
            :
            : "r" (entryLoVal)
            :
           );
    }
    else if(type == 1)
    {
        asm("mtc0 %0, $3"
            :
            : "r" (entryLoVal)
            :
           );
    } 
    else
    {
        print("Error, invalid entryLo type.");
    }
    return;
}

void writeTLBIndex(int index)
{
    asm("mtc0 %0, $0"
        :
        : "r" (index)
        :
        );
    return;
}

void writeTLBWithIndex()
{
   asm("tlbwi"
       :
       : 
       :
       );
}

void setupTLB()
{
    // setupTLB with a single index
    writeTLBIndex(0);
    writeEntryHi(1,1);
    writeEntryLo(0, 0, 0, 1, 0, 1);
    writeTLBWithIndex(); 
}


int main()
{
    // tlb is setup 
    setupTLB();

    int* testWriteAddr = 0x00002000;
    (*testWriteAddr) = 2;
    int* testReadAddr = 0xA0000000;
    
    if((*testWriteAddr) != 2)
    {
        print("Test write addr invalid value!");
    }
    else
    {
        print("Test write addr value valid!");
    }
    
    if((*testReadAddr) != 2)
    {
        return 1;
    }    

    return 0;
}

