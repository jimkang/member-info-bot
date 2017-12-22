var getMemberFact = require('../get-member-fact');
var assertNoError = require('assert-no-error');
var test = require('tape');
var createProbable = require('probable').createProbable;
var seedrandom = require('seedrandom');

var testCases = [
  {
    name: 'Game',
    opts: {
      entityName: 'Legend of Zelda',
      entityType: 'game',
      probable: createProbable({ random: seedrandom('Game') })
    }
  },
  {
    name: 'Game',
    opts: {
      entityName: 'Ninja Gaiden',
      entityType: 'game',
      probable: createProbable({ random: seedrandom('Game') })
    }
  },
  {
    name: 'Band',
    opts: {
      entityName: 'Slayer',
      entityType: 'musicGroup',
      probable: createProbable({ random: seedrandom('Band') })
    }
  },
  {
    name: 'TV show',
    opts: {
      entityName: 'Adventure Time',
      entityType: 'tvShow',
      probable: createProbable({ random: seedrandom('TV show') })
    }
  },
  {
    name: 'TV show 2',
    opts: {
      entityName: 'Quantum Leap',
      entityType: 'tvShow',
      probable: createProbable({ random: seedrandom('TV show 2') })
    }
  },
  {
    name: 'Band 2',
    opts: {
      entityName: 'Migos',
      entityType: 'musicGroup',
      probable: createProbable({ random: seedrandom('Band 2') })
    }
  },
  {
    name: 'Band 3',
    opts: {
      entityName: 'The Shins',
      entityType: 'musicGroup',
      probable: createProbable({ random: seedrandom('Band 3') })
    }
  },
  {
    name: 'Band 4',
    opts: {
      entityName: 'The Ramones',
      entityType: 'musicGroup',
      probable: createProbable({ random: seedrandom('Band 4') })
    }
  },
  {
    name: 'TV show 3',
    opts: {
      entityName: 'Star Trek: The Next Generation',
      entityType: 'tvShow',
      probable: createProbable({ random: seedrandom('TV Show 3') })
    }
  },
  {
    name: 'Band with not-real words',
    opts: {
      entityName: 'Lymbyc Systym',
      entityType: 'musicGroup',
      probable: createProbable({
        random: seedrandom('Band with not-real words')
      })
    }
  },
  {
    name: 'Band with The',
    opts: {
      entityName: 'The Notorious B.I.G.',
      entityType: 'musicGroup',
      probable: createProbable({ random: seedrandom('The Notorious B.I.G.') })
    }
  },
  {
    name: 'Show with The. Should never pick "the".',
    opts: {
      entityName: 'The Carmichael Show',
      entityType: 'tvShow',
      probable: createProbable({ random: seedrandom('h') })
    }
  },
  {
    name: 'Appliance',
    opts: {
      entityName: 'butane torch',
      entityType: 'product',
      probable: createProbable({ random: seedrandom('h') })
    }
  },
  {
    name: 'Corporation',
    opts: {
      entityName: 'Akamai Technologies',
      entityType: 'corporation',
      probable: createProbable({ random: seedrandom('c3') })
    }
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
      t.ok(
        fact.length > 0,
        'Fact is not empty. (Look at fact to make sure it is OK.)'
      );
      t.end();
    }
  }
}
