/* performs the uni version of des using bitslice */
/* each uint64_t represents a single bit so  */
/* the calc is actually 64 in parallel      */

#include <stdint.h>

void
desencrypt (
	uint64_t	*c, /*out*/
	const uint64_t	*p,
	const uint64_t	*k
);

void
desdecrypt (
	uint64_t	*c, /*out*/
	const uint64_t	*p,
	const uint64_t	*k
);

void * memset(void * s, int c , int n) {
    int i;
    char * p = (char*)s;
    
    for(i = 0; i < n; i++)
        p[i] = c;
    return s;
}


/* converts a block of 64*8 chars into bits ready for the */
/* start of the algorithm. out needs to be 64 wide        */

void blockToParBlock(uint64_t * out ,char * strings){
    int i,j;
    uint64_t val;    
    memset(out,0,sizeof(uint64_t)*64);
    for(i=0;i<64;i++){ /*loop once for each string*/
        val = *(uint64_t*)&(strings[i*8]);
        for(j=0;j<64;j++){ /*loop once for each bit*/
            uint64_t curBit = val&0x8000000000000000; /*extact left bit*/
            curBit >>= i; /*each string as a position*/
            out[j] |= curBit; /*write the bit to output*/
            val <<= 1; /*set next bit*/
        }
    }
}


static inline
uint64_t getBit(int b, uint64_t x){
    return  (((uint64_t)x)&(((uint64_t)1)<<(64-b))) > 0;
}


void valToParBlock(uint64_t * out ,uint64_t val){
    int i;    
    for(i=0;i<64;i++){ /*loop once for each bit*/
        out[i] =  getBit(i+1,val) ? 0xffffffffffffffff : 0 ;
    }
}

uint64_t parBlockToVal(int pos,uint64_t * block){
    uint64_t ret = 0;
    int i;
    for(i = 0; i < 63 ; i++){ /*loop once for each bit*/
        if(block[i] & ((uint64_t)1 << pos))
            ret += 1;
        ret <<= 1;
    }
    
    if(block[63] & ((uint64_t)1 << pos))
        ret += 1;
    
    return ret;
}




const
uint64_t string_hk1[] = {0x0,0x0,0x0,0x0,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0x0,0xffffffffffffffff,0x0,0x0,0x0,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0x0,0x0,0x0,0xffffffffffffffff,0x0,0x0,0x0,0x0,0xffffffffffffffff,0x0,0x0,0x0,0x0,0x0,0x0,0xffffffffffffffff,0x0,0x0,0xffffffffffffffff,0x0,0x0,0xffffffffffffffff,0x0,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0x0,0x0,0xffffffffffffffff,0xffffffffffffffff,0x0,0xffffffffffffffff,0x0,0x0,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0x0,0x0,0xffffffffffffffff,0xffffffffffffffff,0x0,0xffffffffffffffff,0x0};

const
uint64_t string_hk2[] = {0xffffffffffffffff,0x0,0xffffffffffffffff,0x0,0xffffffffffffffff,0x0,0x0,0x0,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0x0,0xffffffffffffffff,0xffffffffffffffff,0x0,0x0,0xffffffffffffffff,0xffffffffffffffff,0x0,0x0,0x0,0x0,0xffffffffffffffff,0xffffffffffffffff,0x0,0xffffffffffffffff,0x0,0xffffffffffffffff,0xffffffffffffffff,0x0,0x0,0xffffffffffffffff,0x0,0x0,0xffffffffffffffff,0xffffffffffffffff,0x0,0x0,0xffffffffffffffff,0xffffffffffffffff,0x0,0x0,0x0,0xffffffffffffffff,0x0,0xffffffffffffffff,0x0,0x0,0xffffffffffffffff,0x0,0x0,0xffffffffffffffff,0x0,0xffffffffffffffff,0x0,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0xffffffffffffffff,0x0,0x0,0x0,0xffffffffffffffff,0x0};


/* convert 64 par strings to 64 blocks */
void stringToKeys(uint64_t * block, uint64_t * strings){
    
    int j;
    //printf("%llx\n",parBlockToVal(0,&strings[0]));
    
    uint64_t k1[64];
    uint64_t k2[64];
    
    memset(&k1,0,sizeof(k1));
    memset(&k2,0,sizeof(k2));
    
    for(j=7;j >=0;j--){
        k1[j*8 + 0] |= strings[j*8    ]; k2[j*8    ] |= strings[j*8 + 0];
        k1[j*8 + 1] |= strings[j*8 + 1]; k2[j*8 + 1] |= strings[j*8 + 1];
        k1[j*8 + 2] |= strings[j*8 + 2]; k2[j*8 + 2] |= strings[j*8 + 2];
        k1[j*8 + 3] |= strings[j*8 + 3]; k2[j*8 + 3] |= strings[j*8 + 3];
        k1[j*8 + 4] |= strings[j*8 + 4]; k2[j*8 + 4] |= strings[j*8 + 4];
        k1[j*8 + 5] |= strings[j*8 + 5]; k2[j*8 + 5] |= strings[j*8 + 5];
        k1[j*8 + 6] |= strings[j*8 + 6]; k2[j*8 + 6] |= strings[j*8 + 6];
        k1[j*8 + 7] |= strings[j*8 + 7]; k2[j*8 + 7] |= strings[j*8 + 7];
        
        //printf("%llx\n",parBlockToVal(0,&k1[0]));
        //printf("%llx\n",parBlockToVal(0,&k2[0]));
        
        desencrypt(&k1[0],(const uint64_t *)&k1[0],&string_hk1[0]);
        desencrypt(&k2[0],(const uint64_t *)&k2[0],&string_hk2[0]);
    }
    
    //printf("\n\n");

    for(j=0;j<64;j++){
        block[j] = k1[j] ^ k2[j];
    }
}


/*x cannot equal y*/
static inline
void xorSwap (uint64_t *x, uint64_t *y) {
         *x ^= *y;
         *y ^= *x;
         *x ^= *y;
 }


static inline
void parNtohl(uint64_t * x){
    
    xorSwap(&x[0] , &x[24]);
    xorSwap(&x[1] , &x[25]);
    xorSwap(&x[2] , &x[26]);
    xorSwap(&x[3] , &x[27]);
    xorSwap(&x[4] , &x[28]);
    xorSwap(&x[5] , &x[29]);
    xorSwap(&x[6] , &x[30]);
    xorSwap(&x[7] , &x[31]);
    
    xorSwap(&x[8] , &x[16]);
    xorSwap(&x[9] , &x[17]);
    xorSwap(&x[10] , &x[18]);
    xorSwap(&x[11] , &x[19]);
    xorSwap(&x[12] , &x[20]);
    xorSwap(&x[13] , &x[21]);
    xorSwap(&x[14] , &x[22]);
    xorSwap(&x[15] , &x[23]);
    

}

static inline
void binaryAdder(uint64_t a,uint64_t b,uint64_t cin, uint64_t * s , uint64_t * cout){

    uint64_t intermed;
    intermed = a^b;
    *s = intermed^cin;
    *cout = (intermed&cin)|(a&b);
}

/*adds one to 64 64 bit integers, where each bit is in parallel msb at pos 0*/
void addOne(uint64_t * v){
    uint64_t c = 0;
    uint64_t a = 0xffffffffffffffff;
    uint64_t b;
    int i;
    for(i=31, b=v[31] ;i>=0;i--){
        binaryAdder(a,b,c,&v[i],&c);
        a = 0;
        b= v[i-1];
    }

}


uint64_t hashCheck(uint64_t * passwords, uint64_t d ){
    
    uint64_t keys[64];
    uint64_t stringsPar[64];
    uint64_t dataPar[64];
    
    uint64_t dec[64];
    uint64_t nulls[64];
    
    memset(&nulls[0],0,sizeof(nulls));
    memset(&stringsPar[0],0,sizeof(stringsPar));
    
    valToParBlock(&dataPar[0],d);
    blockToParBlock(&stringsPar[0],(char *)passwords);
    stringToKeys(&keys[0],&stringsPar[0]);

    //printf("pd  %llx\n",d);
    //printf("pk  %llx\n",parBlockToVal(63,&keys[0]));    

    desdecrypt(&nulls[0],&nulls[0],&keys[0]);
    desdecrypt(&dec[0],&dataPar[0],&keys[0]);
    
    //printf("pn  %llx\n",parBlockToVal(63,&nulls[0]));
    
    parNtohl(&nulls[32]);
    
    //printf("pn  %llx\n",parBlockToVal(63,&nulls[0]));
    
    parNtohl(&dec[32]);
    
    //printf("pdec  %llx\n",parBlockToVal(63,&dec[0]));
    
    //printf("pn %llx\n",parBlockToVal(63,&nulls[0]));
    //printf("%llx\n",parBlockToVal(0,&dec[0]));
    
    addOne(&nulls[32]);
    
    //printf("pnfinal  %llx\n",parBlockToVal(63,&nulls[0]));
    
    uint64_t result = 0xffffffffffffffff;
    
    int i;
    for(i = 32; i < 64;i++){
        result &= ~(dec[i]^nulls[i]);
    }
    
    return result;
}






/*
 * Generated S-box files.
 *
 * This software may be modified, redistributed, and used for any purpose,
 * so long as its origin is acknowledged.
 *
 * Produced by Matthew Kwan - March 1998
 */


static void
s1 (
	uint64_t	a1,
	uint64_t	a2,
	uint64_t	a3,
	uint64_t	a4,
	uint64_t	a5,
	uint64_t	a6,
	uint64_t	*out1,
	uint64_t	*out2,
	uint64_t	*out3,
	uint64_t	*out4
) {
	uint64_t	x1, x2, x3, x4, x5, x6, x7, x8;
	uint64_t	x9, x10, x11, x12, x13, x14, x15, x16;
	uint64_t	x17, x18, x19, x20, x21, x22, x23, x24;
	uint64_t	x25, x26, x27, x28, x29, x30, x31, x32;
	uint64_t	x33, x34, x35, x36, x37, x38, x39, x40;
	uint64_t	x41, x42, x43, x44, x45, x46, x47, x48;
	uint64_t	x49, x50, x51, x52, x53, x54, x55, x56;
	uint64_t	x57, x58, x59, x60, x61, x62, x63;

	x1 = ~a4;
	x2 = ~a1;
	x3 = a4 ^ a3;
	x4 = x3 ^ x2;
	x5 = a3 | x2;
	x6 = x5 & x1;
	x7 = a6 | x6;
	x8 = x4 ^ x7;
	x9 = x1 | x2;
	x10 = a6 & x9;
	x11 = x7 ^ x10;
	x12 = a2 | x11;
	x13 = x8 ^ x12;
	x14 = x9 ^ x13;
	x15 = a6 | x14;
	x16 = x1 ^ x15;
	x17 = ~x14;
	x18 = x17 & x3;
	x19 = a2 | x18;
	x20 = x16 ^ x19;
	x21 = a5 | x20;
	x22 = x13 ^ x21;
	*out4 ^= x22;
	x23 = a3 | x4;
	x24 = ~x23;
	x25 = a6 | x24;
	x26 = x6 ^ x25;
	x27 = x1 & x8;
	x28 = a2 | x27;
	x29 = x26 ^ x28;
	x30 = x1 | x8;
	x31 = x30 ^ x6;
	x32 = x5 & x14;
	x33 = x32 ^ x8;
	x34 = a2 & x33;
	x35 = x31 ^ x34;
	x36 = a5 | x35;
	x37 = x29 ^ x36;
	*out1 ^= x37;
	x38 = a3 & x10;
	x39 = x38 | x4;
	x40 = a3 & x33;
	x41 = x40 ^ x25;
	x42 = a2 | x41;
	x43 = x39 ^ x42;
	x44 = a3 | x26;
	x45 = x44 ^ x14;
	x46 = a1 | x8;
	x47 = x46 ^ x20;
	x48 = a2 | x47;
	x49 = x45 ^ x48;
	x50 = a5 & x49;
	x51 = x43 ^ x50;
	*out2 ^= x51;
	x52 = x8 ^ x40;
	x53 = a3 ^ x11;
	x54 = x53 & x5;
	x55 = a2 | x54;
	x56 = x52 ^ x55;
	x57 = a6 | x4;
	x58 = x57 ^ x38;
	x59 = x13 & x56;
	x60 = a2 & x59;
	x61 = x58 ^ x60;
	x62 = a5 & x61;
	x63 = x56 ^ x62;
	*out3 ^= x63;
}


