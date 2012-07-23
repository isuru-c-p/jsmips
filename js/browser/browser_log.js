LOG_LEVEL = 1

function terminal(output)
{
    $('.terminal-output').append(output.replace("\n","<br/>").replace("\r","<br/>"));
}


function DEBUG (m) {
    if(LOG_LEVEL <= 0){
        terminal("DEBUG: " + m + "<br/>");
    }
}

function INFO(m) {
    if(LOG_LEVEL <= 1){
        terminal("INFO: " + m + "<br/>");
    }
}

function WARN(m) {
    if(LOG_LEVEL <= 2){
        terminal("WARN: " + m + "<br/>");
    }
}

function ERROR(m) {
    if(LOG_LEVEL <= 3){
        terminal("ERROR: " + m + "<br/>");
    }
}
