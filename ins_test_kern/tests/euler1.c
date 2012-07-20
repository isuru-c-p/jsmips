

int main()
{
    int i = 0;
    int sum = 0;
    for(i = 1; i < 1000; i++){
        if(i % 3 == 0 || i % 5 == 0)
            sum += i;
    }
    
    if(sum != 233168){
        return 1;
    }
    
    return 0;
}

