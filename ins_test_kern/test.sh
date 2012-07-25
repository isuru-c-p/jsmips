
dbgsend() {
    echo $@ | nc localhost 8123 | grep ok
    return $?
}










for KERNEL in `ls *.srec`
do
    echo "Testing kernel $KERNEL"
    echo "STARTING NODE"
    timeout 5m node ../js/node/node_4kc.js &
    NODE_PID=$!
    sleep 1
    echo "making sure emulator is stopped"
    dbgsend "break"
    dbgsend "reset"
    echo "loading srec image"
    python ../tools/srecLoader.py $KERNEL
    echo "starting $KERNEL"
    dbgsend "run"
    
    if ! wait $NODE_PID ; then
        echo "Test failed! $KERNEL"
        exit 1
    fi
done
