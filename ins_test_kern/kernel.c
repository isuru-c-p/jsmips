#include <stdint.h>
 


void print(char * s){
    
    asm("move $a0,%0\n"
        "li $v0 , 4\n"
        "syscall\n"
        : 
        : "r" (s)
        : "v0", "a0" );
    
}



void euler1()
{
    int i = 0;
    int sum = 0;
    for(i = 1; i < 1000; i++){
        if(i % 3 == 0 || i % 5 == 0)
            sum += i;
    }
    
    if(sum != 233168){
        print("failed euler 1\n");
    }
    
}


int fib(int n){
    if(n == 1){
        return 1;
    }
    if(n < 0){
        return 0;
    }
    
    return fib(n-1) + fib(n-2);
}

void recursion() {
    if( fib(11) != 89 ){
        print("recursion test failed\n");
    }
}
 
void twiddle() {
    int i = 1; // XXX this one might be done by a tricky compiler, maybe needs -O0

    i = i << 3;
    
    i = i >> 1;
    
    i |= 0x1000;
    
    i = ~i ^ 5;
    
    i &= 0xffff;
    
    if(i != 61438){
        print("failed twiddle");
    }
}
 

void kmain(void)
{

    euler1();
    recursion();
    twiddle();

    forever_a_loop:
    goto forever_a_loop;
}



