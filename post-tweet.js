/* global process */

var config = require('./config');
var Twit = require('twit');
var getMemberFact = require('./get-member-fact');
var sb = require('standard-bail')();
var probable = require('probable');
var callNextTick = require('call-next-tick');
var popularArtists = require('./data/popular-artists-without-first-names.json');
var tvShows = require('./data/shownames-without-first-names.json');
var appliances = require('./data/corpora-appliances.json');
var objects = require('./data/corpora-objects.json');
var clothes = require('./data/corpora-clothes.json');
var corporations = require('./data/corpora-corporations.json');
var games = require('./data/games.json');

var kindOfThingTable = probable.createTableFromSizes([
  [3, {entityType: 'musicGroup', entityNameSources: [popularArtists]}],
  [9, {entityType: 'tvShow', entityNameSources: [tvShows]}],
  [
    9,
    {
      entityType: 'product',
      entityNameSources: probable.createTableFromSizes([
        [5, appliances], 
        [3, objects],
        [2, clothes]
      ])
      .roll
    }
  ],
  [5, {entityType: 'corporation', entityNameSources: [corporations]}],
  [6, {entityType: 'game', entityNameSources: [games]}]
]);

var dryRun = false;
if (process.argv.length > 2) {
  dryRun = (process.argv[2].toLowerCase() == '--dry');
}

var tryLimit = 10;
var tries = 0;

var twit = new Twit(config.twitter);

function run() {
  tries += 1;
  var kindOfThing = kindOfThingTable.roll();
  var entityNameSource = kindOfThing.entityNameSources;
  var entityName;

  if (typeof entityNameSource === 'function') {
    entityName = entityNameSource();
  }
  else if (Array.isArray(entityNameSource)) {
    entityName = probable.pickFromArray(probable.pickFromArray(entityNameSource));
  }
  else {
    throw new Error('Unusable entityNameSource type.');
  }

  var getMemberFactOpts = {
    probable: probable,
    entityType: kindOfThing.entityType,
    entityName
  };

  getMemberFact(getMemberFactOpts, sb(postTweet, wrapUp));
}

function postTweet(text, done) {
  if (dryRun) {
    console.log('Would have tweeted:', text);
    callNextTick(done);
  }
  else {
    var body = {
      status: text
    };
    twit.post('statuses/update', body, done);
  }
}

function wrapUp(error, data) {
  if (error) {
    console.log(error, error.stack);

    if (data) {
      console.log('data:', data);
    }
    if (tries < tryLimit) {
      // Try again.
      callNextTick(run);
    }
  }
  else {
    console.log('Completed.');
  }
}

run();
