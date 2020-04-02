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

let libraryIsRepeated = `
________________________________________________

Your list of libraries had a duplicate, so the program aborted. 
An example of an input which throws this error:
> A depends on x y z
> B depends on P Q R
> A depends on one two <- repeated
________________________________________________
`
exports.libraryIsRepeated = libraryIsRepeated

let ENOENT_test = "ENOENT: no such file or directory, open './test/nonExistentFile.txt"
exports.ENOENT_test = ENOENT_test