static void
s2 (
	uint64_t	a1,
	uint64_t	a2,
	uint64_t	a3,
	uint64_t	a4,
	uint64_t	a5,
	uint64_t	a6,
	uint64_t	*out1,
	uint64_t	*out2,
	uint64_t	*out3,
	uint64_t	*out4
) {
	uint64_t	x1, x2, x3, x4, x5, x6, x7, x8;
	uint64_t	x9, x10, x11, x12, x13, x14, x15, x16;
	uint64_t	x17, x18, x19, x20, x21, x22, x23, x24;
	uint64_t	x25, x26, x27, x28, x29, x30, x31, x32;
	uint64_t	x33, x34, x35, x36, x37, x38, x39, x40;
	uint64_t	x41, x42, x43, x44, x45, x46, x47, x48;
	uint64_t	x49, x50, x51, x52, x53, x54, x55, x56;

	x1 = ~a5;
	x2 = ~a1;
	x3 = a5 ^ a6;
	x4 = x3 ^ x2;
	x5 = x4 ^ a2;
	x6 = a6 | x1;
	x7 = x6 | x2;
	x8 = a2 & x7;
	x9 = a6 ^ x8;
	x10 = a3 & x9;
	x11 = x5 ^ x10;
	x12 = a2 & x9;
	x13 = a5 ^ x6;
	x14 = a3 | x13;
	x15 = x12 ^ x14;
	x16 = a4 & x15;
	x17 = x11 ^ x16;
	*out2 ^= x17;
	x18 = a5 | a1;
	x19 = a6 | x18;
	x20 = x13 ^ x19;
	x21 = x20 ^ a2;
	x22 = a6 | x4;
	x23 = x22 & x17;
	x24 = a3 | x23;
	x25 = x21 ^ x24;
	x26 = a6 | x2;
	x27 = a5 & x2;
	x28 = a2 | x27;
	x29 = x26 ^ x28;
	x30 = x3 ^ x27;
	x31 = x2 ^ x19;
	x32 = a2 & x31;
	x33 = x30 ^ x32;
	x34 = a3 & x33;
	x35 = x29 ^ x34;
	x36 = a4 | x35;
	x37 = x25 ^ x36;
	*out3 ^= x37;
	x38 = x21 & x32;
	x39 = x38 ^ x5;
	x40 = a1 | x15;
	x41 = x40 ^ x13;
	x42 = a3 | x41;
	x43 = x39 ^ x42;
	x44 = x28 | x41;
	x45 = a4 & x44;
	x46 = x43 ^ x45;
	*out1 ^= x46;
	x47 = x19 & x21;
	x48 = x47 ^ x26;
	x49 = a2 & x33;
	x50 = x49 ^ x21;
	x51 = a3 & x50;
	x52 = x48 ^ x51;
	x53 = x18 & x28;
	x54 = x53 & x50;
	x55 = a4 | x54;
	x56 = x52 ^ x55;
	*out4 ^= x56;
}


static void
s3 (
	uint64_t	a1,
	uint64_t	a2,
	uint64_t	a3,
	uint64_t	a4,
	uint64_t	a5,
	uint64_t	a6,
	uint64_t	*out1,
	uint64_t	*out2,
	uint64_t	*out3,
	uint64_t	*out4
) {
	uint64_t	x1, x2, x3, x4, x5, x6, x7, x8;
	uint64_t	x9, x10, x11, x12, x13, x14, x15, x16;
	uint64_t	x17, x18, x19, x20, x21, x22, x23, x24;
	uint64_t	x25, x26, x27, x28, x29, x30, x31, x32;
	uint64_t	x33, x34, x35, x36, x37, x38, x39, x40;
	uint64_t	x41, x42, x43, x44, x45, x46, x47, x48;
	uint64_t	x49, x50, x51, x52, x53, x54, x55, x56;
	uint64_t	x57;

	x1 = ~a5;
	x2 = ~a6;
	x3 = a5 & a3;
	x4 = x3 ^ a6;
	x5 = a4 & x1;
	x6 = x4 ^ x5;
	x7 = x6 ^ a2;
	x8 = a3 & x1;
	x9 = a5 ^ x2;
	x10 = a4 | x9;
	x11 = x8 ^ x10;
	x12 = x7 & x11;
	x13 = a5 ^ x11;
	x14 = x13 | x7;
	x15 = a4 & x14;
	x16 = x12 ^ x15;
	x17 = a2 & x16;
	x18 = x11 ^ x17;
	x19 = a1 & x18;
	x20 = x7 ^ x19;
	*out4 ^= x20;
	x21 = a3 ^ a4;
	x22 = x21 ^ x9;
	x23 = x2 | x4;
	x24 = x23 ^ x8;
	x25 = a2 | x24;
	x26 = x22 ^ x25;
	x27 = a6 ^ x23;
	x28 = x27 | a4;
	x29 = a3 ^ x15;
	x30 = x29 | x5;
	x31 = a2 | x30;
	x32 = x28 ^ x31;
	x33 = a1 | x32;
	x34 = x26 ^ x33;
	*out1 ^= x34;
	x35 = a3 ^ x9;
	x36 = x35 | x5;
	x37 = x4 | x29;
	x38 = x37 ^ a4;
	x39 = a2 | x38;
	x40 = x36 ^ x39;
	x41 = a6 & x11;
	x42 = x41 | x6;
	x43 = x34 ^ x38;
	x44 = x43 ^ x41;
	x45 = a2 & x44;
	x46 = x42 ^ x45;
	x47 = a1 | x46;
	x48 = x40 ^ x47;
	*out3 ^= x48;
	x49 = x2 | x38;
	x50 = x49 ^ x13;
	x51 = x27 ^ x28;
	x52 = a2 | x51;
	x53 = x50 ^ x52;
	x54 = x12 & x23;
	x55 = x54 & x52;
	x56 = a1 | x55;
	x57 = x53 ^ x56;
	*out2 ^= x57;
}


static void
s4 (
	uint64_t	a1,
	uint64_t	a2,
	uint64_t	a3,
	uint64_t	a4,
	uint64_t	a5,
	uint64_t	a6,
	uint64_t	*out1,
	uint64_t	*out2,
	uint64_t	*out3,
	uint64_t	*out4
) {
	uint64_t	x1, x2, x3, x4, x5, x6, x7, x8;
	uint64_t	x9, x10, x11, x12, x13, x14, x15, x16;
	uint64_t	x17, x18, x19, x20, x21, x22, x23, x24;
	uint64_t	x25, x26, x27, x28, x29, x30, x31, x32;
	uint64_t	x33, x34, x35, x36, x37, x38, x39, x40;
	uint64_t	x41, x42;

	x1 = ~a1;
	x2 = ~a3;
	x3 = a1 | a3;
	x4 = a5 & x3;
	x5 = x1 ^ x4;
	x6 = a2 | a3;
	x7 = x5 ^ x6;
	x8 = a1 & a5;
	x9 = x8 ^ x3;
	x10 = a2 & x9;
	x11 = a5 ^ x10;
	x12 = a4 & x11;
	x13 = x7 ^ x12;
	x14 = x2 ^ x4;
	x15 = a2 & x14;
	x16 = x9 ^ x15;
	x17 = x5 & x14;
	x18 = a5 ^ x2;
	x19 = a2 | x18;
	x20 = x17 ^ x19;
	x21 = a4 | x20;
	x22 = x16 ^ x21;
	x23 = a6 & x22;
	x24 = x13 ^ x23;
	*out2 ^= x24;
	x25 = ~x13;
	x26 = a6 | x22;
	x27 = x25 ^ x26;
	*out1 ^= x27;
	x28 = a2 & x11;
	x29 = x28 ^ x17;
	x30 = a3 ^ x10;
	x31 = x30 ^ x19;
	x32 = a4 & x31;
	x33 = x29 ^ x32;
	x34 = x25 ^ x33;
	x35 = a2 & x34;
	x36 = x24 ^ x35;
	x37 = a4 | x34;
	x38 = x36 ^ x37;
	x39 = a6 & x38;
	x40 = x33 ^ x39;
	*out4 ^= x40;
	x41 = x26 ^ x38;
	x42 = x41 ^ x40;
	*out3 ^= x42;
}


static void
s5 (
	uint64_t	a1,
	uint64_t	a2,
	uint64_t	a3,
	uint64_t	a4,
	uint64_t	a5,
	uint64_t	a6,
	uint64_t	*out1,
	uint64_t	*out2,
	uint64_t	*out3,
	uint64_t	*out4
) {
	uint64_t	x1, x2, x3, x4, x5, x6, x7, x8;
	uint64_t	x9, x10, x11, x12, x13, x14, x15, x16;
	uint64_t	x17, x18, x19, x20, x21, x22, x23, x24;
	uint64_t	x25, x26, x27, x28, x29, x30, x31, x32;
	uint64_t	x33, x34, x35, x36, x37, x38, x39, x40;
	uint64_t	x41, x42, x43, x44, x45, x46, x47, x48;
	uint64_t	x49, x50, x51, x52, x53, x54, x55, x56;
	uint64_t	x57, x58, x59, x60, x61, x62;

	x1 = ~a6;
	x2 = ~a3;
	x3 = x1 | x2;
	x4 = x3 ^ a4;
	x5 = a1 & x3;
	x6 = x4 ^ x5;
	x7 = a6 | a4;
	x8 = x7 ^ a3;
	x9 = a3 | x7;
	x10 = a1 | x9;
	x11 = x8 ^ x10;
	x12 = a5 & x11;
	x13 = x6 ^ x12;
	x14 = ~x4;
	x15 = x14 & a6;
	x16 = a1 | x15;
	x17 = x8 ^ x16;
	x18 = a5 | x17;
	x19 = x10 ^ x18;
	x20 = a2 | x19;
	x21 = x13 ^ x20;
	*out3 ^= x21;
	x22 = x2 | x15;
	x23 = x22 ^ a6;
	x24 = a4 ^ x22;
	x25 = a1 & x24;
	x26 = x23 ^ x25;
	x27 = a1 ^ x11;
	x28 = x27 & x22;
	x29 = a5 | x28;
	x30 = x26 ^ x29;
	x31 = a4 | x27;
	x32 = ~x31;
	x33 = a2 | x32;
	x34 = x30 ^ x33;
	*out2 ^= x34;
	x35 = x2 ^ x15;
	x36 = a1 & x35;
	x37 = x14 ^ x36;
	x38 = x5 ^ x7;
	x39 = x38 & x34;
	x40 = a5 | x39;
	x41 = x37 ^ x40;
	x42 = x2 ^ x5;
	x43 = x42 & x16;
	x44 = x4 & x27;
	x45 = a5 & x44;
	x46 = x43 ^ x45;
	x47 = a2 | x46;
	x48 = x41 ^ x47;
	*out1 ^= x48;
	x49 = x24 & x48;
	x50 = x49 ^ x5;
	x51 = x11 ^ x30;
	x52 = x51 | x50;
	x53 = a5 & x52;
	x54 = x50 ^ x53;
	x55 = x14 ^ x19;
	x56 = x55 ^ x34;
	x57 = x4 ^ x16;
	x58 = x57 & x30;
	x59 = a5 & x58;
	x60 = x56 ^ x59;
	x61 = a2 | x60;
	x62 = x54 ^ x61;
	*out4 ^= x62;
}


