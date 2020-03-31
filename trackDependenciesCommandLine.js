'use strict';
const lib = require("./trackDependenciesLib.js")
const errors = require("./errors.js")

/* INPUT VALIDATION of command line args*/
if(process.argv.length!=3){
    throw new Error(errors.wrongNumberOfArguments);
}
const fileName = process.argv[2]
if(!fileName.endsWith(".txt")){
    throw new Error(errors.isNotTxtFile);
}

/**/
lib.processLineByLineAndProduceLibraryTree(fileName);