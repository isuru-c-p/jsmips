

// constructor, either a hex string in the format abcdef123456
// or a number specifying the size


// todo heavily optimize, especially on aligned access

function OctetBuffer ( arg ) {

    this.getUInt16LE = function(n) {
        return this.getByte(n+1) * Math.pow(2,8) +
               this.getByte(n);
    }
    
    this.putUInt16LE = function (n,val) {
        
        if(n >= this.size - 1 || n < 0 ){
            throw ("invalid index into OctetBuffer - " + n);
        }
        
        if(val > 4294967295 /* 2**32-1 */ || val < 0) {
            throw ("invalid byte value - " + val );
        }
        
        this.putByte( n ,  val &  0xff );
        this.putByte( n+1, (val & 0xff00) >>> 8);        
    }


    this.getUInt32BE = function (n) {
        return this.getByte(n+3) +
               this.getByte(n+2) * Math.pow(2,8) +
               this.getByte(n+1) * Math.pow(2,16) +
               this.getByte(n) * Math.pow(2,24);
    }
    

    
    this.getUInt32LE = function(n) {
        return this.getByte(n+3)   * Math.pow(2,24) +
               this.getByte(n+2) * Math.pow(2,16) +
               this.getByte(n+1) * Math.pow(2,8) +
               this.getByte(n);
    }
    
    this.putUInt32LE = function (n,val) {
        
        if(n >= this.size - 3 || n < 0 ){
            throw ("invalid index into OctetBuffer - " + n);
        }
        
        if(val > 4294967295 /* 2**32-1 */ || val < 0) {
            throw ("invalid byte value - " + val );
        }
        
        this.putByte( n ,  val &  0xff );
        this.putByte( n+1, (val & 0xff00) >>> 8);
        this.putByte( n+2, (val & 0xff0000) >>> 16);
        this.putByte( n+3, (val & 0xff000000) >>> 24);
        
    }
    
    this.putUInt32BE = function (n,val) {
        
        if(n >= this.size - 3 || n < 0 ){
            throw ("invalid index into OctetBuffer - " + n);
        }
        
        if(val > 4294967295 /* 2**32-1 */ || val < 0) {
            throw ("invalid byte value - " + val );
        }
        
        this.putByte( n+3 , val &  0xff );
        this.putByte( n+2, (val & 0xff00) >>> 8);
        this.putByte( n+1, (val & 0xff0000) >>> 16);
        this.putByte( n+0, (val & 0xff000000) >>> 24);
        
    }


    this.getByte = function (n) {
        if(n >= this.size || n < 0 ){
            throw ("invalid index into OctetBuffer - " + n + " max: " + this.size);
        }
        
        var idx = Math.floor(n / 4);
        var shiftAmount = (n % 4)*8;
        
        return ( this.data[idx] & ( 0xff << shiftAmount ) ) >>> shiftAmount;
    }
    
    this.putByte = function (n,b) {
    

        if(n >= this.size || n < 0 ){
            throw ("invalid index into OctetBuffer - " + n + " max: " + this.size);
        }
        
        if(b > 255 || b < 0) {
            throw ("invalid byte value - " + b );
        }
        
        var idx = Math.floor(n / 4);
        var shiftAmount = (n % 4)*8;
        
        this.data[idx] = ( (this.data[idx] & ~(0xff << shiftAmount)) | ( b << shiftAmount ) );
    }
    
    this.toString = function () {
        ret = ''
        for(var i = 0; i < this.size ; i++){
            ret += String.fromCharCode(this.getByte(i));
        }
        return ret;
    }
    
    this.append = function ( buff ) {
        var idx = this.size
        this.size = idx + buff.getSize();
        
        var end = buff.getSize();
        
        for(var i = 0 ; i < end; i++ ){
            this.putByte(idx+i,buff.getByte(i))
        }
        
    }
    
    this.slice = function (idx,size) {
        trace("octet buffer slice: " + idx + " " + size)
        var ret = new OctetBuffer(size);
        for(var i = 0; i < size ; i++) {
            ret.putByte(i,this.getByte(idx+i))
        }
        return ret;
    }
    
    this.isEqual = function ( other ) {
        if (this.getSize() != other.getSize()){
            return false;
        }
        
        for(var i = 0; i < this.getSize() ; i++){
            if( this.getByte(i) != other.getByte(i) ){
                return false;
            }
        }
        
        return true;
    }
    
    
    this.getSize = function () { return this.size; } ;
    
    this.loadHexString  = function ( s, offset ) {
        for (var i = 0; i < s.length ; i += 2){
            var b = s.substr(i,2);
            b = parseInt(b,16);
            this.putByte(offset + i/2,b);
            
            //DEBUG("putting " + b + " at address " + (offset + i/2).toString(16) )
            
        }
    } 

    if (typeof arg === "number"){
        var size = arg;
    } else if (typeof arg === "string") {
        if(arg.length % 2 != 0){
            throw ("Octet buffer must be made of full bytes");
        }
        var size = arg.length/2;
    } else {
        throw ("OctetBuffer constructor cant take this type");
    }

    if(size < 0){
        throw ("invalid OctetBuffer size")
    }

    this.data = new Array(Math.floor(size/4));
    this.size = size;
    
    if (typeof arg === "string"){
        this.loadHexString(arg,0);
    }
}
