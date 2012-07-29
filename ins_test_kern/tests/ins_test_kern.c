
void print(char *);

void TNEI(){
    print("TNEI unimplemented\n");
}

void WAIT(){
    print("TNE unimplemented\n");
}

void XOR() {

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
    TNEI();
    WAIT();
    XOR();
    XORI();
    return 0;
}