static void
s6 (
	uint64_t	a1,
	uint64_t	a2,
	uint64_t	a3,
	uint64_t	a4,
	uint64_t	a5,
	uint64_t	a6,
	uint64_t	*out1,
	uint64_t	*out2,
	uint64_t	*out3,
	uint64_t	*out4
) {
	uint64_t	x1, x2, x3, x4, x5, x6, x7, x8;
	uint64_t	x9, x10, x11, x12, x13, x14, x15, x16;
	uint64_t	x17, x18, x19, x20, x21, x22, x23, x24;
	uint64_t	x25, x26, x27, x28, x29, x30, x31, x32;
	uint64_t	x33, x34, x35, x36, x37, x38, x39, x40;
	uint64_t	x41, x42, x43, x44, x45, x46, x47, x48;
	uint64_t	x49, x50, x51, x52, x53, x54, x55, x56;
	uint64_t	x57;

	x1 = ~a2;
	x2 = ~a5;
	x3 = a2 ^ a6;
	x4 = x3 ^ x2;
	x5 = x4 ^ a1;
	x6 = a5 & a6;
	x7 = x6 | x1;
	x8 = a5 & x5;
	x9 = a1 & x8;
	x10 = x7 ^ x9;
	x11 = a4 & x10;
	x12 = x5 ^ x11;
	x13 = a6 ^ x10;
	x14 = x13 & a1;
	x15 = a2 & a6;
	x16 = x15 ^ a5;
	x17 = a1 & x16;
	x18 = x2 ^ x17;
	x19 = a4 | x18;
	x20 = x14 ^ x19;
	x21 = a3 & x20;
	x22 = x12 ^ x21;
	*out2 ^= x22;
	x23 = a6 ^ x18;
	x24 = a1 & x23;
	x25 = a5 ^ x24;
	x26 = a2 ^ x17;
	x27 = x26 | x6;
	x28 = a4 & x27;
	x29 = x25 ^ x28;
	x30 = ~x26;
	x31 = a6 | x29;
	x32 = ~x31;
	x33 = a4 & x32;
	x34 = x30 ^ x33;
	x35 = a3 & x34;
	x36 = x29 ^ x35;
	*out4 ^= x36;
	x37 = x6 ^ x34;
	x38 = a5 & x23;
	x39 = x38 ^ x5;
	x40 = a4 | x39;
	x41 = x37 ^ x40;
	x42 = x16 | x24;
	x43 = x42 ^ x1;
	x44 = x15 ^ x24;
	x45 = x44 ^ x31;
	x46 = a4 | x45;
	x47 = x43 ^ x46;
	x48 = a3 | x47;
	x49 = x41 ^ x48;
	*out1 ^= x49;
	x50 = x5 | x38;
	x51 = x50 ^ x6;
	x52 = x8 & x31;
	x53 = a4 | x52;
	x54 = x51 ^ x53;
	x55 = x30 & x43;
	x56 = a3 | x55;
	x57 = x54 ^ x56;
	*out3 ^= x57;
}


static void
s7 (
	uint64_t	a1,
	uint64_t	a2,
	uint64_t	a3,
	uint64_t	a4,
	uint64_t	a5,
	uint64_t	a6,
	uint64_t	*out1,
	uint64_t	*out2,
	uint64_t	*out3,
	uint64_t	*out4
) {
	uint64_t	x1, x2, x3, x4, x5, x6, x7, x8;
	uint64_t	x9, x10, x11, x12, x13, x14, x15, x16;
	uint64_t	x17, x18, x19, x20, x21, x22, x23, x24;
	uint64_t	x25, x26, x27, x28, x29, x30, x31, x32;
	uint64_t	x33, x34, x35, x36, x37, x38, x39, x40;
	uint64_t	x41, x42, x43, x44, x45, x46, x47, x48;
	uint64_t	x49, x50, x51, x52, x53, x54, x55, x56;
	uint64_t	x57;

	x1 = ~a2;
	x2 = ~a5;
	x3 = a2 & a4;
	x4 = x3 ^ a5;
	x5 = x4 ^ a3;
	x6 = a4 & x4;
	x7 = x6 ^ a2;
	x8 = a3 & x7;
	x9 = a1 ^ x8;
	x10 = a6 | x9;
	x11 = x5 ^ x10;
	x12 = a4 & x2;
	x13 = x12 | a2;
	x14 = a2 | x2;
	x15 = a3 & x14;
	x16 = x13 ^ x15;
	x17 = x6 ^ x11;
	x18 = a6 | x17;
	x19 = x16 ^ x18;
	x20 = a1 & x19;
	x21 = x11 ^ x20;
	*out1 ^= x21;
	x22 = a2 | x21;
	x23 = x22 ^ x6;
	x24 = x23 ^ x15;
	x25 = x5 ^ x6;
	x26 = x25 | x12;
	x27 = a6 | x26;
	x28 = x24 ^ x27;
	x29 = x1 & x19;
	x30 = x23 & x26;
	x31 = a6 & x30;
	x32 = x29 ^ x31;
	x33 = a1 | x32;
	x34 = x28 ^ x33;
	*out4 ^= x34;
	x35 = a4 & x16;
	x36 = x35 | x1;
	x37 = a6 & x36;
	x38 = x11 ^ x37;
	x39 = a4 & x13;
	x40 = a3 | x7;
	x41 = x39 ^ x40;
	x42 = x1 | x24;
	x43 = a6 | x42;
	x44 = x41 ^ x43;
	x45 = a1 | x44;
	x46 = x38 ^ x45;
	*out2 ^= x46;
	x47 = x8 ^ x44;
	x48 = x6 ^ x15;
	x49 = a6 | x48;
	x50 = x47 ^ x49;
	x51 = x19 ^ x44;
	x52 = a4 ^ x25;
	x53 = x52 & x46;
	x54 = a6 & x53;
	x55 = x51 ^ x54;
	x56 = a1 | x55;
	x57 = x50 ^ x56;
	*out3 ^= x57;
}


static void
s8 (
	uint64_t	a1,
	uint64_t	a2,
	uint64_t	a3,
	uint64_t	a4,
	uint64_t	a5,
	uint64_t	a6,
	uint64_t	*out1,
	uint64_t	*out2,
	uint64_t	*out3,
	uint64_t	*out4
) {
	uint64_t	x1, x2, x3, x4, x5, x6, x7, x8;
	uint64_t	x9, x10, x11, x12, x13, x14, x15, x16;
	uint64_t	x17, x18, x19, x20, x21, x22, x23, x24;
	uint64_t	x25, x26, x27, x28, x29, x30, x31, x32;
	uint64_t	x33, x34, x35, x36, x37, x38, x39, x40;
	uint64_t	x41, x42, x43, x44, x45, x46, x47, x48;
	uint64_t	x49, x50, x51, x52, x53, x54;

	x1 = ~a1;
	x2 = ~a4;
	x3 = a3 ^ x1;
	x4 = a3 | x1;
	x5 = x4 ^ x2;
	x6 = a5 | x5;
	x7 = x3 ^ x6;
	x8 = x1 | x5;
	x9 = x2 ^ x8;
	x10 = a5 & x9;
	x11 = x8 ^ x10;
	x12 = a2 & x11;
	x13 = x7 ^ x12;
	x14 = x6 ^ x9;
	x15 = x3 & x9;
	x16 = a5 & x8;
	x17 = x15 ^ x16;
	x18 = a2 | x17;
	x19 = x14 ^ x18;
	x20 = a6 | x19;
	x21 = x13 ^ x20;
	*out1 ^= x21;
	x22 = a5 | x3;
	x23 = x22 & x2;
	x24 = ~a3;
	x25 = x24 & x8;
	x26 = a5 & x4;
	x27 = x25 ^ x26;
	x28 = a2 | x27;
	x29 = x23 ^ x28;
	x30 = a6 & x29;
	x31 = x13 ^ x30;
	*out4 ^= x31;
	x32 = x5 ^ x6;
	x33 = x32 ^ x22;
	x34 = a4 | x13;
	x35 = a2 & x34;
	x36 = x33 ^ x35;
	x37 = a1 & x33;
	x38 = x37 ^ x8;
	x39 = a1 ^ x23;
	x40 = x39 & x7;
	x41 = a2 & x40;
	x42 = x38 ^ x41;
	x43 = a6 | x42;
	x44 = x36 ^ x43;
	*out3 ^= x44;
	x45 = a1 ^ x10;
	x46 = x45 ^ x22;
	x47 = ~x7;
	x48 = x47 & x8;
	x49 = a2 | x48;
	x50 = x46 ^ x49;
	x51 = x19 ^ x29;
	x52 = x51 | x38;
	x53 = a6 & x52;
	x54 = x50 ^ x53;
	*out2 ^= x54;
}

/*
 * Bitslice implementation of DES.
 *
 * Checks that the plaintext bits p[0] .. p[63]
 * encrypt to the ciphertext bits c[0] .. c[63]
 * given the key bits k[0 ] .. k[55]
 */



/* encrypt p with k into c */
/* p,k,c all 64 wide       */
/* c can equal p           */

