set -e

dbgsend() {
    echo $@ | nc localhost 8123 | grep -q ok 
    return $?
}



runTest() {
    
    echo "Testing kernel $1"
    timeout 5m node ../js/node/node_4kc.js & 
    NODE_PID=$!
    sleep "1"
    dbgsend "break"
    dbgsend "reset"
    dbgsend "setll 0" 
    echo "loading srec image"
    python ../tools/srecLoader.py $1 --setentry > /dev/null
    echo "starting $KERNEL"
    dbgsend "run"
    time wait $NODE_PID
    if [ $? -ne 0 ]; then
        echo "****Test failed!**** $KERNEL"
        exit 1
    fi
}





if [ $# -eq 1 ]; then 
    runTest $1
else
    for KERNEL in `ls *.srec`
    do
        runTest $KERNEL
    done
fi


