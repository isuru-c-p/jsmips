
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
    //TODO
}


unsigned int * terminate = (unsigned int *)0x80000000;

void fail() {
    print("test failed!\n");
    *terminate = 1;    
}

void pass(){
    print("test passed!\n");
    *terminate = 0;
}

void abort(){
    fail();
}

void exit(int val){
    *terminate = val;
}

void kmain(void)
{

    if( main() != 0 ){
        fail();
    }
    
    pass();
}



