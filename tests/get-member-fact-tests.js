var getMemberFact = require('../get-member-fact');
var assertNoError = require('assert-no-error');
var test = require('tape');
var createProbable = require('probable').createProbable;
var seedrandom = require('seedrandom');

var testCases = [
  {
    name: 'Band',
    opts: {
      entityName: 'Slayer',
      entityType: 'musicGroup',
      probable: createProbable({random: seedrandom('Band')})
    },
    expected: 'Slayer is a band, fronted by lead vocalist Kenneth Slayer.'
  },
  {
    name: 'TV show',
    opts: {
      entityName: 'Adventure Time',
      entityType: 'tvShow',
      probable: createProbable({random: seedrandom('TV show')})
    },
    expected: 'Adventure Time is a television show, which tells the story of the everyday misadventures of the irrepressible Keith Adventure.'
  },
  {
    name: 'TV show 2',
    opts: {
      entityName: 'Quantum Leap',
      entityType: 'tvShow',
      probable: createProbable({random: seedrandom('TV show 2')})
    },
    expected: 'Quantum Leap is a television series, about the life of protagonist Kevin Quantum.'
  },
  {
    name: 'Band 2',
    opts: {
      entityName: 'Migos',
      entityType: 'musicGroup',
      probable: createProbable({random: seedrandom('Band 2')})
    },
    expected: 'Migos is a ensemble, lead by composer Doe Migos.'
  },
  {
    name: 'Band 3',
    opts: {
      entityName: 'The Shins',
      entityType: 'musicGroup',
      probable: createProbable({random: seedrandom('Band 3')})
    },
    expected: 'The Shins is a ensemble, lead by singer Christopher Shin.'
  },
  {
    name: 'Band 4',
    opts: {
      entityName: 'The Ramones',
      entityType: 'musicGroup',
      probable: createProbable({random: seedrandom('Band 4')})
    },
    expected: 'The Ramones is a ensemble, fronted by lead singer Jaclin Ramones.'
  },
  {
    name: 'TV show 3',
    opts: {
      entityName: 'Star Trek: The Next Generation',
      entityType: 'tvShow',
      probable: createProbable({random: seedrandom('TV Show 3')})
    },
    expected: 'Star Trek: The Next Generation is a television show, centered around the escapades of Charmine Generation.'
  },
  {
    name: 'Band with not-real words',
    opts: {
      entityName: 'Lymbyc Systym',
      entityType: 'musicGroup',
      probable: createProbable({random: seedrandom('Band with not-real words')})
    },
    expected: 'Lymbyc Systym is a ensemble, lead by singer Jackelyn Lymbyc.'
  },
  {
    name: 'Band with The',
    opts: {
      entityName: 'The Notorious B.I.G.',
      entityType: 'musicGroup',
      probable: createProbable({random: seedrandom('The Notorious B.I.G.')})
    },
    expected: 'The Notorious B.I.G. is a band, formed by DJ Scott Notorious.'
  }
];

testCases.forEach(runTest);

function runTest(testCase) {
  test(testCase.name, memberFactTest);

  function memberFactTest(t) {
    getMemberFact(testCase.opts, factCheck);

    function factCheck(error, fact) {
      assertNoError(t.ok, error, 'No error while getting fact.');
      console.log(fact);
      t.equal(fact, testCase.expected, 'Fact is correct.');
      t.end();
    }
  }
}
