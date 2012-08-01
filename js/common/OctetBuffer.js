


function OctetBuffer ( size ) {

    


    if(size < 0){
        throw ("invalid OctetBuffer size")
    }

    this.data = new Array(Math.floor(size/4));
    this.size = size;
    
    this.getSize = function () { return this.size; } 
    

    this.getUInt16BE = function(n) {
        return this.getByte(n) * 256 +
               this.getByte(n+1);
    }
    
    this.putUInt16BE = function (n,val) {
        this.putByte( n+1 ,  val &  0xff );
        this.putByte( n, (val & 0xff00) >>> 8);        
    }


    this.getUInt32BE = function (n) {
    
        var i = n&3;
        if(i == 0){
             return this.data[n>>2] >>> 0;
        } 
    
        return this.getByte(n+3) +
               this.getByte(n+2) * 256 +
               this.getByte(n+1) * 65536 +
               this.getByte(n)   * 16777216;
    }
    

    
    this.getUInt32LE = function(n) {
        return this.getByte(n+3) * 16777216 +
               this.getByte(n+2) * 65536 +
               this.getByte(n+1) * 256 +
               this.getByte(n);
    }
    
    this.putUInt32LE = function (n,val) {
        
        this.putByte( n ,  val &  0xff );
        this.putByte( n+1, (val & 0xff00) >>> 8);
        this.putByte( n+2, (val & 0xff0000) >>> 16);
        this.putByte( n+3, (val & 0xff000000) >>> 24);
        
    }
    
    this.putUInt32BE = function (n,val) {
        var i = n&3;
        if(i == 0){
            this.data[n>>2] = (val&(0xffffffff)) >>> 0;
            return;
        }
        
        this.putByte( n+3 , val & 0xff);
        this.putByte( n+2, (val & 0xff00) >>> 8);
        this.putByte( n+1, (val & 0xff0000) >>> 16);
        this.putByte( n+0, (val & 0xff000000) >>> 24);
        
    }


    this.getByte = function (n) {
        var mod4 = n&3;
        var idx =  (n - (mod4)) >> 2;
        var shiftAmount = (3 - mod4 ) << 3;
        return ( this.data[idx] & ( 0xff << shiftAmount ) ) >>> shiftAmount;
    }
    
    this.putByte = function (n,b) {
        var mod4 = n&3;
        var idx =  (n - mod4) >> 2;
        var shiftAmount = (3 - (mod4) ) << 3;
        this.data[idx] = ( (this.data[idx] & ~(0xff << shiftAmount)) | ( b << shiftAmount ) );
    }
    
    this.toString = function () {
        ret = ''
        for(var i = 0; i < this.size ; i++){
            ret += "0x"+this.getByte(i).toString(16) +" ";
        }
        return ret;
    }

}


