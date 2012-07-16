set -e

mips-linux-gcc -o kernel.o -c kernel.c -Wall -Wextra -Werror \
    -nostdlib -fno-builtin -nostartfiles -nodefaultlibs
mips-linux-as -o loader.o loader.s
mips-linux-ld -T linker.ld -o kernel.bin loader.o kernel.o
