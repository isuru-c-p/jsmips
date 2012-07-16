import sys

f = open(sys.argv[1],'rb')

while True:
    b = f.read(1)
    if len(b) == 0:
        break
    b = ord(b)
    for mask in [0xf0,0x0f]:
        sys.stdout.write(hex(b&mask)[2])
