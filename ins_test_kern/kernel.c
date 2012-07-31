
int main();


char* itoa(unsigned int val, int base){
	
	static char buf[32] = {0};
	
	int i = 30;
	
	if(val == 0){
	    buf[31] = '0';
	    return &buf[31];
	}
	
	for(; val && i ; --i, val /= base)
	
		buf[i] = "0123456789abcdef"[val % base];
	
	return &buf[i+1];
	
}


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