void
desencrypt (
	uint64_t	*c, /*out*/
	const uint64_t	*p,
	const uint64_t	*k
) {

	uint64_t	l0 = p[6];
	uint64_t	l1 = p[14];
	uint64_t	l2 = p[22];
	uint64_t	l3 = p[30];
	uint64_t	l4 = p[38];
	uint64_t	l5 = p[46];
	uint64_t	l6 = p[54];
	uint64_t	l7 = p[62];
	uint64_t	l8 = p[4];
	uint64_t	l9 = p[12];
	uint64_t	l10 = p[20];
	uint64_t	l11 = p[28];
	uint64_t	l12 = p[36];
	uint64_t	l13 = p[44];
	uint64_t	l14 = p[52];
	uint64_t	l15 = p[60];
	uint64_t	l16 = p[2];
	uint64_t	l17 = p[10];
	uint64_t	l18 = p[18];
	uint64_t	l19 = p[26];
	uint64_t	l20 = p[34];
	uint64_t	l21 = p[42];
	uint64_t	l22 = p[50];
	uint64_t	l23 = p[58];
	uint64_t	l24 = p[0];
	uint64_t	l25 = p[8];
	uint64_t	l26 = p[16];
	uint64_t	l27 = p[24];
	uint64_t	l28 = p[32];
	uint64_t	l29 = p[40];
	uint64_t	l30 = p[48];
	uint64_t	l31 = p[56];
	uint64_t	r0 = p[7];
	uint64_t	r1 = p[15];
	uint64_t	r2 = p[23];
	uint64_t	r3 = p[31];
	uint64_t	r4 = p[39];
	uint64_t	r5 = p[47];
	uint64_t	r6 = p[55];
	uint64_t	r7 = p[63];
	uint64_t	r8 = p[5];
	uint64_t	r9 = p[13];
	uint64_t	r10 = p[21];
	uint64_t	r11 = p[29];
	uint64_t	r12 = p[37];
	uint64_t	r13 = p[45];
	uint64_t	r14 = p[53];
	uint64_t	r15 = p[61];
	uint64_t	r16 = p[3];
	uint64_t	r17 = p[11];
	uint64_t	r18 = p[19];
	uint64_t	r19 = p[27];
	uint64_t	r20 = p[35];
	uint64_t	r21 = p[43];
	uint64_t	r22 = p[51];
	uint64_t	r23 = p[59];
	uint64_t	r24 = p[1];
	uint64_t	r25 = p[9];
	uint64_t	r26 = p[17];
	uint64_t	r27 = p[25];
	uint64_t	r28 = p[33];
	uint64_t	r29 = p[41];
	uint64_t	r30 = p[49];
	uint64_t	r31 = p[57];

	s1 (r31 ^ k[54], r0 ^ k[13], r1 ^ k[30], r2 ^ k[4 ], r3 ^ k[15],r4 ^ k[47], &l8, &l16, &l22, &l30);s2 (r3 ^ k[31], r4 ^ k[7 ], r5 ^ k[62], r6 ^ k[55], r7 ^ k[45],r8 ^ k[22], &l12, &l27, &l1, &l17);s3 (r7 ^ k[61], r8 ^ k[29], r9 ^ k[38], r10 ^ k[39], r11 ^ k[20],r12 ^ k[6 ], &l23, &l15, &l29, &l5);s4 (r11 ^ k[5 ], r12 ^ k[63], r13 ^ k[28], r14 ^ k[37], r15 ^ k[46],r16 ^ k[23], &l25, &l19, &l9, &l0);s5 (r15 ^ k[42], r16 ^ k[36], r17 ^ k[25], r18 ^ k[10], r19 ^ k[27],r20 ^ k[60], &l7, &l13, &l24, &l2);s6 (r19 ^ k[17], r20 ^ k[34], r21 ^ k[59], r22 ^ k[11], r23 ^ k[41],r24 ^ k[35], &l3, &l28, &l10, &l18);s7 (r23 ^ k[3 ], r24 ^ k[43], r25 ^ k[26], r26 ^ k[1 ], r27 ^ k[49],r28 ^ k[44], &l31, &l11, &l21, &l6);s8 (r27 ^ k[19], r28 ^ k[50], r29 ^ k[51], r30 ^ k[2 ], r31 ^ k[9 ],r0 ^ k[33], &l4, &l26, &l14, &l20);
	s1 (l31 ^ k[62], l0 ^ k[21], l1 ^ k[38], l2 ^ k[12], l3 ^ k[23],l4 ^ k[55], &r8, &r16, &r22, &r30);s2 (l3 ^ k[39], l4 ^ k[15], l5 ^ k[5 ], l6 ^ k[63], l7 ^ k[53],l8 ^ k[30], &r12, &r27, &r1, &r17);s3 (l7 ^ k[4 ], l8 ^ k[37], l9 ^ k[46], l10 ^ k[47], l11 ^ k[28],l12 ^ k[14], &r23, &r15, &r29, &r5);s4 (l11 ^ k[13], l12 ^ k[6 ], l13 ^ k[7 ], l14 ^ k[45], l15 ^ k[54],l16 ^ k[31], &r25, &r19, &r9, &r0);s5 (l15 ^ k[50], l16 ^ k[44], l17 ^ k[33], l18 ^ k[18], l19 ^ k[35],l20 ^ k[1 ], &r7, &r13, &r24, &r2);s6 (l19 ^ k[25], l20 ^ k[42], l21 ^ k[36], l22 ^ k[19], l23 ^ k[49],l24 ^ k[43], &r3, &r28, &r10, &r18);s7 (l23 ^ k[11], l24 ^ k[51], l25 ^ k[34], l26 ^ k[9 ], l27 ^ k[57],l28 ^ k[52], &r31, &r11, &r21, &r6);s8 (l27 ^ k[27], l28 ^ k[58], l29 ^ k[59], l30 ^ k[10], l31 ^ k[17],l0 ^ k[41], &r4, &r26, &r14, &r20);
	s1 (r31 ^ k[13], r0 ^ k[37], r1 ^ k[54], r2 ^ k[28], r3 ^ k[39],r4 ^ k[6 ], &l8, &l16, &l22, &l30);s2 (r3 ^ k[55], r4 ^ k[31], r5 ^ k[21], r6 ^ k[14], r7 ^ k[4 ],r8 ^ k[46], &l12, &l27, &l1, &l17);s3 (r7 ^ k[20], r8 ^ k[53], r9 ^ k[62], r10 ^ k[63], r11 ^ k[15],r12 ^ k[30], &l23, &l15, &l29, &l5);s4 (r11 ^ k[29], r12 ^ k[22], r13 ^ k[23], r14 ^ k[61], r15 ^ k[5 ],r16 ^ k[47], &l25, &l19, &l9, &l0);s5 (r15 ^ k[3 ], r16 ^ k[60], r17 ^ k[49], r18 ^ k[34], r19 ^ k[51],r20 ^ k[17], &l7, &l13, &l24, &l2);s6 (r19 ^ k[41], r20 ^ k[58], r21 ^ k[52], r22 ^ k[35], r23 ^ k[2 ],r24 ^ k[59], &l3, &l28, &l10, &l18);s7 (r23 ^ k[27], r24 ^ k[36], r25 ^ k[50], r26 ^ k[25], r27 ^ k[10],r28 ^ k[1 ], &l31, &l11, &l21, &l6);s8 (r27 ^ k[43], r28 ^ k[11], r29 ^ k[44], r30 ^ k[26], r31 ^ k[33],r0 ^ k[57], &l4, &l26, &l14, &l20);
	s1 (l31 ^ k[29], l0 ^ k[53], l1 ^ k[5 ], l2 ^ k[15], l3 ^ k[55],l4 ^ k[22], &r8, &r16, &r22, &r30);s2 (l3 ^ k[6 ], l4 ^ k[47], l5 ^ k[37], l6 ^ k[30], l7 ^ k[20],l8 ^ k[62], &r12, &r27, &r1, &r17);s3 (l7 ^ k[7 ], l8 ^ k[4 ], l9 ^ k[13], l10 ^ k[14], l11 ^ k[31],l12 ^ k[46], &r23, &r15, &r29, &r5);s4 (l11 ^ k[45], l12 ^ k[38], l13 ^ k[39], l14 ^ k[12], l15 ^ k[21],l16 ^ k[63], &r25, &r19, &r9, &r0);s5 (l15 ^ k[19], l16 ^ k[9 ], l17 ^ k[2 ], l18 ^ k[50], l19 ^ k[36],l20 ^ k[33], &r7, &r13, &r24, &r2);s6 (l19 ^ k[57], l20 ^ k[11], l21 ^ k[1 ], l22 ^ k[51], l23 ^ k[18],l24 ^ k[44], &r3, &r28, &r10, &r18);s7 (l23 ^ k[43], l24 ^ k[52], l25 ^ k[3 ], l26 ^ k[41], l27 ^ k[26],l28 ^ k[17], &r31, &r11, &r21, &r6);s8 (l27 ^ k[59], l28 ^ k[27], l29 ^ k[60], l30 ^ k[42], l31 ^ k[49],l0 ^ k[10], &r4, &r26, &r14, &r20);
	s1 (r31 ^ k[45], r0 ^ k[4 ], r1 ^ k[21], r2 ^ k[31], r3 ^ k[6 ],r4 ^ k[38], &l8, &l16, &l22, &l30);s2 (r3 ^ k[22], r4 ^ k[63], r5 ^ k[53], r6 ^ k[46], r7 ^ k[7 ],r8 ^ k[13], &l12, &l27, &l1, &l17);s3 (r7 ^ k[23], r8 ^ k[20], r9 ^ k[29], r10 ^ k[30], r11 ^ k[47],r12 ^ k[62], &l23, &l15, &l29, &l5);s4 (r11 ^ k[61], r12 ^ k[54], r13 ^ k[55], r14 ^ k[28], r15 ^ k[37],r16 ^ k[14], &l25, &l19, &l9, &l0);s5 (r15 ^ k[35], r16 ^ k[25], r17 ^ k[18], r18 ^ k[3 ], r19 ^ k[52],r20 ^ k[49], &l7, &l13, &l24, &l2);s6 (r19 ^ k[10], r20 ^ k[27], r21 ^ k[17], r22 ^ k[36], r23 ^ k[34],r24 ^ k[60], &l3, &l28, &l10, &l18);s7 (r23 ^ k[59], r24 ^ k[1 ], r25 ^ k[19], r26 ^ k[57], r27 ^ k[42],r28 ^ k[33], &l31, &l11, &l21, &l6);s8 (r27 ^ k[44], r28 ^ k[43], r29 ^ k[9 ], r30 ^ k[58], r31 ^ k[2 ],r0 ^ k[26], &l4, &l26, &l14, &l20);
	s1 (l31 ^ k[61], l0 ^ k[20], l1 ^ k[37], l2 ^ k[47], l3 ^ k[22],l4 ^ k[54], &r8, &r16, &r22, &r30);s2 (l3 ^ k[38], l4 ^ k[14], l5 ^ k[4 ], l6 ^ k[62], l7 ^ k[23],l8 ^ k[29], &r12, &r27, &r1, &r17);s3 (l7 ^ k[39], l8 ^ k[7 ], l9 ^ k[45], l10 ^ k[46], l11 ^ k[63],l12 ^ k[13], &r23, &r15, &r29, &r5);s4 (l11 ^ k[12], l12 ^ k[5 ], l13 ^ k[6 ], l14 ^ k[15], l15 ^ k[53],l16 ^ k[30], &r25, &r19, &r9, &r0);s5 (l15 ^ k[51], l16 ^ k[41], l17 ^ k[34], l18 ^ k[19], l19 ^ k[1 ],l20 ^ k[2 ], &r7, &r13, &r24, &r2);s6 (l19 ^ k[26], l20 ^ k[43], l21 ^ k[33], l22 ^ k[52], l23 ^ k[50],l24 ^ k[9 ], &r3, &r28, &r10, &r18);s7 (l23 ^ k[44], l24 ^ k[17], l25 ^ k[35], l26 ^ k[10], l27 ^ k[58],l28 ^ k[49], &r31, &r11, &r21, &r6);s8 (l27 ^ k[60], l28 ^ k[59], l29 ^ k[25], l30 ^ k[11], l31 ^ k[18],l0 ^ k[42], &r4, &r26, &r14, &r20);
	s1 (r31 ^ k[12], r0 ^ k[7 ], r1 ^ k[53], r2 ^ k[63], r3 ^ k[38],r4 ^ k[5 ], &l8, &l16, &l22, &l30);s2 (r3 ^ k[54], r4 ^ k[30], r5 ^ k[20], r6 ^ k[13], r7 ^ k[39],r8 ^ k[45], &l12, &l27, &l1, &l17);s3 (r7 ^ k[55], r8 ^ k[23], r9 ^ k[61], r10 ^ k[62], r11 ^ k[14],r12 ^ k[29], &l23, &l15, &l29, &l5);s4 (r11 ^ k[28], r12 ^ k[21], r13 ^ k[22], r14 ^ k[31], r15 ^ k[4 ],r16 ^ k[46], &l25, &l19, &l9, &l0);s5 (r15 ^ k[36], r16 ^ k[57], r17 ^ k[50], r18 ^ k[35], r19 ^ k[17],r20 ^ k[18], &l7, &l13, &l24, &l2);s6 (r19 ^ k[42], r20 ^ k[59], r21 ^ k[49], r22 ^ k[1 ], r23 ^ k[3 ],r24 ^ k[25], &l3, &l28, &l10, &l18);s7 (r23 ^ k[60], r24 ^ k[33], r25 ^ k[51], r26 ^ k[26], r27 ^ k[11],r28 ^ k[2 ], &l31, &l11, &l21, &l6);s8 (r27 ^ k[9 ], r28 ^ k[44], r29 ^ k[41], r30 ^ k[27], r31 ^ k[34],r0 ^ k[58], &l4, &l26, &l14, &l20);
	s1 (l31 ^ k[28], l0 ^ k[23], l1 ^ k[4 ], l2 ^ k[14], l3 ^ k[54],l4 ^ k[21], &r8, &r16, &r22, &r30);s2 (l3 ^ k[5 ], l4 ^ k[46], l5 ^ k[7 ], l6 ^ k[29], l7 ^ k[55],l8 ^ k[61], &r12, &r27, &r1, &r17);s3 (l7 ^ k[6 ], l8 ^ k[39], l9 ^ k[12], l10 ^ k[13], l11 ^ k[30],l12 ^ k[45], &r23, &r15, &r29, &r5);s4 (l11 ^ k[15], l12 ^ k[37], l13 ^ k[38], l14 ^ k[47], l15 ^ k[20],l16 ^ k[62], &r25, &r19, &r9, &r0);s5 (l15 ^ k[52], l16 ^ k[10], l17 ^ k[3 ], l18 ^ k[51], l19 ^ k[33],l20 ^ k[34], &r7, &r13, &r24, &r2);s6 (l19 ^ k[58], l20 ^ k[44], l21 ^ k[2 ], l22 ^ k[17], l23 ^ k[19],l24 ^ k[41], &r3, &r28, &r10, &r18);s7 (l23 ^ k[9 ], l24 ^ k[49], l25 ^ k[36], l26 ^ k[42], l27 ^ k[27],l28 ^ k[18], &r31, &r11, &r21, &r6);s8 (l27 ^ k[25], l28 ^ k[60], l29 ^ k[57], l30 ^ k[43], l31 ^ k[50],l0 ^ k[11], &r4, &r26, &r14, &r20);
	s1 (r31 ^ k[7 ], r0 ^ k[31], r1 ^ k[12], r2 ^ k[22], r3 ^ k[62],r4 ^ k[29], &l8, &l16, &l22, &l30);s2 (r3 ^ k[13], r4 ^ k[54], r5 ^ k[15], r6 ^ k[37], r7 ^ k[63],r8 ^ k[4 ], &l12, &l27, &l1, &l17);s3 (r7 ^ k[14], r8 ^ k[47], r9 ^ k[20], r10 ^ k[21], r11 ^ k[38],r12 ^ k[53], &l23, &l15, &l29, &l5);s4 (r11 ^ k[23], r12 ^ k[45], r13 ^ k[46], r14 ^ k[55], r15 ^ k[28],r16 ^ k[5 ], &l25, &l19, &l9, &l0);s5 (r15 ^ k[60], r16 ^ k[18], r17 ^ k[11], r18 ^ k[59], r19 ^ k[41],r20 ^ k[42], &l7, &l13, &l24, &l2);s6 (r19 ^ k[3 ], r20 ^ k[52], r21 ^ k[10], r22 ^ k[25], r23 ^ k[27],r24 ^ k[49], &l3, &l28, &l10, &l18);s7 (r23 ^ k[17], r24 ^ k[57], r25 ^ k[44], r26 ^ k[50], r27 ^ k[35],r28 ^ k[26], &l31, &l11, &l21, &l6);s8 (r27 ^ k[33], r28 ^ k[1 ], r29 ^ k[2 ], r30 ^ k[51], r31 ^ k[58],r0 ^ k[19], &l4, &l26, &l14, &l20);
	s1 (l31 ^ k[23], l0 ^ k[47], l1 ^ k[28], l2 ^ k[38], l3 ^ k[13],l4 ^ k[45], &r8, &r16, &r22, &r30);s2 (l3 ^ k[29], l4 ^ k[5 ], l5 ^ k[31], l6 ^ k[53], l7 ^ k[14],l8 ^ k[20], &r12, &r27, &r1, &r17);s3 (l7 ^ k[30], l8 ^ k[63], l9 ^ k[7 ], l10 ^ k[37], l11 ^ k[54],l12 ^ k[4 ], &r23, &r15, &r29, &r5);s4 (l11 ^ k[39], l12 ^ k[61], l13 ^ k[62], l14 ^ k[6 ], l15 ^ k[15],l16 ^ k[21], &r25, &r19, &r9, &r0);s5 (l15 ^ k[9 ], l16 ^ k[34], l17 ^ k[27], l18 ^ k[44], l19 ^ k[57],l20 ^ k[58], &r7, &r13, &r24, &r2);s6 (l19 ^ k[19], l20 ^ k[1 ], l21 ^ k[26], l22 ^ k[41], l23 ^ k[43],l24 ^ k[2 ], &r3, &r28, &r10, &r18);s7 (l23 ^ k[33], l24 ^ k[10], l25 ^ k[60], l26 ^ k[3 ], l27 ^ k[51],l28 ^ k[42], &r31, &r11, &r21, &r6);s8 (l27 ^ k[49], l28 ^ k[17], l29 ^ k[18], l30 ^ k[36], l31 ^ k[11],l0 ^ k[35], &r4, &r26, &r14, &r20);
	s1 (r31 ^ k[39], r0 ^ k[63], r1 ^ k[15], r2 ^ k[54], r3 ^ k[29],r4 ^ k[61], &l8, &l16, &l22, &l30);s2 (r3 ^ k[45], r4 ^ k[21], r5 ^ k[47], r6 ^ k[4 ], r7 ^ k[30],r8 ^ k[7 ], &l12, &l27, &l1, &l17);s3 (r7 ^ k[46], r8 ^ k[14], r9 ^ k[23], r10 ^ k[53], r11 ^ k[5 ],r12 ^ k[20], &l23, &l15, &l29, &l5);s4 (r11 ^ k[55], r12 ^ k[12], r13 ^ k[13], r14 ^ k[22], r15 ^ k[31],r16 ^ k[37], &l25, &l19, &l9, &l0);s5 (r15 ^ k[25], r16 ^ k[50], r17 ^ k[43], r18 ^ k[60], r19 ^ k[10],r20 ^ k[11], &l7, &l13, &l24, &l2);s6 (r19 ^ k[35], r20 ^ k[17], r21 ^ k[42], r22 ^ k[57], r23 ^ k[59],r24 ^ k[18], &l3, &l28, &l10, &l18);s7 (r23 ^ k[49], r24 ^ k[26], r25 ^ k[9 ], r26 ^ k[19], r27 ^ k[36],r28 ^ k[58], &l31, &l11, &l21, &l6);s8 (r27 ^ k[2 ], r28 ^ k[33], r29 ^ k[34], r30 ^ k[52], r31 ^ k[27],r0 ^ k[51], &l4, &l26, &l14, &l20);
	s1 (l31 ^ k[55], l0 ^ k[14], l1 ^ k[31], l2 ^ k[5 ], l3 ^ k[45],l4 ^ k[12], &r8, &r16, &r22, &r30);s2 (l3 ^ k[61], l4 ^ k[37], l5 ^ k[63], l6 ^ k[20], l7 ^ k[46],l8 ^ k[23], &r12, &r27, &r1, &r17);s3 (l7 ^ k[62], l8 ^ k[30], l9 ^ k[39], l10 ^ k[4 ], l11 ^ k[21],l12 ^ k[7 ], &r23, &r15, &r29, &r5);s4 (l11 ^ k[6 ], l12 ^ k[28], l13 ^ k[29], l14 ^ k[38], l15 ^ k[47],l16 ^ k[53], &r25, &r19, &r9, &r0);s5 (l15 ^ k[41], l16 ^ k[3 ], l17 ^ k[59], l18 ^ k[9 ], l19 ^ k[26],l20 ^ k[27], &r7, &r13, &r24, &r2);s6 (l19 ^ k[51], l20 ^ k[33], l21 ^ k[58], l22 ^ k[10], l23 ^ k[44],l24 ^ k[34], &r3, &r28, &r10, &r18);s7 (l23 ^ k[2 ], l24 ^ k[42], l25 ^ k[25], l26 ^ k[35], l27 ^ k[52],l28 ^ k[11], &r31, &r11, &r21, &r6);s8 (l27 ^ k[18], l28 ^ k[49], l29 ^ k[50], l30 ^ k[1 ], l31 ^ k[43],l0 ^ k[36], &r4, &r26, &r14, &r20);
	s1 (r31 ^ k[6 ], r0 ^ k[30], r1 ^ k[47], r2 ^ k[21], r3 ^ k[61],r4 ^ k[28], &l8, &l16, &l22, &l30);s2 (r3 ^ k[12], r4 ^ k[53], r5 ^ k[14], r6 ^ k[7 ], r7 ^ k[62],r8 ^ k[39], &l12, &l27, &l1, &l17);s3 (r7 ^ k[13], r8 ^ k[46], r9 ^ k[55], r10 ^ k[20], r11 ^ k[37],r12 ^ k[23], &l23, &l15, &l29, &l5);s4 (r11 ^ k[22], r12 ^ k[15], r13 ^ k[45], r14 ^ k[54], r15 ^ k[63],r16 ^ k[4 ], &l25, &l19, &l9, &l0);s5 (r15 ^ k[57], r16 ^ k[19], r17 ^ k[44], r18 ^ k[25], r19 ^ k[42],r20 ^ k[43], &l7, &l13, &l24, &l2);s6 (r19 ^ k[36], r20 ^ k[49], r21 ^ k[11], r22 ^ k[26], r23 ^ k[60],r24 ^ k[50], &l3, &l28, &l10, &l18);s7 (r23 ^ k[18], r24 ^ k[58], r25 ^ k[41], r26 ^ k[51], r27 ^ k[1 ],r28 ^ k[27], &l31, &l11, &l21, &l6);s8 (r27 ^ k[34], r28 ^ k[2 ], r29 ^ k[3 ], r30 ^ k[17], r31 ^ k[59],r0 ^ k[52], &l4, &l26, &l14, &l20);
	s1 (l31 ^ k[22], l0 ^ k[46], l1 ^ k[63], l2 ^ k[37], l3 ^ k[12],l4 ^ k[15], &r8, &r16, &r22, &r30);s2 (l3 ^ k[28], l4 ^ k[4 ], l5 ^ k[30], l6 ^ k[23], l7 ^ k[13],l8 ^ k[55], &r12, &r27, &r1, &r17);s3 (l7 ^ k[29], l8 ^ k[62], l9 ^ k[6 ], l10 ^ k[7 ], l11 ^ k[53],l12 ^ k[39], &r23, &r15, &r29, &r5);s4 (l11 ^ k[38], l12 ^ k[31], l13 ^ k[61], l14 ^ k[5 ], l15 ^ k[14],l16 ^ k[20], &r25, &r19, &r9, &r0);s5 (l15 ^ k[10], l16 ^ k[35], l17 ^ k[60], l18 ^ k[41], l19 ^ k[58],l20 ^ k[59], &r7, &r13, &r24, &r2);s6 (l19 ^ k[52], l20 ^ k[2 ], l21 ^ k[27], l22 ^ k[42], l23 ^ k[9 ],l24 ^ k[3 ], &r3, &r28, &r10, &r18);s7 (l23 ^ k[34], l24 ^ k[11], l25 ^ k[57], l26 ^ k[36], l27 ^ k[17],l28 ^ k[43], &r31, &r11, &r21, &r6);s8 (l27 ^ k[50], l28 ^ k[18], l29 ^ k[19], l30 ^ k[33], l31 ^ k[44],l0 ^ k[1 ], &r4, &r26, &r14, &r20);
	s1 (r31 ^ k[38], r0 ^ k[62], r1 ^ k[14], r2 ^ k[53], r3 ^ k[28],r4 ^ k[31], &l8, &l16, &l22, &l30);s2 (r3 ^ k[15], r4 ^ k[20], r5 ^ k[46], r6 ^ k[39], r7 ^ k[29],r8 ^ k[6 ], &l12, &l27, &l1, &l17);s3 (r7 ^ k[45], r8 ^ k[13], r9 ^ k[22], r10 ^ k[23], r11 ^ k[4 ],r12 ^ k[55], &l23, &l15, &l29, &l5);s4 (r11 ^ k[54], r12 ^ k[47], r13 ^ k[12], r14 ^ k[21], r15 ^ k[30],r16 ^ k[7 ], &l25, &l19, &l9, &l0);s5 (r15 ^ k[26], r16 ^ k[51], r17 ^ k[9 ], r18 ^ k[57], r19 ^ k[11],r20 ^ k[44], &l7, &l13, &l24, &l2);s6 (r19 ^ k[1 ], r20 ^ k[18], r21 ^ k[43], r22 ^ k[58], r23 ^ k[25],r24 ^ k[19], &l3, &l28, &l10, &l18);s7 (r23 ^ k[50], r24 ^ k[27], r25 ^ k[10], r26 ^ k[52], r27 ^ k[33],r28 ^ k[59], &l31, &l11, &l21, &l6);s8 (r27 ^ k[3 ], r28 ^ k[34], r29 ^ k[35], r30 ^ k[49], r31 ^ k[60],r0 ^ k[17], &l4, &l26, &l14, &l20);
	s1 (l31 ^ k[46], l0 ^ k[5 ], l1 ^ k[22], l2 ^ k[61], l3 ^ k[7 ],l4 ^ k[39], &r8, &r16, &r22, &r30);s2 (l3 ^ k[23], l4 ^ k[28], l5 ^ k[54], l6 ^ k[47], l7 ^ k[37],l8 ^ k[14], &r12, &r27, &r1, &r17);s3 (l7 ^ k[53], l8 ^ k[21], l9 ^ k[30], l10 ^ k[31], l11 ^ k[12],l12 ^ k[63], &r23, &r15, &r29, &r5);s4 (l11 ^ k[62], l12 ^ k[55], l13 ^ k[20], l14 ^ k[29], l15 ^ k[38],l16 ^ k[15], &r25, &r19, &r9, &r0);s5 (l15 ^ k[34], l16 ^ k[59], l17 ^ k[17], l18 ^ k[2 ], l19 ^ k[19],l20 ^ k[52], &r7, &r13, &r24, &r2);s6 (l19 ^ k[9 ], l20 ^ k[26], l21 ^ k[51], l22 ^ k[3 ], l23 ^ k[33],l24 ^ k[27], &r3, &r28, &r10, &r18);s7 (l23 ^ k[58], l24 ^ k[35], l25 ^ k[18], l26 ^ k[60], l27 ^ k[41],l28 ^ k[36], &r31, &r11, &r21, &r6);s8 (l27 ^ k[11], l28 ^ k[42], l29 ^ k[43], l30 ^ k[57], l31 ^ k[1 ],l0 ^ k[25], &r4, &r26, &r14, &r20);

	c[5] = l8;
	c[3] = l16;
	c[51] = l22;
	c[49] = l30;


	c[37] = l12;
	c[25] = l27;
	c[15] = l1;
	c[11] = l17;


	c[59] = l23;
	c[61] = l15;
	c[41] = l29;
	c[47] = l5;


	c[9] = l25;
	c[27] = l19;
	c[13] = l9;
	c[7] = l0;


	c[63] = l7;
	c[45] = l13;
	c[1] = l24;
	c[23] = l2;


	c[31] = l3;
	c[33] = l28;
	c[21] = l10;
	c[19] = l18;


	c[57] = l31;
	c[29] = l11;
	c[43] = l21;
	c[55] = l6;


	c[39] = l4;
	c[17] = l26;
	c[53] = l14;
	c[35] = l20;

	c[4] = r8;
	c[2] = r16;
	c[50] = r22;
	c[48] = r30;

	
	c[36] = r12;
	c[24] = r27;
	c[14] = r1;
	c[10] = r17;


	c[58] = r23;
	c[60] = r15;
	c[40] = r29;
	c[46] = r5;


	c[8] = r25;
	c[26] = r19;
	c[12] = r9;
	c[6] = r0;


	c[62] = r7;
	c[44] = r13;
	c[0] = r24;
	c[22] = r2;


	c[30] = r3;
	c[32] = r28;
	c[20] = r10;
	c[18] = r18;


	c[56] = r31;
	c[28] = r11;
	c[42] = r21;
	c[54] = r6;


	c[38] = r4;
	c[16] = r26;
	c[52] = r14;
	c[34] = r20;


}


