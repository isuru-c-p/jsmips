#!/usr/bin/python
import sys
import json

if __name__ == "__main__":
	srecFileName = sys.argv[1]
	if(srecFileName.split(".")[-1] != "srec"):
		print "Error, srec file must have .srec extension"
		sys.exit(0)

	outputFileName = "../js/browser/browser_srec.js"
	outputF = open(outputFileName,'w')
	srecFile = open(srecFileName)
	browser_srec_js = "var browser_srec = %s;" % (json.dumps(srecFile.read()))
	outputF.write(browser_srec_js)
	outputF.close()
