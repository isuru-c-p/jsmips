set -e




buildKernel () {

    NAME=`basename $1 .c`
    mips-linux-gcc -mno-abicalls -fno-pic  -o kernel_common.o -c kernel.c  -Wall -Wextra  \
        -nostdlib -fno-builtin -nostartfiles -nodefaultlibs
    mips-linux-gcc -mno-abicalls -fno-pic  -o kernel_$NAME.o -c $1 -Wall -Wextra \
        -nostdlib -fno-builtin -nostartfiles -nodefaultlibs
    mips-linux-as -o entry.o entry.s
    mips-linux-ld -T linker.ld -o kernel_$NAME.bin entry.o kernel_$NAME.o kernel_common.o
    mips-linux-objdump -D kernel_$NAME.bin > kernel_$NAME.map
    python tohex.py kernel_$NAME.bin > kernel_$NAME.hex
    echo `mips-linux-nm kernel_$NAME.bin | grep entry | cut -c 1-8` > kernel_$NAME.entry
    echo "built kernel with entry point:"
    cat kernel_$NAME.entry

}

for f in `ls tests/*.c`
do 

buildKernel $f

done
