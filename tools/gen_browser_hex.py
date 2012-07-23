#!/usr/bin/python
import sys

if __name__ == "__main__":
	hexFileName = sys.argv[1]
	if(hexFileName.split(".")[-1] != "hex"):
		print "Error, hex file must have .hex extension"
		sys.exit(0)

	entryPointFileName = hexFileName.split(".")[-2] + ".entry"
	entryPoint = open(entryPointFileName).read()
	try:
		int(entryPoint,16)
	except:
		print "Error, invalid entry point in file: %s" % entryPointFileName
		sys.exit(0)

	outputFileName = "../js/browser/browser_hex.js"
	outputF = open(outputFileName,'w')
	hexFile = open(hexFileName)
	browser_hex_js = "var entryPoint = 0x%s; var browser_hex = '%s';" % (entryPoint, hexFile.read())
	outputF.write(browser_hex_js)
	outputF.close()
