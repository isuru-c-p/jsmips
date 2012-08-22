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

if (extractArgument("--quiet","false") == "true"){
    LOG_LEVEL = 0;
}

dbgport = parseInt(dbgport)
uartPort = parseInt(uartPort)

INFO("debug listening on port -- " + dbgport);
INFO("uart listening on port -- " + uartPort);
WARN("uart UNIMPLEMENTED");

emu = 0;

function reset() {
    emu = new Emulator()
    emu.serialLine = new node_serial();
    emu.tryQuit = function (exitCode) {
        process.exit(exitCode);
    }
}

reset();

commands = new Array();
commandLUT = {};

function addCommand(name,fun){
    commands.push(name)
    commandLUT[name] = fun;
}

function callNoException(newThis,func,args){
    var oldTriggerException = emu.cpu.triggerException;
    emu.cpu.triggerException = function () {};
    try {
        var ret = func.apply(newThis,args);
    } catch (e){
        emu.cpu.triggerException = oldTriggerException;
        throw e;
    }
    emu.cpu.triggerException = oldTriggerException;
    return ret;
}

// START debugging interface


addCommand("setll", function (s,command) {
    arg = command.split(" ")[1];
    LOG_LEVEL = parseInt(arg);
    s.write("ok\n");

});




addCommand("step", function (s,command) {

    emu.step();
    s.write("ok\n");

});


isRunning = false;
runIntervalId = 0;
breakPoint = undefined;

function breakExecution() {
    INFO("break!");
    if(isRunning){
        clearInterval(runIntervalId);
    }
    isRunning = false;

}

addCommand("bp", function (s,command) {
    var addr = command.split(" ")[1];
    addr = parseInt(addr,16);
    breakPoint = addr;
    s.write("ok bp set " + breakPoint.toString(16) + "\n");
});

addCommand("cbp", function (s,command) {
    breakPoint = undefined;
    s.write("ok\n");
});


addCommand("reset", function (s,command) {
    breakExecution();
    reset()
    s.write("ok\n");
});


addCommand("isrunning", function (s,command) {
    if(isRunning) {
        s.write("ok 1\n");
    } else {
        s.write("ok 0\n");
    }

});


addCommand("run", function (s,command) {
    isRunning = true;
    runIntervalId = setInterval( function () {
        for ( var i = 0 ; i < 10000 ; i++ ) {
            if( emu.cpu.PC.asUInt32() == breakPoint ){
                breakExecution();
            }
            if(isRunning){
                emu.step();
            } else {
                break;
            }
        }
    } , 1);
    
    s.write("ok\n");

});

addCommand("break", function (s,command) {
    breakExecution();
    s.write("ok\n");

});

