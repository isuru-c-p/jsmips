
#include "stdint.h"

#define N 600851475143

int isPrime(int n){

    if(n == 1)
        return 0;
    if(n == 2)
        return 0;
        
    if(n%2 == 0)
        return 0;
        
    int i;
    int end = n >> 1;
    for(i = 3; i < end ; i+= 2){
        if(n % i == 0 ){
            return 0;
        }
    }
    
    return 1;

}

int
main ()
{
    int i;
    int max = 0;
    for(i = 1 ; i < 775146 ; i+= 2){
        if(3 % i == 0){
            if(isPrime(i)){
                max = i;
            }
        }
    }
    
    if(max != 6857)
        return 1;
    
    return 0;
}
