
int main();


void print(char * s){
    
    asm("move $a0,%0\n"
        "li $v0 , 4\n"
        "syscall\n"
        : 
        : "r" (s)
        : "v0", "a0" );
    
}


void fail() {
    print("test failed!\n");
}

void pass(){
     print("test passed!\n");
     while(1) ;
}


void kmain(void)
{

    if( main() != 0 ){
        fail();
    }
    
    pass();
}



