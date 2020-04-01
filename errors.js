let lineMalformed = `
________________________________________________________

The programme expected lines of the form
    > A depends on B C D
Make sure your file is not malformed 
(and in particular, that it doesn't contain empty lines)
________________________________________________________
`
exports.lineMalformed = lineMalformed;

let isNotTxtFile = `
________________________________________________

The programme expected an expression of the form
    "node trackDependencies.js somefilename.txt"
but the third argument was not a .txt file
________________________________________________
`
exports.isNotTxtFile = isNotTxtFile;

let wrongError = "The correct error was not thrown";
exports.wrongError = wrongError;