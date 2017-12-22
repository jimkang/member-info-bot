var config = require('./config');
var callNextTick = require('call-next-tick');
var Nounfinder = require('nounfinder');
var firstNames = require('./first-names');
var commonFirstNames = require('./common-first-names');
var extraFirstNames = require('./data/additional-first-names');
var titleCase = require('titlecase');
var splitToWords = require('split-to-words');
var waterfall = require('async-waterfall');
var curry = require('lodash.curry');
var iscool = require('iscool')({
  customBlacklist: [
    'the',
    'a',
    'an',
    'to'
  ]
});

const maxNounCommonnness = 150;

var nounfinder = Nounfinder({
  wordnikAPIKey: config.wordnikAPIKey
});

function getMemberFact({entityName, entityType, probable}, getMemberFactDone) {
  var groupTable = probable.createTableFromSizes([
    [3, 'band'],
    [10, 'musical group'],
    [4, 'ensemble']
  ]);
  var bandLeadingVerbTable = probable.createTableFromSizes([
    [10, 'led'],
    [3, 'founded'],
    [2, 'created'],
    [4, 'fronted'],
    [5, 'formed']
  ]);
  var bandRoleTable = probable.createTableFromSizes([
    [7, 'singer'],
    [7, 'lead singer'],
    [5, 'lead guitarist'],
    [2, 'composer'],
    [3, 'main songwriter'],
    [8, 'lead vocalist'],
    [3, 'DJ'],
    [1, 'MC']
  ]);

  var showSynonymTable = probable.createTableFromSizes([
    [7, 'television series'],
    [7, 'television show'],
    [5, 'TV show'],
    [2, 'YouTube series']
  ]);

  var showLeadingWordTable = probable.createTableFromSizes([
    [5, 'featuring'],
    [2, 'centered around'],
    [2, 'showcasing'],
    [4, 'about'],
    [2, 'chronicling']
  ]);

  var chroniclesTable = probable.createTableFromSizes([
    [3, 'depicts the adventures of'],
    [3, 'depicts the misadventures of'],
    [5, 'is about the life of'],
    [5, 'is the story of'],    
  ]);

  var optionalCharDescTable = probable.createTableFromSizes([
    [10, ''],
    [5, 'main character '],
    [2, 'the irrepressible '],
    [3, 'protagonist ']
  ]);

  var inventedTable = probable.createTableFromSizes([
    [10, 'invented'],
    [5, 'created'],
    [1, 'dreamed up'],
    [5, 'discovered']
  ]);

  var foundedTable = probable.createTableFromSizes([
    [10, 'founded'],
    [5, 'built from the ground up'],
    [8, 'started']
  ]);

  var gamePlayingPhraseTable = probable.createTableFromSizes([
    [1, 'you play as the hero,'],
    [1, 'you play as the main guy,'],
    [1, 'you are the brave'],
    [1, 'you are the intrepid']
  ]);

  var nameKindTable = probable.createTableFromSizes([
    [1, extraFirstNames],
    [79, commonFirstNames],
    [20, firstNames] // A broad selection of first names.
  ]);

  var prefixTable = probable.createTableFromSizes([
    [90, ''],
    [6, 'Fact: '],
    [1, 'Fact! '],
    [3, 'Did you know? ']
  ]);

  var punctuationTable = probable.createTableFromSizes([
    [50, '.'],
    [40, '!']
  ]);

  var originalNouns;

  waterfall(
    [
      curry(nounfinder.getNounsFromText)(entityName),
      entityType === 'corporation' ? reduceToNonKnownNouns : filterNounsByFrequency,
      pickFromFiltered,
      makeFact
    ],
    getMemberFactDone
  );

  function filterNounsByFrequency(nouns, done) {
    originalNouns = nouns;
    nounfinder.filterNounsForInterestingness(nouns, maxNounCommonnness, done);
  }

  function pickFromFiltered(filteredNouns, done) {
    var picked;
    var choices;

    if (!filteredNouns || filteredNouns.length < 1) {
      console.log('Filtered ALL nouns from text.');
      choices = originalNouns;
    }
    else {
      choices = filteredNouns;
    }

    if (!choices || choices.length < 1) {
      picked = probable.pickFromArray(splitToWords(entityName).filter(iscool));
    }
    else if (choices.length === 1) {
      picked = choices[0];
    }
    else {
      picked = probable.pickFromArray(choices);
    }          

    done(null, picked);
  }

  // For corporations, do not filter out non-known nouns.
  // In fact, try to choose from those words that are not.
  function reduceToNonKnownNouns(nouns, done) {
    var choices;
    var originalWords = splitToWords(entityName);
    if (nouns.length > 0 && nouns.length < originalWords.length) {
      choices = originalWords.reduce(addIfNotInNouns, []);
    }
    else {
      choices = originalWords;
    }
    callNextTick(done, null, choices);

    function addIfNotInNouns(goodList, word) {
      if (nouns.indexOf(word.toLowerCase()) === -1) {
        goodList.push(word);
      }
      return goodList;
    }
  }

  function makeFact(nameBase, done) {
    var skipFirstName = false;
    var assembleBlurb = assembleMusicGroupBlurb;
    if (entityType === 'tvShow') {
      assembleBlurb = assembleTVShowBlurb;
    }
    else if (entityType === 'product') {
      assembleBlurb = assembleProductBlurb;
    }
    else if (entityType === 'corporation') {
      assembleBlurb = assembleCorporationBlurb;
    }
    else if (entityType === 'game') {
      skipFirstName = probable.roll(2) === 0;
      assembleBlurb = assembleGameBlurb;
    }
    var blurb = assembleBlurb(entityName, assembleMemberName(nameBase, skipFirstName));
    callNextTick(done, null, blurb);
  }

  function assembleMemberName(base, skipFirstName) {
    var name = base;
    if (!skipFirstName) {
      name = nameKindTable.roll();
      name += ' ' + base;
    }
    return titleCase(name);
  }

  function assembleMusicGroupBlurb(entity, memberName) {
    return `${prefixTable.roll()}${entity} is a ${groupTable.roll()} ${bandLeadingVerbTable.roll()} by ${bandRoleTable.roll()} ${memberName}${punctuationTable.roll()}`;
  }

  function assembleTVShowBlurb(entity, memberName) {
    return `${prefixTable.roll()}${entity} is a ${showSynonymTable.roll()}. It ${chroniclesTable.roll()} ${optionalCharDescTable.roll()}${memberName}${punctuationTable.roll()}`;
  }

  function assembleProductBlurb(entity, memberName) {
    return `${prefixTable.roll()}The ${entity} was ${inventedTable.roll()} by ${memberName}${punctuationTable.roll()}`;
  }

  function assembleCorporationBlurb(entity, memberName) {
    return `${prefixTable.roll()}${entity} was ${foundedTable.roll()} by ${memberName}${punctuationTable.roll()}`;
  }

  function assembleGameBlurb(entity, memberName) {
    return `${prefixTable.roll()}In the video game ${entity}, ${gamePlayingPhraseTable.roll()} ${memberName}${punctuationTable.roll()}`;
  }
}

module.exports = getMemberFact;
