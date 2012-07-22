#include "stdio.h"

int
main ()
{
    int sum = 0;
    int a = 1;
    int b = 2;
    int c = 0;
    
    while(1){
    
        c = a+b;
        a=b;
        b=c;
    
        if(a > 4000000)
            break;
            
        if(a % 2 == 0){
            sum += a;
        }
    
    }
    
    
    if(sum != 4613732)
        return 1;
    
    return 0;
}
