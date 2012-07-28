LOG_LEVEL = 2

function terminal(m) {
    //console.log(m);
    process.stdout.write(m);
}

function DEBUG (m) {
    if(LOG_LEVEL >= 3){
        console.log("DEBUG: " + m)
    }
}

function INFO(m) {
    if(LOG_LEVEL >= 2){
        console.log("INFO: " + m)
    }
}

function WARN(m) {
    if(LOG_LEVEL >= 1){
        console.log("WARN: " + m)
    }
}

function ERROR(m) {
    if(LOG_LEVEL >= 0){
        console.log("ERROR: " + m)
    }
}
