fs = require('fs')


function extractArgument( arg, defaultVal  ) {
    
    for(var i = 2; i < process.argv.length ; i ++ ){
        var argName = process.argv[i].substr(0,arg.length);
        if(argName == arg){
            return process.argv[i].substr(arg.length+1);
        }
    }
    
    return defaultVal;
}


var image = extractArgument("--image","")

if(image == ""){
    ERROR("cannot run without an image!");
    process.exit(1);
}

INFO("loading image : " + image);

var entryPoint =extractArgument("--entrypoint","");

if(entryPoint == ""){
    ERROR("cannot run without an entry point!");
    process.exit(1);
}

entryPoint =  parseInt(entryPoint,16);


INFO("loading image with entry point: " + entryPoint.toString(16));

var tracefile = extractArgument("--tracefile","")
var shouldTrace = false;
if(tracefile == "") {
    INFO("Not tracing emulator");
} else {
    shouldTrace = true;
    INFO("saving a trace to file: " + tracefile)
}


emu = new Emulator()
emu.mmu.physicalMemory.loadHexString(new String(fs.readFileSync(image)),0)

if (shouldTrace){
    tracer = new Tracer(tracefile);
    var traceCount = 0;
}
emu.cpu.PC.putUInt32(entryPoint)


setInterval(function () {

    for(var i = 0 ; i < 500 ; i++){
        if(shouldTrace){
            tracer.writeTrace(emu);
            traceCount += 1;
            if(traceCount > 100000000){
                ERROR("thats a large trace...")
                process.exit(1);
            }
        }
        emu.step();
    }

}, 0)
