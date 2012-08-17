
connectedSerialSockets = {};

function registerSerialSocket( s ) {
    connectedSerialSockets[s] = s; 
}


function removeSerialSocket( s ) {
    if(s in connectedSerialSockets){
        delete connectedSerialSockets[s];
    } 
}

function node_serial () {

    this.writeToConsole = function (data) {
     
        for(s in connectedSerialSockets){
            connectedSerialSockets[s].write(data);
        }
        
    }
    
    this.writeToDevice = function (data) {
    
    }
}
