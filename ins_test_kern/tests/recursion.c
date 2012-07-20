

int fib(int n){
    if(n == 1){
        return 1;
    }
    if(n < 0){
        return 0;
    }
    
    return fib(n-1) + fib(n-2);
}

int main() {
    if( fib(11) != 89 ){
        return 1;
    }
    
    return 0;
}
