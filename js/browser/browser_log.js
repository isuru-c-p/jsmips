LOG_LEVEL = 1

function DEBUG (m) {
    if(LOG_LEVEL <= 0){
        $('#terminal').append("DEBUG: " + m + "<br/>");
    }
}

function INFO(m) {
    if(LOG_LEVEL <= 1){
        $('#terminal').append("INFO: " + m + "<br/>");
    }
}

function WARN(m) {
    if(LOG_LEVEL <= 2){
        $('#terminal').append("WARN: " + m + "<br/>");
    }
}

function ERROR(m) {
    if(LOG_LEVEL <= 3){
        $('#terminal').append("ERROR: " + m + "<br/>");
    }
}
