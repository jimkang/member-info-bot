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
    [10, 'lead'],
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
    [3, 'the adventures of'],
    [5, 'the life of'],
    [1, 'the celebrated life of'],
    [3, 'the everyday misadventures of'],
    [1, 'the escapades of'],
    [1, 'the foibles of'],
    [5, 'the story of'],    
  ]);

  var optionalCharDescTable = probable.createTableFromSizes([
    [10, ''],
    [5, 'main character '],
    [2, 'the irrepressible '],
    [3, 'protagonist ']
  ]);

  var originalNouns;

  waterfall(
    [
      curry(nounfinder.getNounsFromText)(entityName),
      filterNounsByFrequency,
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

  function makeFact(nameBase, done) {
    var assembleBlurb = assembleMusicGroupBlurb;
    if (entityType === 'tvShow') {
      assembleBlurb = assembleTVShowBlurb;
    }
    var blurb = assembleBlurb(entityName, assembleMemberName(nameBase));
    callNextTick(done, null, blurb);
  }

  function assembleMemberName(base) {
    var name;
    if (probable.roll(3) === 0) {
      name = probable.pickFromArray(commonFirstNames);
    }
    else if (probable.roll(100) === 0) {
      name = probable.pickFromArray(extraFirstNames);
    }
    else {
      name = probable.pickFromArray(firstNames);
    }
    
    // if (probable.roll(8) === 0) {
    //   name += ' ' + probable.pickFromArray(firstNames);
    // }
    name += ' ' + base;
    return titleCase(name);
  }

  function assembleMusicGroupBlurb(entity, memberName) {
    return `${entity} is a ${groupTable.roll()}, ${bandLeadingVerbTable.roll()} by ${bandRoleTable.roll()} ${memberName}.`;
  }

  function assembleTVShowBlurb(entity, memberName) {
    return `${entity} is a ${showSynonymTable.roll()}, ${showLeadingWordTable.roll()} ${chroniclesTable.roll()} ${optionalCharDescTable.roll()}${memberName}.`;
  }
}

module.exports = getMemberFact;
