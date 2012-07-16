set -e

mips-linux-gcc -o kernel.o -c kernel.c -Wall -Wextra -Werror \
    -nostdlib -fno-builtin -nostartfiles -nodefaultlibs
mips-linux-as -o entry.o entry.s
mips-linux-ld -T linker.ld -o kernel.bin entry.o kernel.o
python tohex.py kernel.bin > kernel.hex

echo "built kernel with entry point:" 
echo `mips-linux-nm kernel.bin | grep entry`
