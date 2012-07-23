fs = require('fs')
net = require('net')


function extractArgument( arg, defaultVal  ) {
    
    for(var i = 2; i < process.argv.length ; i ++ ){
        var argName = process.argv[i].substr(0,arg.length);
        if(argName == arg){
            return process.argv[i].substr(arg.length+1);
        }
    }
    
    return defaultVal;
}


var dbgport = extractArgument("--dbgport","8123")
var uartPort = extractArgument("--uartport","8124")

dbgport = parseInt(dbgport)
uartPort = parseInt(uartPort)

INFO("debug listening on port -- " + dbgport);
INFO("uart listening on port -- " + uartPort);
ERROR("uart UNIMPLEMENTED");

emu = 0;

function reset() {
    emu = new Emulator()
}

reset();

commands = new Array();
commandLUT = {};

function addCommand(name,fun){
    commands.push(name)
    commandLUT[name] = fun;
}



// START debugging interface


addCommand("setll", function (s,command) {
    arg = command.split(" ")[1];
    LOG_LEVEL = parseInt(arg);
    s.write("ok\n");

});



addCommand("reset", function (s,command) {

    reset()
    s.write("ok\n");

});


addCommand("step", function (s,command) {

    emu.step();
    s.write("ok\n");

});


isRunning = false;
runIntervalId = 0;

function breakExecution() {
    INFO("break!");
    if(isRunning){
        clearInterval(runIntervalId);
    }
    isRunning = false;

}


addCommand("isrunning", function (s,command) {
    if(isRunning) {
        s.write("ok 1\n");
    } else {
        s.write("ok 0\n");
    }

});


addCommand("run", function (s,command) {
    isRunning = true;
    setInterval( function () {
        for ( var i = 0 ; i < 50 ; i++ ) {
            if(isRunning){
                emu.step();
            }
        }
    } , 1);
    
    s.write("ok\n");

});

addCommand("break", function (s,command) {
    breakExecution();
    s.write("ok\n");

});


addCommand("readreg", function (s,command) {
    arg = command.split(" ")[1];
    var val = 0;
    
    for(var i = 0 ; i < 32 ; i++){
        if(arg == "GR"+i.toString(10)){
            val = emu.cpu.genRegisters[i].asUInt32();
            s.write("ok "+ val.toString(16) +'\n');
            return;
        }
    
    }
    
    if(arg == "PC"){
        val = emu.cpu.PC.asUInt32();
    } else if (arg == "HI") {
        val = emu.cpu.HI.asUInt32();
    } else if (arg == "LO") {
        val = emu.cpu.LO.asUInt32();
    } else {
        s.write("ERROR: badreg\n");
        return;    
    }

    s.write("ok "+ val.toString(16) +'\n');
});

addCommand("readb", function (s,command) {
    var addr = command.split(" ")[1];
    addr = parseInt(addr,16);
    
    var limit = emu.mmu.getPhysicalSize();
    
    if(addr < 0 || addr >= limit){
        return "ERROR: badaddr";
    }
    
    var val = emu.mmu.readByte(addr);

    s.write("ok "+ val.toString(16) +'\n');
});


addCommand("shutdown", function(s,command){
    INFO("closing emulator server");
    s.write("ok\n")
    process.exit(0);
});

// END debugging interface



function handleCommand(data) {

    data = new String(data).split("\n")[0];
    INFO("got command - " + data);
    for(var i = 0 ; i < commands.length ; i++){
        if(data.substr(0,commands[i].length) == commands[i]) {
            INFO("executing command " + commands[i]);
            commandLUT[commands[i]](this,data);
            return;
        }
    }

    this.write("ERROR unknown command - " + data + "\n");
}


var dbgserver = net.createServer(function(c) { //'connection' listener

  c.on('end', function() {
    INFO('debugger disconnected');
  });
  
  c.on('connect', function() {
    INFO('debugger connected');
  });

  c.on("data", handleCommand);

});

dbgserver.listen(8123, function() { //'listening' listener
    console.log('server bound');
});
