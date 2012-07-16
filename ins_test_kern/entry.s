.global entry

entry:
    addiu $sp,$0,0xffff
    nop
    addiu $sp,$sp,0xffff
    nop
    j kmain
