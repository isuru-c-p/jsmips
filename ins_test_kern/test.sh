set -e

for KERNEL in `ls *.hex`
do
    BASE=`basename $KERNEL .hex`
    node ../node_4kc.js --image=$KERNEL --entrypoint=`cat $BASE.entry`
done
