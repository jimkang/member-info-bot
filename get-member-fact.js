
var config = require('./config');
var callNextTick = require('call-next-tick');
var Nounfinder = require('nounfinder');
var firstNames = require('./first-names');
var titleCase = require('titlecase');
var sb = require('standard-bail')();
var splitToWords = require('split-to-words');

var nounfinder = Nounfinder({
  wordnikAPIKey: config.wordnikAPIKey
});

function getMemberFact({entityName, entityType, probable}, done) {
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
    [4, 'DJ'],
    [5, 'MC']
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
    [4, 'about']
  ]);

  var chroniclesTable = probable.createTableFromSizes([
    [3, 'the adventures of'],
    [2, 'the chronicles of'],
    [5, 'the life of'],
    [3, 'the everyday misadventures of'],
    [1, 'the escapades of']
  ]);

  var optionalCharDescTable = probable.createTableFromSizes([
    [10, ''],
    [5, 'main character '],
    [2, 'the irrespressible '],
    [3, 'protagonist ']
  ]);

  nounfinder.getNounsFromText(entityName, sb(makeFact, done));

  function makeFact(nouns) {
    // console.log('nouns', nouns)
    var nameBase;

    if (!nouns || nouns.length < 1) {
      nameBase = probable.pickFromArray(splitToWords(entityName));
    }
    else if (nouns.length === 1) {
      nameBase = nouns[0];
    }
    else {
      nameBase = probable.pickFromArray(nouns);
    }

    var assembleBlurb = assembleMusicGroupBlurb;
    if (entityType === 'tvShow') {
      assembleBlurb = assembleTVShowBlurb;
    }
    var blurb = assembleBlurb(entityName, assembleMemberName(nameBase));
    callNextTick(done, null, blurb);
  }

  function assembleMemberName(base) {
    var name = probable.pickFromArray(firstNames);
    if (probable.roll(8) === 0) {
      name += ' ' + probable.pickFromArray(firstNames);
    }
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
