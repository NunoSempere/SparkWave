// https://docs.google.com/document/d/1njQJWXe_FGQ87ANEURbCz5ou4XdW0TzwXBrxi6JXL8Y/edit

/* LIBRARIES */

'use strict';

const fs = require('fs');
const readline = require('readline');

/* INPUT VALIDATION */
if(process.argv.length!=3){
    throw new Error(`
    ________________________________________________

    The programme expected an expression of the form
        "node start.js someFilename.txt"
    but received the wrong number of arguments
    ________________________________________________
    `);
}
const fileNameDependentLibraries = process.argv[2]
if(!fileNameDependentLibraries.endsWith(".txt")){
    throw new Error(`
    ________________________________________________

    The programme expected an expression of the form
        "node start.js somefilename.txt"
    but the third argument was not a .txt file
    ________________________________________________
    `);
}

/* Constants & utilities */
const dividerStringLibAndDeps = " depends on "
const dividerStringBetweenDeps = " "
const unique = array => [...new Set(array)];
const isEmpty = array => (array.length == 0)

/* READ THE FILE */
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
        throw new Error(`
        ________________________________________________________
    
        The programme expected lines of the form
            > A depends on B C D
        Make sure your file is not malformed 
        (and in particular, that it doesn't contain empty lines)
        ________________________________________________________
        `);
    }
    
}

async function processLineByLineAndProduceLibraryTree() {
    var libraryTree = ({})
    
    /* FileStream boilerplate */
    const fileStream = fs.createReadStream(fileNameDependentLibraries);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
        let [libraryName, subTree] = parseLine(line, libraryTree)
        libraryTree[libraryName] = subTree
    });

    rl.on('close', () => {
        let result = processTheDependencyTreeStack(libraryTree);
        console.log(result.join("\n"))
    });

}

processLineByLineAndProduceLibraryTree();

/*PROCESS THE DEPENDENCY TREE*/

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

                let topOfStackTree = libraryTree[topOfStack]
                if(topOfStackTree != undefined){
                    
                    lib.allDependencies = (lib.allDependencies)
                        .concat(topOfStackTree.allDependencies)
                    lib.dependenciesStack = lib.dependenciesStack
                        .concat(topOfStackTree.dependenciesStack)
                    
                    lib.allDependencies = unique(lib.allDependencies)                
                    lib.dependenciesStack = unique(lib.dependenciesStack)
                    
                    lib.dependenciesStack = (lib.dependenciesStack)
                        .filter(dep=>(
                            !(lib.allDependencies).includes(dep) 
                            && dep != libName
                        ))
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
