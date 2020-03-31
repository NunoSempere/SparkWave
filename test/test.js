'use strict';

const lib = require("../trackDependenciesLib.js")
const errors = require("../errors.js")
var {assert, expect} = require('chai');

describe('#parseLine', async function() {
  it('should create a subtree when given a normal line', function() {
    let parsedLine = lib.parseLine("A depends on B C D")
    assert.equal(parsedLine[0], "A")
    assert.deepEqual(
      parsedLine[1],
      ({
        "libraryName": "A",
        "allDependencies": [],
        "dependenciesStack": ["B", "C", "D"]
      })
    )
  });

  it('should create a subtree when given a very long line', function() {

    let parsedLine = lib.parseLine("A depends on "+loremIpsum)
    assert.equal(parsedLine[0], "A")
    assert.deepEqual(
      parsedLine[1],
      ({
        "libraryName": "A",
        "allDependencies": [],
        "dependenciesStack": loremIpsumArray
      })
    )
  });

  let malformedInputs = ["A depende de B C D", "A depends on", "A", "depends on",""]
  for(let malformedInput of malformedInputs){
    it('should throw an error when given a malformed input: "'+malformedInput+'"', function() {
      try {
        lib.parseLine(malformedInput);
        throw new Error(errors.wrongError)
      } catch (e) { 
        if (e.message == errors.wrongError) {
          throw e;
        }
        assert.equal(e.message, errors.lineMalformed);
      }
       
    });  
  }

});

describe('#processTheDependencyTreeStack', function() {
  it('should deal adequately with a variety of stack trees', function() {
    //assert.equal(,);
  });
});


describe('#processLineByLineAndProduceLibraryTree', async function() {
  let fileNames = ["./test/INPUT1.txt","./test/INPUT2.txt","./test/INPUT3.txt"];
  let outputs = [
`X depends on R Y Z
Y depends on Z`,

`Y depends on A B Q R S Z
A depends on Q R S
X depends on A B Q R S Y Z
Z depends on A B Q R S`,

`A depends on B C E F G H
B depends on C E F G H
C depends on G
D depends on A B C E F G H
E depends on F H
F depends on H`
  ];
  

  for(let i in fileNames){
    it('should output a string with the dependencies when given a filename: ' + fileNames[i], (done) =>  {
      let callback = (libraryTree) => {
        let result = lib.processTheDependencyTreeStack(libraryTree);
        assert.equal(result.join("\n"), outputs[i]);
        done();
      }
      lib.processLineByLineAndProduceLibraryTree(fileNames[i], callback)       
    });
  }

  // Deal with malformed cases

  // Deal with cases with cycles and other tricky cases.

});

/*

describe('#processTheDependencyTreeStack', function() {
  it('should  ', function() {
    assert.equal(,);
  });
});

*/
/* ERRORS */

/*
describe('Testing Error States', () => {
  it('Throws an error when called with missing arguments', () => {
    try {
      functionundertest(); // this should fail
      assert.fail('expected exception not thrown'); // this throws an AssertionError
    } catch (e) { // this catches all errors, those thrown by the function under test
                  // and those thrown by assert.fail
      if (e instanceof AssertionError) {
        // bubble up the assertion error
        throw e;
      }
      assert.equal(e.message, 'Invalid Arguments');
    }
  });
});
*/


/* LOREM IPSUM */
const unique = array => [...new Set(array)];

let loremIpsum  = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac varius massa. Maecenas eget mattis erat. Mauris luctus libero eget tortor finibus maximus eget non nulla. Nunc at maximus nisl. Praesent efficitur arcu metus, sed porttitor leo ultricies nec. Suspendisse in quam nisl. Suspendisse et auctor mi. Sed vulputate, risus id dictum tincidunt, risus ante faucibus arcu, vitae fringilla mi turpis nec erat. Suspendisse ac ex eu tortor fringilla pretium at eget arcu. Proin dapibus est ut aliquet fermentum. Pellentesque quis consectetur augue. Morbi maximus, lorem non consequat vulputate, metus libero lacinia mauris, id tempus mauris risus ac purus. Fusce."

let loremIpsumArray = unique([ 'Lorem', 'ipsum', 'dolor', 'sit', 'amet,', 'consectetur', 'adipiscing',  'elit.', 'Nulla', 'ac', 'varius', 'massa.', 'Maecenas', 'eget',  'mattis', 'erat.', 'Mauris', 'luctus',  'libero', 'eget', 'tortor', 'finibus',  'maximus', 'eget',  'non', 'nulla.', 'Nunc',  'at', 'maximus',  'nisl.', 'Praesent', 'efficitur', 'arcu', 'metus,', 'sed', 'porttitor', 'leo', 'ultricies',  'nec.',  'Suspendisse', 'in', 'quam',  'nisl.', 'Suspendisse', 'et', 'auctor', 'mi.', 'Sed',  'vulputate,',  'risus', 'id', 'dictum', 'tincidunt,', 'risus', 'ante', 'faucibus', 'arcu,', 'vitae', 'fringilla', 'mi', 'turpis', 'nec', 'erat.', 'Suspendisse', 'ac', 'ex', 'eu', 'tortor',  'fringilla', 'pretium', 'at', 'eget',  'arcu.', 'Proin', 'dapibus', 'est', 'ut', 'aliquet', 'fermentum.',  'Pellentesque', 'quis',  'consectetur', 'augue.',  'Morbi', 'maximus,', 'lorem', 'non', 'consequat',  'vulputate,',  'metus', 'libero', 'lacinia',  'mauris,', 'id', 'tempus', 'mauris', 'risus', 'ac', 'purus.', 'Fusce.' ])