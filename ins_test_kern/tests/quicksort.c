 
  int partition(int y[], int f, int l) {
     int up,down,temp;
     int piv = y[f];
     up = f;
     down = l;
     goto partLS;
     do { 
         temp = y[up];
         y[up] = y[down];
         y[down] = temp;
     partLS:
         while (y[up] <= piv && up < l) {
             up++;
         }
         while (y[down] > piv  && down > f ) {
             down--;
         }
     } while (down > up);
     y[f] = y[down];
     y[down] = piv;
     return down;
 }
 
 void quicksort(int x[], int first, int last) {
     int pivIndex = 0;
     if(first < last) {
         pivIndex = partition(x,first, last);
         quicksort(x,first,(pivIndex-1));
         quicksort(x,(pivIndex+1),last);
     }
 }
 

 
 int
 main ()
 {
     int numbers[] = {5,4,6,7,0,3,2,1};
     quicksort(numbers,0,7);
     int i;
     for(i = 0; i < 8; i++){
        if(numbers[i] != i){
            return 1;
        }
     }
     return 0;
 }
