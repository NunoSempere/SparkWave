/* LIBRARIES */
'use strict';
const fs = require('fs');
const readline = require('readline');
const errors = require("./errors.js")

/* Constants & utilities */
const dividerStringLibAndDeps = " depends on "
const dividerStringBetweenDeps = " "
const unique = array => [...new Set(array)];
const isEmpty = array => (array.length == 0)

/* PROCESSING FUNCTION */

let parseLine = (line) => {
    let lineSplitOnDividerStringLibAndDeps = line.split(dividerStringLibAndDeps)
    let libraryName = lineSplitOnDividerStringLibAndDeps[0]        
    
    if(
        libraryName!="" 
        && line != "" 
        && line.includes(dividerStringLibAndDeps)
    ){
        let dependenciesArray = unique(
            lineSplitOnDividerStringLibAndDeps[1]
            .split(dividerStringBetweenDeps)
            .filter(element => element != "" && element != " ")
            )

        let subTree = ({
            libraryName,
            allDependencies: [],
            dependenciesStack: dependenciesArray,
        })
        return [libraryName, subTree]
    }else{
        throw new Error(errors.lineMalformed);
    }
    
}
exports.parseLine = parseLine;

async function processLineByLineAndProduceLibraryTree(fileNameDependentLibraries, callback = callbackCommandLine) {
    var libraryTree = ({})
    
    const fileStream = fs.createReadStream(fileNameDependentLibraries);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        let [libraryName, subTree] = parseLine(line)
        libraryTree[libraryName] = subTree
    });

    rl.on('close', () => {
        callback(libraryTree);
    });

    rl.on('error', (error) => {
        throw error
    });

}
exports.processLineByLineAndProduceLibraryTree = processLineByLineAndProduceLibraryTree;

let callbackCommandLine = (libraryTree) => {
    let result = processTheDependencyTreeStack(libraryTree);
    console.log(result.join("\n"))
}
exports.callbackCommandLine = callbackCommandLine;


let processTheDependencyTreeStack = (libraryTree) => {    
    let areThereLibrariesWhichStillHaveMoreDependencies = (libraryTree) => {
        return Object.keys(libraryTree)
            .some(libName => (
                !isEmpty(libraryTree[libName].dependenciesStack)
            ))
    }

    /* Unpack the stack */
    while(areThereLibrariesWhichStillHaveMoreDependencies(libraryTree)){
        for(let libName in libraryTree){
            let lib = libraryTree[libName]

            if(!isEmpty(lib.dependenciesStack)){
                let topOfStack = (lib.dependenciesStack).shift();
                (lib.allDependencies).push(topOfStack);

                if(libraryTree.hasOwnProperty(topOfStack)){
                    let topOfStackTree = libraryTree[topOfStack]

                    lib.allDependencies = (lib.allDependencies)
                        .concat(topOfStackTree.allDependencies)
                        .filter(dep => dep!=libName)
                    lib.allDependencies = unique(lib.allDependencies)

                    lib.dependenciesStack = lib.dependenciesStack
                        .concat(topOfStackTree.dependenciesStack)
                        .filter(dep=>(
                            !(lib.allDependencies).includes(dep) 
                            && dep != libName
                        ))
                    lib.dependenciesStack = unique(lib.dependenciesStack)

                }
            }

        }
    }

    /* Formatting */
    let result = []
    for(let libName in libraryTree){
        let lib = libraryTree[libName];
        (lib.allDependencies).sort();

        result.push(
            libName 
            + dividerStringLibAndDeps 
            + (lib.allDependencies)
                .join(dividerStringBetweenDeps)
        )

    }
    return result 
}
exports.processTheDependencyTreeStack = processTheDependencyTreeStack;