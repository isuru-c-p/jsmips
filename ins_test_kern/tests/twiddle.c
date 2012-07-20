


int main() {
    int i = 1; // XXX this one might be done by a tricky compiler, maybe needs -O0

    i = i << 3;
    
    i = i >> 1;
    
    i |= 0x1000;
    
    i = ~i ^ 5;
    
    i &= 0xffff;
    
    if(i != 61438){
        return 1;
    }
    
    return 0;
}
 
