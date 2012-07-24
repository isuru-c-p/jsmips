set -e

O="-O3"


buildKernel () {

    NAME=`basename $1 .c`
    mips-linux-gcc $O -mno-abicalls -fno-pic  -o kernel_common.o -c kernel.c  -Wall -Wextra  \
        -nostdlib  -fno-builtin -nostartfiles -nodefaultlibs
    mips-linux-gcc $O -mno-abicalls -fno-pic  -o kernel_$NAME.o -c $1 -Wall -Wextra \
        -nostdlib -fno-builtin -nostartfiles -nodefaultlibs
    mips-linux-as -o entry.o entry.s
    mips-linux-ld -T linker.ld -o kernel_$NAME.elf entry.o kernel_$NAME.o kernel_common.o
    mips-linux-objdump -D kernel_$NAME.elf > kernel_$NAME.map
    mips-linux-objcopy -O srec kernel_$NAME.elf kernel_$NAME.srec
    python tohex.py kernel_$NAME.elf > kernel_$NAME.hex
    echo `mips-linux-nm kernel_$NAME.elf | grep entry | cut -c 9-16` > kernel_$NAME.entry
    echo "built kernel with entry point:"
    cat kernel_$NAME.entry

}

for f in `ls tests/*.c`
do 
    buildKernel $f
done