/* decrypt p with k into c */
/* p,k,c all 64 wide       */
/* c can equal p           */

void
desdecrypt (
	uint64_t	*c, /*out*/
	const uint64_t	*p,
	const uint64_t	*k
) {

	uint64_t	l0 = p[6];
	uint64_t	l1 = p[14];
	uint64_t	l2 = p[22];
	uint64_t	l3 = p[30];
	uint64_t	l4 = p[38];
	uint64_t	l5 = p[46];
	uint64_t	l6 = p[54];
	uint64_t	l7 = p[62];
	uint64_t	l8 = p[4];
	uint64_t	l9 = p[12];
	uint64_t	l10 = p[20];
	uint64_t	l11 = p[28];
	uint64_t	l12 = p[36];
	uint64_t	l13 = p[44];
	uint64_t	l14 = p[52];
	uint64_t	l15 = p[60];
	uint64_t	l16 = p[2];
	uint64_t	l17 = p[10];
	uint64_t	l18 = p[18];
	uint64_t	l19 = p[26];
	uint64_t	l20 = p[34];
	uint64_t	l21 = p[42];
	uint64_t	l22 = p[50];
	uint64_t	l23 = p[58];
	uint64_t	l24 = p[0];
	uint64_t	l25 = p[8];
	uint64_t	l26 = p[16];
	uint64_t	l27 = p[24];
	uint64_t	l28 = p[32];
	uint64_t	l29 = p[40];
	uint64_t	l30 = p[48];
	uint64_t	l31 = p[56];
	uint64_t	r0 = p[7];
	uint64_t	r1 = p[15];
	uint64_t	r2 = p[23];
	uint64_t	r3 = p[31];
	uint64_t	r4 = p[39];
	uint64_t	r5 = p[47];
	uint64_t	r6 = p[55];
	uint64_t	r7 = p[63];
	uint64_t	r8 = p[5];
	uint64_t	r9 = p[13];
	uint64_t	r10 = p[21];
	uint64_t	r11 = p[29];
	uint64_t	r12 = p[37];
	uint64_t	r13 = p[45];
	uint64_t	r14 = p[53];
	uint64_t	r15 = p[61];
	uint64_t	r16 = p[3];
	uint64_t	r17 = p[11];
	uint64_t	r18 = p[19];
	uint64_t	r19 = p[27];
	uint64_t	r20 = p[35];
	uint64_t	r21 = p[43];
	uint64_t	r22 = p[51];
	uint64_t	r23 = p[59];
	uint64_t	r24 = p[1];
	uint64_t	r25 = p[9];
	uint64_t	r26 = p[17];
	uint64_t	r27 = p[25];
	uint64_t	r28 = p[33];
	uint64_t	r29 = p[41];
	uint64_t	r30 = p[49];
	uint64_t	r31 = p[57];

//decrypt
s1 (r31 ^ k[46], r0 ^ k[5 ], r1 ^ k[22], r2 ^ k[61], r3 ^ k[7 ],r4 ^ k[39], &l8, &l16, &l22, &l30);s2 (r3 ^ k[23], r4 ^ k[28], r5 ^ k[54], r6 ^ k[47], r7 ^ k[37],r8 ^ k[14], &l12, &l27, &l1, &l17);s3 (r7 ^ k[53], r8 ^ k[21], r9 ^ k[30], r10 ^ k[31], r11 ^ k[12],r12 ^ k[63], &l23, &l15, &l29, &l5);s4 (r11 ^ k[62], r12 ^ k[55], r13 ^ k[20], r14 ^ k[29], r15 ^ k[38],r16 ^ k[15], &l25, &l19, &l9, &l0);s5 (r15 ^ k[34], r16 ^ k[59], r17 ^ k[17], r18 ^ k[2 ], r19 ^ k[19],r20 ^ k[52], &l7, &l13, &l24, &l2);s6 (r19 ^ k[9 ], r20 ^ k[26], r21 ^ k[51], r22 ^ k[3 ], r23 ^ k[33],r24 ^ k[27], &l3, &l28, &l10, &l18);s7 (r23 ^ k[58], r24 ^ k[35], r25 ^ k[18], r26 ^ k[60], r27 ^ k[41],r28 ^ k[36], &l31, &l11, &l21, &l6);s8 (r27 ^ k[11], r28 ^ k[42], r29 ^ k[43], r30 ^ k[57], r31 ^ k[1 ],r0 ^ k[25], &l4, &l26, &l14, &l20);
s1 (l31 ^ k[38], l0 ^ k[62], l1 ^ k[14], l2 ^ k[53], l3 ^ k[28],l4 ^ k[31], &r8, &r16, &r22, &r30);s2 (l3 ^ k[15], l4 ^ k[20], l5 ^ k[46], l6 ^ k[39], l7 ^ k[29],l8 ^ k[6 ], &r12, &r27, &r1, &r17);s3 (l7 ^ k[45], l8 ^ k[13], l9 ^ k[22], l10 ^ k[23], l11 ^ k[4 ],l12 ^ k[55], &r23, &r15, &r29, &r5);s4 (l11 ^ k[54], l12 ^ k[47], l13 ^ k[12], l14 ^ k[21], l15 ^ k[30],l16 ^ k[7 ], &r25, &r19, &r9, &r0);s5 (l15 ^ k[26], l16 ^ k[51], l17 ^ k[9 ], l18 ^ k[57], l19 ^ k[11],l20 ^ k[44], &r7, &r13, &r24, &r2);s6 (l19 ^ k[1 ], l20 ^ k[18], l21 ^ k[43], l22 ^ k[58], l23 ^ k[25],l24 ^ k[19], &r3, &r28, &r10, &r18);s7 (l23 ^ k[50], l24 ^ k[27], l25 ^ k[10], l26 ^ k[52], l27 ^ k[33],l28 ^ k[59], &r31, &r11, &r21, &r6);s8 (l27 ^ k[3 ], l28 ^ k[34], l29 ^ k[35], l30 ^ k[49], l31 ^ k[60],l0 ^ k[17], &r4, &r26, &r14, &r20);
s1 (r31 ^ k[22], r0 ^ k[46], r1 ^ k[63], r2 ^ k[37], r3 ^ k[12],r4 ^ k[15], &l8, &l16, &l22, &l30);s2 (r3 ^ k[28], r4 ^ k[4 ], r5 ^ k[30], r6 ^ k[23], r7 ^ k[13],r8 ^ k[55], &l12, &l27, &l1, &l17);s3 (r7 ^ k[29], r8 ^ k[62], r9 ^ k[6 ], r10 ^ k[7 ], r11 ^ k[53],r12 ^ k[39], &l23, &l15, &l29, &l5);s4 (r11 ^ k[38], r12 ^ k[31], r13 ^ k[61], r14 ^ k[5 ], r15 ^ k[14],r16 ^ k[20], &l25, &l19, &l9, &l0);s5 (r15 ^ k[10], r16 ^ k[35], r17 ^ k[60], r18 ^ k[41], r19 ^ k[58],r20 ^ k[59], &l7, &l13, &l24, &l2);s6 (r19 ^ k[52], r20 ^ k[2 ], r21 ^ k[27], r22 ^ k[42], r23 ^ k[9 ],r24 ^ k[3 ], &l3, &l28, &l10, &l18);s7 (r23 ^ k[34], r24 ^ k[11], r25 ^ k[57], r26 ^ k[36], r27 ^ k[17],r28 ^ k[43], &l31, &l11, &l21, &l6);s8 (r27 ^ k[50], r28 ^ k[18], r29 ^ k[19], r30 ^ k[33], r31 ^ k[44],r0 ^ k[1 ], &l4, &l26, &l14, &l20);
s1 (l31 ^ k[6 ], l0 ^ k[30], l1 ^ k[47], l2 ^ k[21], l3 ^ k[61],l4 ^ k[28], &r8, &r16, &r22, &r30);s2 (l3 ^ k[12], l4 ^ k[53], l5 ^ k[14], l6 ^ k[7 ], l7 ^ k[62],l8 ^ k[39], &r12, &r27, &r1, &r17);s3 (l7 ^ k[13], l8 ^ k[46], l9 ^ k[55], l10 ^ k[20], l11 ^ k[37],l12 ^ k[23], &r23, &r15, &r29, &r5);s4 (l11 ^ k[22], l12 ^ k[15], l13 ^ k[45], l14 ^ k[54], l15 ^ k[63],l16 ^ k[4 ], &r25, &r19, &r9, &r0);s5 (l15 ^ k[57], l16 ^ k[19], l17 ^ k[44], l18 ^ k[25], l19 ^ k[42],l20 ^ k[43], &r7, &r13, &r24, &r2);s6 (l19 ^ k[36], l20 ^ k[49], l21 ^ k[11], l22 ^ k[26], l23 ^ k[60],l24 ^ k[50], &r3, &r28, &r10, &r18);s7 (l23 ^ k[18], l24 ^ k[58], l25 ^ k[41], l26 ^ k[51], l27 ^ k[1 ],l28 ^ k[27], &r31, &r11, &r21, &r6);s8 (l27 ^ k[34], l28 ^ k[2 ], l29 ^ k[3 ], l30 ^ k[17], l31 ^ k[59],l0 ^ k[52], &r4, &r26, &r14, &r20);
s1 (r31 ^ k[55], r0 ^ k[14], r1 ^ k[31], r2 ^ k[5 ], r3 ^ k[45],r4 ^ k[12], &l8, &l16, &l22, &l30);s2 (r3 ^ k[61], r4 ^ k[37], r5 ^ k[63], r6 ^ k[20], r7 ^ k[46],r8 ^ k[23], &l12, &l27, &l1, &l17);s3 (r7 ^ k[62], r8 ^ k[30], r9 ^ k[39], r10 ^ k[4 ], r11 ^ k[21],r12 ^ k[7 ], &l23, &l15, &l29, &l5);s4 (r11 ^ k[6 ], r12 ^ k[28], r13 ^ k[29], r14 ^ k[38], r15 ^ k[47],r16 ^ k[53], &l25, &l19, &l9, &l0);s5 (r15 ^ k[41], r16 ^ k[3 ], r17 ^ k[59], r18 ^ k[9 ], r19 ^ k[26],r20 ^ k[27], &l7, &l13, &l24, &l2);s6 (r19 ^ k[51], r20 ^ k[33], r21 ^ k[58], r22 ^ k[10], r23 ^ k[44],r24 ^ k[34], &l3, &l28, &l10, &l18);s7 (r23 ^ k[2 ], r24 ^ k[42], r25 ^ k[25], r26 ^ k[35], r27 ^ k[52],r28 ^ k[11], &l31, &l11, &l21, &l6);s8 (r27 ^ k[18], r28 ^ k[49], r29 ^ k[50], r30 ^ k[1 ], r31 ^ k[43],r0 ^ k[36], &l4, &l26, &l14, &l20);
s1 (l31 ^ k[39], l0 ^ k[63], l1 ^ k[15], l2 ^ k[54], l3 ^ k[29],l4 ^ k[61], &r8, &r16, &r22, &r30);s2 (l3 ^ k[45], l4 ^ k[21], l5 ^ k[47], l6 ^ k[4 ], l7 ^ k[30],l8 ^ k[7 ], &r12, &r27, &r1, &r17);s3 (l7 ^ k[46], l8 ^ k[14], l9 ^ k[23], l10 ^ k[53], l11 ^ k[5 ],l12 ^ k[20], &r23, &r15, &r29, &r5);s4 (l11 ^ k[55], l12 ^ k[12], l13 ^ k[13], l14 ^ k[22], l15 ^ k[31],l16 ^ k[37], &r25, &r19, &r9, &r0);s5 (l15 ^ k[25], l16 ^ k[50], l17 ^ k[43], l18 ^ k[60], l19 ^ k[10],l20 ^ k[11], &r7, &r13, &r24, &r2);s6 (l19 ^ k[35], l20 ^ k[17], l21 ^ k[42], l22 ^ k[57], l23 ^ k[59],l24 ^ k[18], &r3, &r28, &r10, &r18);s7 (l23 ^ k[49], l24 ^ k[26], l25 ^ k[9 ], l26 ^ k[19], l27 ^ k[36],l28 ^ k[58], &r31, &r11, &r21, &r6);s8 (l27 ^ k[2 ], l28 ^ k[33], l29 ^ k[34], l30 ^ k[52], l31 ^ k[27],l0 ^ k[51], &r4, &r26, &r14, &r20);
s1 (r31 ^ k[23], r0 ^ k[47], r1 ^ k[28], r2 ^ k[38], r3 ^ k[13],r4 ^ k[45], &l8, &l16, &l22, &l30);s2 (r3 ^ k[29], r4 ^ k[5 ], r5 ^ k[31], r6 ^ k[53], r7 ^ k[14],r8 ^ k[20], &l12, &l27, &l1, &l17);s3 (r7 ^ k[30], r8 ^ k[63], r9 ^ k[7 ], r10 ^ k[37], r11 ^ k[54],r12 ^ k[4 ], &l23, &l15, &l29, &l5);s4 (r11 ^ k[39], r12 ^ k[61], r13 ^ k[62], r14 ^ k[6 ], r15 ^ k[15],r16 ^ k[21], &l25, &l19, &l9, &l0);s5 (r15 ^ k[9 ], r16 ^ k[34], r17 ^ k[27], r18 ^ k[44], r19 ^ k[57],r20 ^ k[58], &l7, &l13, &l24, &l2);s6 (r19 ^ k[19], r20 ^ k[1 ], r21 ^ k[26], r22 ^ k[41], r23 ^ k[43],r24 ^ k[2 ], &l3, &l28, &l10, &l18);s7 (r23 ^ k[33], r24 ^ k[10], r25 ^ k[60], r26 ^ k[3 ], r27 ^ k[51],r28 ^ k[42], &l31, &l11, &l21, &l6);s8 (r27 ^ k[49], r28 ^ k[17], r29 ^ k[18], r30 ^ k[36], r31 ^ k[11],r0 ^ k[35], &l4, &l26, &l14, &l20);
s1 (l31 ^ k[7 ], l0 ^ k[31], l1 ^ k[12], l2 ^ k[22], l3 ^ k[62],l4 ^ k[29], &r8, &r16, &r22, &r30);s2 (l3 ^ k[13], l4 ^ k[54], l5 ^ k[15], l6 ^ k[37], l7 ^ k[63],l8 ^ k[4 ], &r12, &r27, &r1, &r17);s3 (l7 ^ k[14], l8 ^ k[47], l9 ^ k[20], l10 ^ k[21], l11 ^ k[38],l12 ^ k[53], &r23, &r15, &r29, &r5);s4 (l11 ^ k[23], l12 ^ k[45], l13 ^ k[46], l14 ^ k[55], l15 ^ k[28],l16 ^ k[5 ], &r25, &r19, &r9, &r0);s5 (l15 ^ k[60], l16 ^ k[18], l17 ^ k[11], l18 ^ k[59], l19 ^ k[41],l20 ^ k[42], &r7, &r13, &r24, &r2);s6 (l19 ^ k[3 ], l20 ^ k[52], l21 ^ k[10], l22 ^ k[25], l23 ^ k[27],l24 ^ k[49], &r3, &r28, &r10, &r18);s7 (l23 ^ k[17], l24 ^ k[57], l25 ^ k[44], l26 ^ k[50], l27 ^ k[35],l28 ^ k[26], &r31, &r11, &r21, &r6);s8 (l27 ^ k[33], l28 ^ k[1 ], l29 ^ k[2 ], l30 ^ k[51], l31 ^ k[58],l0 ^ k[19], &r4, &r26, &r14, &r20);
s1 (r31 ^ k[28], r0 ^ k[23], r1 ^ k[4 ], r2 ^ k[14], r3 ^ k[54],r4 ^ k[21], &l8, &l16, &l22, &l30);s2 (r3 ^ k[5 ], r4 ^ k[46], r5 ^ k[7 ], r6 ^ k[29], r7 ^ k[55],r8 ^ k[61], &l12, &l27, &l1, &l17);s3 (r7 ^ k[6 ], r8 ^ k[39], r9 ^ k[12], r10 ^ k[13], r11 ^ k[30],r12 ^ k[45], &l23, &l15, &l29, &l5);s4 (r11 ^ k[15], r12 ^ k[37], r13 ^ k[38], r14 ^ k[47], r15 ^ k[20],r16 ^ k[62], &l25, &l19, &l9, &l0);s5 (r15 ^ k[52], r16 ^ k[10], r17 ^ k[3 ], r18 ^ k[51], r19 ^ k[33],r20 ^ k[34], &l7, &l13, &l24, &l2);s6 (r19 ^ k[58], r20 ^ k[44], r21 ^ k[2 ], r22 ^ k[17], r23 ^ k[19],r24 ^ k[41], &l3, &l28, &l10, &l18);s7 (r23 ^ k[9 ], r24 ^ k[49], r25 ^ k[36], r26 ^ k[42], r27 ^ k[27],r28 ^ k[18], &l31, &l11, &l21, &l6);s8 (r27 ^ k[25], r28 ^ k[60], r29 ^ k[57], r30 ^ k[43], r31 ^ k[50],r0 ^ k[11], &l4, &l26, &l14, &l20);
s1 (l31 ^ k[12], l0 ^ k[7 ], l1 ^ k[53], l2 ^ k[63], l3 ^ k[38],l4 ^ k[5 ], &r8, &r16, &r22, &r30);s2 (l3 ^ k[54], l4 ^ k[30], l5 ^ k[20], l6 ^ k[13], l7 ^ k[39],l8 ^ k[45], &r12, &r27, &r1, &r17);s3 (l7 ^ k[55], l8 ^ k[23], l9 ^ k[61], l10 ^ k[62], l11 ^ k[14],l12 ^ k[29], &r23, &r15, &r29, &r5);s4 (l11 ^ k[28], l12 ^ k[21], l13 ^ k[22], l14 ^ k[31], l15 ^ k[4 ],l16 ^ k[46], &r25, &r19, &r9, &r0);s5 (l15 ^ k[36], l16 ^ k[57], l17 ^ k[50], l18 ^ k[35], l19 ^ k[17],l20 ^ k[18], &r7, &r13, &r24, &r2);s6 (l19 ^ k[42], l20 ^ k[59], l21 ^ k[49], l22 ^ k[1 ], l23 ^ k[3 ],l24 ^ k[25], &r3, &r28, &r10, &r18);s7 (l23 ^ k[60], l24 ^ k[33], l25 ^ k[51], l26 ^ k[26], l27 ^ k[11],l28 ^ k[2 ], &r31, &r11, &r21, &r6);s8 (l27 ^ k[9 ], l28 ^ k[44], l29 ^ k[41], l30 ^ k[27], l31 ^ k[34],l0 ^ k[58], &r4, &r26, &r14, &r20);
s1 (r31 ^ k[61], r0 ^ k[20], r1 ^ k[37], r2 ^ k[47], r3 ^ k[22],r4 ^ k[54], &l8, &l16, &l22, &l30);s2 (r3 ^ k[38], r4 ^ k[14], r5 ^ k[4 ], r6 ^ k[62], r7 ^ k[23],r8 ^ k[29], &l12, &l27, &l1, &l17);s3 (r7 ^ k[39], r8 ^ k[7 ], r9 ^ k[45], r10 ^ k[46], r11 ^ k[63],r12 ^ k[13], &l23, &l15, &l29, &l5);s4 (r11 ^ k[12], r12 ^ k[5 ], r13 ^ k[6 ], r14 ^ k[15], r15 ^ k[53],r16 ^ k[30], &l25, &l19, &l9, &l0);s5 (r15 ^ k[51], r16 ^ k[41], r17 ^ k[34], r18 ^ k[19], r19 ^ k[1 ],r20 ^ k[2 ], &l7, &l13, &l24, &l2);s6 (r19 ^ k[26], r20 ^ k[43], r21 ^ k[33], r22 ^ k[52], r23 ^ k[50],r24 ^ k[9 ], &l3, &l28, &l10, &l18);s7 (r23 ^ k[44], r24 ^ k[17], r25 ^ k[35], r26 ^ k[10], r27 ^ k[58],r28 ^ k[49], &l31, &l11, &l21, &l6);s8 (r27 ^ k[60], r28 ^ k[59], r29 ^ k[25], r30 ^ k[11], r31 ^ k[18],r0 ^ k[42], &l4, &l26, &l14, &l20);
s1 (l31 ^ k[45], l0 ^ k[4 ], l1 ^ k[21], l2 ^ k[31], l3 ^ k[6 ],l4 ^ k[38], &r8, &r16, &r22, &r30);s2 (l3 ^ k[22], l4 ^ k[63], l5 ^ k[53], l6 ^ k[46], l7 ^ k[7 ],l8 ^ k[13], &r12, &r27, &r1, &r17);s3 (l7 ^ k[23], l8 ^ k[20], l9 ^ k[29], l10 ^ k[30], l11 ^ k[47],l12 ^ k[62], &r23, &r15, &r29, &r5);s4 (l11 ^ k[61], l12 ^ k[54], l13 ^ k[55], l14 ^ k[28], l15 ^ k[37],l16 ^ k[14], &r25, &r19, &r9, &r0);s5 (l15 ^ k[35], l16 ^ k[25], l17 ^ k[18], l18 ^ k[3 ], l19 ^ k[52],l20 ^ k[49], &r7, &r13, &r24, &r2);s6 (l19 ^ k[10], l20 ^ k[27], l21 ^ k[17], l22 ^ k[36], l23 ^ k[34],l24 ^ k[60], &r3, &r28, &r10, &r18);s7 (l23 ^ k[59], l24 ^ k[1 ], l25 ^ k[19], l26 ^ k[57], l27 ^ k[42],l28 ^ k[33], &r31, &r11, &r21, &r6);s8 (l27 ^ k[44], l28 ^ k[43], l29 ^ k[9 ], l30 ^ k[58], l31 ^ k[2 ],l0 ^ k[26], &r4, &r26, &r14, &r20);
s1 (r31 ^ k[29], r0 ^ k[53], r1 ^ k[5 ], r2 ^ k[15], r3 ^ k[55],r4 ^ k[22], &l8, &l16, &l22, &l30);s2 (r3 ^ k[6 ], r4 ^ k[47], r5 ^ k[37], r6 ^ k[30], r7 ^ k[20],r8 ^ k[62], &l12, &l27, &l1, &l17);s3 (r7 ^ k[7 ], r8 ^ k[4 ], r9 ^ k[13], r10 ^ k[14], r11 ^ k[31],r12 ^ k[46], &l23, &l15, &l29, &l5);s4 (r11 ^ k[45], r12 ^ k[38], r13 ^ k[39], r14 ^ k[12], r15 ^ k[21],r16 ^ k[63], &l25, &l19, &l9, &l0);s5 (r15 ^ k[19], r16 ^ k[9 ], r17 ^ k[2 ], r18 ^ k[50], r19 ^ k[36],r20 ^ k[33], &l7, &l13, &l24, &l2);s6 (r19 ^ k[57], r20 ^ k[11], r21 ^ k[1 ], r22 ^ k[51], r23 ^ k[18],r24 ^ k[44], &l3, &l28, &l10, &l18);s7 (r23 ^ k[43], r24 ^ k[52], r25 ^ k[3 ], r26 ^ k[41], r27 ^ k[26],r28 ^ k[17], &l31, &l11, &l21, &l6);s8 (r27 ^ k[59], r28 ^ k[27], r29 ^ k[60], r30 ^ k[42], r31 ^ k[49],r0 ^ k[10], &l4, &l26, &l14, &l20);
s1 (l31 ^ k[13], l0 ^ k[37], l1 ^ k[54], l2 ^ k[28], l3 ^ k[39],l4 ^ k[6 ], &r8, &r16, &r22, &r30);s2 (l3 ^ k[55], l4 ^ k[31], l5 ^ k[21], l6 ^ k[14], l7 ^ k[4 ],l8 ^ k[46], &r12, &r27, &r1, &r17);s3 (l7 ^ k[20], l8 ^ k[53], l9 ^ k[62], l10 ^ k[63], l11 ^ k[15],l12 ^ k[30], &r23, &r15, &r29, &r5);s4 (l11 ^ k[29], l12 ^ k[22], l13 ^ k[23], l14 ^ k[61], l15 ^ k[5 ],l16 ^ k[47], &r25, &r19, &r9, &r0);s5 (l15 ^ k[3 ], l16 ^ k[60], l17 ^ k[49], l18 ^ k[34], l19 ^ k[51],l20 ^ k[17], &r7, &r13, &r24, &r2);s6 (l19 ^ k[41], l20 ^ k[58], l21 ^ k[52], l22 ^ k[35], l23 ^ k[2 ],l24 ^ k[59], &r3, &r28, &r10, &r18);s7 (l23 ^ k[27], l24 ^ k[36], l25 ^ k[50], l26 ^ k[25], l27 ^ k[10],l28 ^ k[1 ], &r31, &r11, &r21, &r6);s8 (l27 ^ k[43], l28 ^ k[11], l29 ^ k[44], l30 ^ k[26], l31 ^ k[33],l0 ^ k[57], &r4, &r26, &r14, &r20);
s1 (r31 ^ k[62], r0 ^ k[21], r1 ^ k[38], r2 ^ k[12], r3 ^ k[23],r4 ^ k[55], &l8, &l16, &l22, &l30);s2 (r3 ^ k[39], r4 ^ k[15], r5 ^ k[5 ], r6 ^ k[63], r7 ^ k[53],r8 ^ k[30], &l12, &l27, &l1, &l17);s3 (r7 ^ k[4 ], r8 ^ k[37], r9 ^ k[46], r10 ^ k[47], r11 ^ k[28],r12 ^ k[14], &l23, &l15, &l29, &l5);s4 (r11 ^ k[13], r12 ^ k[6 ], r13 ^ k[7 ], r14 ^ k[45], r15 ^ k[54],r16 ^ k[31], &l25, &l19, &l9, &l0);s5 (r15 ^ k[50], r16 ^ k[44], r17 ^ k[33], r18 ^ k[18], r19 ^ k[35],r20 ^ k[1 ], &l7, &l13, &l24, &l2);s6 (r19 ^ k[25], r20 ^ k[42], r21 ^ k[36], r22 ^ k[19], r23 ^ k[49],r24 ^ k[43], &l3, &l28, &l10, &l18);s7 (r23 ^ k[11], r24 ^ k[51], r25 ^ k[34], r26 ^ k[9 ], r27 ^ k[57],r28 ^ k[52], &l31, &l11, &l21, &l6);s8 (r27 ^ k[27], r28 ^ k[58], r29 ^ k[59], r30 ^ k[10], r31 ^ k[17],r0 ^ k[41], &l4, &l26, &l14, &l20);
s1 (l31 ^ k[54], l0 ^ k[13], l1 ^ k[30], l2 ^ k[4 ], l3 ^ k[15],l4 ^ k[47], &r8, &r16, &r22, &r30);s2 (l3 ^ k[31], l4 ^ k[7 ], l5 ^ k[62], l6 ^ k[55], l7 ^ k[45],l8 ^ k[22], &r12, &r27, &r1, &r17);s3 (l7 ^ k[61], l8 ^ k[29], l9 ^ k[38], l10 ^ k[39], l11 ^ k[20],l12 ^ k[6 ], &r23, &r15, &r29, &r5);s4 (l11 ^ k[5 ], l12 ^ k[63], l13 ^ k[28], l14 ^ k[37], l15 ^ k[46],l16 ^ k[23], &r25, &r19, &r9, &r0);s5 (l15 ^ k[42], l16 ^ k[36], l17 ^ k[25], l18 ^ k[10], l19 ^ k[27],l20 ^ k[60], &r7, &r13, &r24, &r2);s6 (l19 ^ k[17], l20 ^ k[34], l21 ^ k[59], l22 ^ k[11], l23 ^ k[41],l24 ^ k[35], &r3, &r28, &r10, &r18);s7 (l23 ^ k[3 ], l24 ^ k[43], l25 ^ k[26], l26 ^ k[1 ], l27 ^ k[49],l28 ^ k[44], &r31, &r11, &r21, &r6);s8 (l27 ^ k[19], l28 ^ k[50], l29 ^ k[51], l30 ^ k[2 ], l31 ^ k[9 ],l0 ^ k[33], &r4, &r26, &r14, &r20);

	c[5] = l8;
	c[3] = l16;
	c[51] = l22;
	c[49] = l30;


	c[37] = l12;
	c[25] = l27;
	c[15] = l1;
	c[11] = l17;


	c[59] = l23;
	c[61] = l15;
	c[41] = l29;
	c[47] = l5;


	c[9] = l25;
	c[27] = l19;
	c[13] = l9;
	c[7] = l0;


	c[63] = l7;
	c[45] = l13;
	c[1] = l24;
	c[23] = l2;


	c[31] = l3;
	c[33] = l28;
	c[21] = l10;
	c[19] = l18;


	c[57] = l31;
	c[29] = l11;
	c[43] = l21;
	c[55] = l6;


	c[39] = l4;
	c[17] = l26;
	c[53] = l14;
	c[35] = l20;

	c[4] = r8;
	c[2] = r16;
	c[50] = r22;
	c[48] = r30;

	
	c[36] = r12;
	c[24] = r27;
	c[14] = r1;
	c[10] = r17;


	c[58] = r23;
	c[60] = r15;
	c[40] = r29;
	c[46] = r5;


	c[8] = r25;
	c[26] = r19;
	c[12] = r9;
	c[6] = r0;


	c[62] = r7;
	c[44] = r13;
	c[0] = r24;
	c[22] = r2;


	c[30] = r3;
	c[32] = r28;
	c[20] = r10;
	c[18] = r18;


	c[56] = r31;
	c[28] = r11;
	c[42] = r21;
	c[54] = r6;


	c[38] = r4;
	c[16] = r26;
	c[52] = r14;
	c[34] = r20;


}


int
main(){

    int d[2] = { 1816304003,550500727 };
    
    uint64_t pwds[64];
    
    char pass[] = "chocopie";
    pwds[0] = *(uint64_t*)&pass[0];
    pwds[62] = *(uint64_t*)&pass[0];
    pwds[63] = *(uint64_t*)&pass[0];
    
    if(0x8000000000000003 != hashCheck(&pwds[0],*(uint64_t*)&d[0])){
        return 1;
    }
    
    return 0;
    

}



