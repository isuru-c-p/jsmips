set -e

for KERNEL in `ls *.hex`
do
    BASE=`basename $KERNEL .hex`
    if ! node ../node_4kc.js --image=$KERNEL --entrypoint=`cat $BASE.entry` ; then
        echo "test $BASE failed! running a trace..."
        set +e
        node ../node_4kc.js --image=$KERNEL --entrypoint=`cat $BASE.entry` --tracefile=$BASE.trace
        set -e
    fi
    
done