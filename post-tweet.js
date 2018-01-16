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
var StaticWebArchiveOnGit = require('static-web-archive-on-git');
var queue = require('d3-queue').queue;
var randomId = require('idmaker').randomId;

var staticWebStream = StaticWebArchiveOnGit({
  config: config.github,
  title: '@memberfacts archives',
  footerScript: `<script type="text/javascript">
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-49491163-1', 'jimkang.com');
  ga('send', 'pageview');
</script>`,
  maxEntriesPerPage: 50
});

var kindOfThingTable = probable.createTableFromSizes([
  [3, { entityType: 'musicGroup', entityNameSources: [popularArtists] }],
  [9, { entityType: 'tvShow', entityNameSources: [tvShows] }],
  [
    9,
    {
      entityType: 'product',
      entityNameSources: probable.createTableFromSizes([
        [5, appliances],
        [3, objects],
        [2, clothes]
      ]).roll
    }
  ],
  [5, { entityType: 'corporation', entityNameSources: [corporations] }],
  [9, { entityType: 'game', entityNameSources: [games] }]
]);

var dryRun = false;
if (process.argv.length > 2) {
  dryRun = process.argv[2].toLowerCase() == '--dry';
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
  } else if (Array.isArray(entityNameSource)) {
    entityName = probable.pickFromArray(
      probable.pickFromArray(entityNameSource)
    );
  } else {
    throw new Error('Unusable entityNameSource type.');
  }

  var getMemberFactOpts = {
    probable: probable,
    entityType: kindOfThing.entityType,
    entityName
  };

  getMemberFact(getMemberFactOpts, sb(postToTargets, wrapUp));
}

function postToTargets(text, done) {
  var q = queue();
  q.defer(postTweet, text);
  q.defer(postToArchive, text);
  q.await(done);
}

function postTweet(text, done) {
  if (dryRun) {
    console.log('Would have tweeted:', text);
    callNextTick(done);
  } else {
    var body = {
      status: text
    };
    twit.post('statuses/update', body, done);
  }
}

function postToArchive(text, done) {
  var id = 'fact-' + randomId(8);
  staticWebStream.write({
    id,
    date: new Date().toISOString(),
    caption: text
  });
  staticWebStream.end(done);
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
  } else {
    console.log('Completed.');
  }
}

run();
