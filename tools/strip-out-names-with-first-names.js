/* global process, __dirname */

// node strip-out-names-with-first-names.js input.json > new.json

var fs = require('fs');
var splitToWords = require('split-to-words');
var firstNames = require('../first-names').map(name => name.toLowerCase());
var commonFirstNames = require('../common-first-names').map(name => name.toLowerCase());
firstNames = commonFirstNames.concat(firstNames);

var doNotCountAsFirstNames = [
  'star',
  'abbey',
  'angel',
  'sunshine',
  'candy',
  'gates',
  'rich',
  'raven',
  'de',
  'happy',
  'atlanta',
  'bliss'
];

var names = JSON.parse(fs.readFileSync(process.argv[2]));
names = names.filter(doesNotHaveAFirstName);
console.log(JSON.stringify(names, null, 2));

function doesNotHaveAFirstName(name) {
  var words = splitToWords(name);
  // console.error(name, 'does not have a first name:', words.every(wordIsNotAFirstName));
  return words.every(wordIsNotAFirstName);

  function wordIsNotAFirstName(word) {
    var lowerCaseWord = word.toLowerCase();
    if (doNotCountAsFirstNames.indexOf(lowerCaseWord) !== -1 ||
      firstNames.indexOf(lowerCaseWord) === -1) {

      return true;
    }
    else {
      console.error(name, 'contains a first name!');
      return false;
    }
  }
}
