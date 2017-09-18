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
    expected: 'Slayer is a band, fronted by lead vocalist Brian Slayer.'
  },
  {
    name: 'TV show',
    opts: {
      entityName: 'Adventure Time',
      entityType: 'tvShow',
      probable: createProbable({random: seedrandom('TV show')})
    },
    expected: 'Adventure Time is a TV show, about the everyday misadventures of Liliana Adventure.'
  },
  {
    name: 'TV show 2',
    opts: {
      entityName: 'Quantum Leap',
      entityType: 'tvShow',
      probable: createProbable({random: seedrandom('TV show 2')})
    },
    expected: 'Quantum Leap is a television series, showcasing the chronicles of protagonist Brody Quantum.'
  },
  {
    name: 'Band 2',
    opts: {
      entityName: 'Migos',
      entityType: 'musicGroup',
      probable: createProbable({random: seedrandom('Band 2')})
    },
    expected: 'Migos is a ensemble, lead by main songwriter Oliver Migos.'
  },
  {
    name: 'Band 3',
    opts: {
      entityName: 'The Shins',
      entityType: 'musicGroup',
      probable: createProbable({random: seedrandom('Band 3')})
    },
    expected: 'The Shins is a musical group, lead by lead guitarist Catherine Wyatt Shin.'
  },
  {
    name: 'Band 4',
    opts: {
      entityName: 'The Ramones',
      entityType: 'musicGroup',
      probable: createProbable({random: seedrandom('Band 4')})
    },
    expected: 'The Ramones is a ensemble, fronted by lead singer Wesley Ramones.'
  },
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
