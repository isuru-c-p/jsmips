
int main();


void print(char * s){
    
    asm("move $a0,%0\n"
        "li $v0 , 4\n"
        "syscall\n"
        : 
        : "r" (s)
        : "v0", "a0", "memory" );
    
}


void fail() {
    print("test failed!\n");
    asm(
    "li $v0 , 6\n"
    "syscall\n"
    : 
    : 
    : "v0" );
    
}

void pass(){
    print("test passed!\n");
    asm(
    "li $v0 , 5\n"
    "syscall\n"
    : 
    : 
    : "v0" );
}

void abort(){
    fail();
}

void exit(int val){
    if(val)
        fail();
    pass();
}

void kmain(void)
{

    if( main() != 0 ){
        fail();
    }
    
    pass();
}



