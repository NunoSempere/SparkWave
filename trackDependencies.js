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

/* THE ALGORITMIC MEAT */

let processTheDependencyTreeStack = (libraryTree) => {
    
    let areThereLibrariesWhichStillHaveMoreDependencies = (libraryTree) => {
        return Object.keys(libraryTree)
            .some(libName => (
                !isEmpty(libraryTree[libName].dependenciesStack)
            ))
    }

    while(areThereLibrariesWhichStillHaveMoreDependencies(libraryTree)){
        for(let libName in libraryTree){
            let lib = libraryTree[libName]

            if(!isEmpty(lib.dependenciesStack)){
                let topOfStack = (lib.dependenciesStack).shift();
                (lib.finalDependenciesList).push(topOfStack);

                if(libraryTree.hasOwnProperty(topOfStack)){
                    let topOfStackTree = libraryTree[topOfStack]

                    lib.finalDependenciesList = (lib.finalDependenciesList)
                        .concat(topOfStackTree.finalDependenciesList)
                        .filter(dep => dep!=libName)
                    lib.finalDependenciesList = unique(lib.finalDependenciesList)

                    lib.dependenciesStack = lib.dependenciesStack
                        .concat(topOfStackTree.dependenciesStack)
                        .filter(dep=>(
                            !(lib.finalDependenciesList).includes(dep) 
                            && dep != libName
                        ))
                    lib.dependenciesStack = unique(lib.dependenciesStack)

                }
            }

        }
    }

    return libraryTree

    /* Example: 
    {
        A:{
            A,
            finalDependenciesList: [],
            dependenciesStack: [b,c,d],
        },

        b:{
            b,
            finalDependenciesList: [],
            dependenciesStack: [X,Y,Z],
        },

        X: {
            X,
            finalDependenciesList: [Alpha, Beta],
            dependenciesStack: [uno, dos],
        }
    }

    After one step of the while loop:

    {
        A:{
            A,
            finalDependenciesList: [b],
            dependenciesStack: [c,d,X,Y,Z],
        }

        B:{
            B,
            finalDependenciesList: [X, Alpha, Beta],
            dependenciesStack: [Y,Z, uno, dos],
        }

        X: {
            X,
            finalDependenciesList: [Alpha, Beta, uno],
            dependenciesStack: [dos],
        }
    }
    */
}
exports.processTheDependencyTreeStack = processTheDependencyTreeStack;

/* FORMATTING */

let prettyPrintLibTree = (libraryTree) => {
    let result = []
    for(let libName in libraryTree){
        let lib = libraryTree[libName];
        (lib.finalDependenciesList).sort();

        result.push(
            libName 
            + dividerStringLibAndDeps 
            + (lib.finalDependenciesList)
                .join(dividerStringBetweenDeps)
        )

    }
    return result.join("\n")
}
exports.prettyPrintLibTree = prettyPrintLibTree;


/* INPUT-OUTPUT */
let createSubtreeFromLine = (line) => {
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
            finalDependenciesList: [],
            dependenciesStack: dependenciesArray,
        })
        return [libraryName, subTree]
    }else{
        throw new Error(errors.lineMalformed);
    }
    
}
exports.createSubtreeFromLine = createSubtreeFromLine;

async function fileNameIntoOutput(fileNameDependentLibraries, callback) {
    var libraryTree = ({})
    
    const fileStream = fs.createReadStream(fileNameDependentLibraries);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        // parse each line into a format which makes processing easier.
        let [libraryName, subTree] = createSubtreeFromLine(line)
        libraryTree[libraryName] = subTree
    });

    rl.on('close', () => {
        let result = processTheDependencyTreeStack(libraryTree);
        callback(result);
    });

    rl.on('error', (error) => {
        throw error
    });

}
exports.fileNameIntoOutput = fileNameIntoOutput;

/* COMMAND LINE UTILITY */
let callbackCommandLine = (result) => {
    // separating this callback allows for easier testing.
    let resultPrettyPrint = prettyPrintLibTree(result);
    console.log(resultPrettyPrint)
}
exports.callbackCommandLine = callbackCommandLine;

let commandLineUtility  = () => {
    if(require.main === module && process.argv.length==3){
        const fileName = process.argv[2]
        if(!fileName.endsWith(".txt")){
            throw new Error(errors.isNotTxtFile);
        }else{
            fileNameIntoOutput(fileName, callbackCommandLine);
        }
    }
}
commandLineUtility();
exports.commandLineUtility = commandLineUtility;
