#include <stdint.h>
 


void print(char * s){
    
    asm("move $a0,%0\n"
        "li $v0 , 4\n"
        "syscall\n"
        : 
        : "r" (s)
        : "v0", "a0" );
    
}




void ieq (int x, int y, int ok)
{
  if ((x<=y) && (x>=y))
    {
      if (!ok) { print("compare test failed!\n"); return; }
    }
  else
    if (ok) { print("compare test failed!\n"); return; }

  if ((x<=y) && (x==y))
    {
      if (!ok) { print("compare test failed!\n"); return; }
    }
  else
    if (ok) { print("compare test failed!\n"); return; }

  if ((x<=y) && (y<=x))
    {
      if (!ok) { print("compare test failed!\n"); return; }
    }
  else
    if (ok) { print("compare test failed!\n"); return; }

  if ((y==x) && (x<=y))
    {
      if (!ok) { print("compare test failed!\n"); return; }
    }
  else
    if (ok) { print("compare test failed!\n"); return; }
}

void ine (int x, int y, int ok)
{
  if ((x<y) || (x>y))
    {
      if (!ok) { print("compare test failed!\n"); return; }
    }
  else
    if (ok) { print("compare test failed!\n"); return; }
}

void ilt (int x, int y, int ok)
{
  if ((x<y) && (x!=y))
    {
      if (!ok) { print("compare test failed!\n"); return; }
    }
  else
    if (ok) { print("compare test failed!\n"); return; }
}

void ile (int x, int y, int ok)
{
  if ((x<y) || (x==y))
    {
      if (!ok) { print("compare test failed!\n"); return; }
    }
  else
    if (ok) { print("compare test failed!\n"); return; }
}

void igt (int x, int y, int ok)
{
  if ((x>y) && (x!=y))
    {
      if (!ok) { print("compare test failed!\n"); return; }
    }
  else
    if (ok) { print("compare test failed!\n"); return; }
}

void ige (int x, int y, int ok)
{
  if ((x>y) || (x==y))
    {
      if (!ok) { print("compare test failed!\n"); return; }
    }
  else
    if (ok) { print("compare test failed!\n"); return; }
}

void
compare_test ()
{
  ieq (1, 4, 0);
  ieq (3, 3, 1);
  ieq (5, 2, 0);

  ine (1, 4, 1);
  ine (3, 3, 0);
  ine (5, 2, 1);

  ilt (1, 4, 1);
  ilt (3, 3, 0);
  ilt (5, 2, 0);

  ile (1, 4, 1);
  ile (3, 3, 1);
  ile (5, 2, 0);

  igt (1, 4, 0);
  igt (3, 3, 0);
  igt (5, 2, 1);

  ige (1, 4, 0);
  ige (3, 3, 1);
  ige (5, 2, 1);

}





int a[] =
{
  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39
};

int
f (long n)
{
  return a[n - 100000];
}

void index() {
  if (f (100030L) != 30)
    print("index test failed!\n");
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
    print("completed euler1.\n");
    recursion();
    print("completed recursion.\n");
    twiddle();
    print("completed twiddle\n");
    index();
    print("index test completed\n");
    compare_test();
    print("compare test completed\n");
    

    forever_a_loop:
    goto forever_a_loop;
}



