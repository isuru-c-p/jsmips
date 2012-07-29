
void print(char *);



void TLTU() {
    print("TLTU unimplemented\n");
}


void TNE(){
    print("TNE unimplemented\n");
}

void TNEI(){
    print("TNEI unimplemented\n");
}

void WAIT(){
    print("TNE unimplemented\n");
}

void XOR() {

    unsigned int a;
    unsigned int b;
    #define XOR_TEST(A,B,ans) \
    a = A; b = B;\
    asm("xor %0,%1,%2\n" \
    : "=r" (a) \
    : "r" (a) , "r" (b) );\
     if(a != ans){ fail(); }
    XOR_TEST(0xffffffff,0xffff,0xffff0000);
    XOR_TEST(0xffff0000,0xffff,0xffffffff);
    XOR_TEST(0xffff000f,0xffff,0xfffffff0);
    XOR_TEST(0x0,0xffffffff,0xffffffff);
    XOR_TEST(0x0f0f0f0f,0xf0f0f0f0,0xffffffff);


}

void XORI() {
    
    unsigned int a;
    #define XORI_TEST(V,C,ans) \
    a = V;\
    asm("xori %0,%1,"C"\n" \
    : "=r" (a) \
    : "r" (a) );\
     if(a != ans){ fail(); }
    XORI_TEST(0xffffffff,"0xffff",0xffff0000);
    XORI_TEST(0xffff0000,"0xffff",0xffffffff);
    XORI_TEST(0xffff000f,"0xffff",0xfffffff0);
}



int
main ()
{
    TLTU();
    TNE();
    TNEI();
    WAIT();
    XOR();
    XORI();
    return 0;
}