addCommand("readtlb", function (s,command) {
	var tlb = emu.mmu.tlb;	
	s.write("TLB entries: \n");	

	for(var i = 0; i < 64; i += 4)
	{
		s.write("#" + (i/4).toString() + "\n");
		var tlbEntry0 = tlb[i];
		var tlbEntry1 = tlb[i+1];
		var pagemask = tlbEntry0;
		var VPN2 = (tlbEntry1 >>> 9);
		var G = (tlbEntry1 >>> 8) & 0x1;
		var ASID = (tlbEntry1 & 0xff);


		s.write("PageMask[24:13] = " + pagemask.toString(16) + "\n");
		s.write("VPN2[31:13] = " + VPN2.toString(16) + "\n"); 
		s.write("G = " + G.toString(16) + "\n"); 
		s.write("ASID[7:0] = " + ASID.toString(16) + "\n"); 

		var tlbEntry2 = tlb[i+2];
		var tlbEntry3 = tlb[i+3];
		var PFN0 = (tlbEntry2 >>> 5);
		var C0 = (tlbEntry2 >>> 2) & 0x7;
		var D0 = (tlbEntry2 >>> 1) & 0x1;
		var V0 = (tlbEntry2 & 0x1) >>> 0;

		var PFN1 = (tlbEntry3 >>> 5);
		var C1 = (tlbEntry3 >>> 2) & 0x7;
		var D1 = (tlbEntry3 >>> 1) & 0x1;
		var V1 = (tlbEntry3 & 0x1) >>> 0;
		
		s.write("Entry #1: \n");
		s.write("PFN0: " + PFN0.toString(16) + ", C0: " + C0.toString(16) + ", D0: " + D0.toString() + ", V0: " + V0.toString() + "\n");
		s.write("Entry #2: \n");
		s.write("PFN1: " + PFN1.toString(16) + ", C1: " + C1.toString(16) + ", D1: " + D1.toString() + ", V1: " + V1.toString() + "\n");
		s.write("\n");
		
	}	
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


addCommand("writereg", function (s,command) {
    var arg = command.split(" ")[1];
    var val = parseInt(command.split(" ")[2],16);
    
    for(var i = 0 ; i < 32 ; i++){
        if(arg == "GR"+i.toString(10)){
            val = emu.cpu.genRegisters[i].putUInt32(val);
            s.write("ok\n");
            return;
        }
    
    }
    if(arg == "PC"){
        emu.cpu.PC.putUInt32(val);
    } else if (arg == "HI") {
        emu.cpu.HI.putUInt32(val);
    } else if (arg == "LO") {
        emu.cpu.LO.putUInt32(val);
    } else {
        s.write("ERROR: badreg\n");
        return;    
    }
    s.write("ok\n");
});


addCommand("physmemsize", function (s,command) {
    s.write("ok " + emu.mmu.physicalMemory.getSize().toString(16) + '\n');
})


addCommand("readpb", function (s,command) {
    var addr = command.split(" ")[1];
    addr = parseInt(addr,16);
    var val = emu.mmu.physicalMemory.getByte(addr)
    s.write("ok "+ val.toString(16) +'\n');
})


addCommand("readb", function (s,command) {
    var addr = command.split(" ")[1];
    addr = parseInt(addr,16);
    var val = callNoException(emu.mmu,emu.mmu.readByte,[addr]);
    s.write("ok "+ val.toString(16) +'\n');
});


addCommand("readword", function (s,command) {
    var addr = command.split(" ")[1];
    addr = parseInt(addr,16);
    var val = callNoException(emu.mmu,emu.mmu.readWord,[addr]);
    s.write("ok "+ val.toString(16) +'\n');
});


addCommand("writeb", function (s,command) {
    var addr = command.split(" ")[1];
    var val = command.split(" ")[2];
    addr = parseInt(addr,16);
    val = parseInt(val,16);
    callNoException(emu.mmu,emu.mmu.writeByte,[addr,val]);
    s.write("ok\n");
});


addCommand("shutdown", function(s,command){
    INFO("closing emulator server");
    s.write("ok\n")
    process.exit(0);
});

addCommand("loadsrec", function (s,command) {
    var setEntry = command.split(" ")[1];
    var srecString = command.split(" ")[2];
    setEntry = parseInt(setEntry,16);
    try {
        callNoException(emu.mmu,emu.mmu.loadSREC,[srecString,setEntry]);
    } catch(e){
        s.write(e);
    }
    s.write("ok\n");
});

addCommand("filesrecload", function (s,command) {
    var setEntry = command.split(" ")[1];
    var srecFilePath = command.split(" ")[2];

    setEntry = parseInt(setEntry,16);
    fs.readFile(srecFilePath, 'ascii', function(err,data) {
        if(err) {
            s.write(err);
        }
        else
        {
            try {
                callNoException(emu.mmu, emu.mmu.loadSREC, [data,setEntry]);
                s.write("ok");
            } catch(e) {
                s.write(e);
            }
        }
    });
});

// END debugging interface



function handleCommand(data) {

    data = new String(data).split("\n")[0];
    for(var i = 0 ; i < commands.length ; i++){
        if(data.substr(0,commands[i].length) == commands[i]) {
            try {
                commandLUT[commands[i]](this,data);
            } catch (e){
                if (e == 1337){
                    this.write("ERROR: processor exception occured ")
                } else {
                    throw e;
                }
            }
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
    INFO('server bound');
});



var serialServer = net.createServer(function(c) { //'connection' listener

  c.on('end', function() {
    INFO('serialServer disconnected');
    removeSerialSocket(this);
  });
  
  c.on('connect', function() {
    INFO('serialServer connected');
    registerSerialSocket(this);
    
  });

  c.on("data", function(d){} );

});

serialServer.listen(8124, function() { //'listening' listener
    INFO('server bound');
});
