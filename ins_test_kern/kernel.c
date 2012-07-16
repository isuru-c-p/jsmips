#include <stdint.h>
 
int foo (int x) {

    if (x > 0)
        return 4;
    else
        return 0;

}
 
void kmain(void)
{
    forever_a_loop:
    
    foo(5);
    
    goto forever_a_loop;
}



