/*'use strict';

const assert = require('chai').assert;
var request = require('sync-request');

suite('Candidate API tests', function () {

  test('get candidates', function () {

        const url = 'http://localhost:4000/api/candidates';
        var res = request('GET', url);
        const candidates = JSON.parse(res.getBody('utf8'));

        assert.equal(2, candidates.length);

        assert.equal(candidates[0].firstName, 'Lisa');
        assert.equal(candidates[0].lastName, 'Simpson');
        assert.equal(candidates[0].office, 'President');

        assert.equal(candidates[1].firstName, 'Ned');
        assert.equal(candidates[1].lastName, 'Flanders');
        assert.equal(candidates[1].office, 'President');

      }
  );
  test('get one candidate', function () {

        const allCandidatesUrl = 'http://localhost:4000/api/candidates';
        var res = request('GET', allCandidatesUrl);
        const candidates = JSON.parse(res.getBody('utf8'));

        const oneCandidateUrl = allCandidatesUrl + '/' + candidates[0]._id;
        res = request('GET', oneCandidateUrl);
        const oneCandidate = JSON.parse(res.getBody('utf8'));

        assert.equal(oneCandidate.firstName, 'Lisa');
        assert.equal(oneCandidate.lastName, 'Simpson');
        assert.equal(oneCandidate.office, 'President');

      }
  );
  test('create a candidate', function () {

    const candidatesUrl = 'http://localhost:4000/api/candidates';
    const newCandidate = {
      firstName: 'Barnie',
      lastName: 'Grumble',
      office: 'President',
    };

    const res = request('POST', candidatesUrl, { json: newCandidate });
    const returnedCandidate = JSON.parse(res.getBody('utf8'));

    assert.equal(returnedCandidate.firstName, 'Barnie');
    assert.equal(returnedCandidate.lastName, 'Grumble');
    assert.equal(returnedCandidate.office, 'President');

  });
});*/

/*// replaces above testing code

'use strict';

const assert = require('chai').assert;
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');

suite('Candidate API tests', function () {

  let candidates = fixtures.candidates;
  let newCandidate = fixtures.newCandidate;

  const donationService = new DonationService('http://localhost:4000');

  test('create a candidate', function () {
    const returnedCandidate = donationService.createCandidate(newCandidate);
    assert.equal(returnedCandidate.firstName, newCandidate.firstName);
    assert.equal(returnedCandidate.lastName, newCandidate.lastName);
    assert.equal(returnedCandidate.office, newCandidate.office);
    assert.isDefined(returnedCandidate._id);
  });
});*/

/*
// simplified code from above but fails
// The returned object contains the fields as expected,
// But also additional, legitimate fields that cause the equals test to fail.

'use strict';

const assert = require('chai').assert;
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');

suite('Candidate API tests', function () {

  let candidates = fixtures.candidates;
  let newCandidate = fixtures.newCandidate;

  const donationService = new DonationService('http://localhost:4000');

  test('create a candidate', function () {
    const returnedCandidate = donationService.createCandidate(newCandidate);
    assert.equal(returnedCandidate, newCandidate);
    assert.isDefined(returnedCandidate._id);
  });
});
*/

// We need a comparison that will test to see if the returnedCandidate
// Is a superset of the newCandidate object.
// It is here where we install lodash library
// Require is at the top of our test (const _ = require('lodash');)

'use strict';

const assert = require('chai').assert;
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Candidate API tests', function () {

  let candidates = fixtures.candidates;
  let newCandidate = fixtures.newCandidate;

  const donationService = new DonationService('"https://stormy-brushlands-56991.herokuapp.com');

  // const donationService = new DonationService('http://localhost:4000');

  // These are run before and after each test
  // Clearing our the candidates model so that each test can be considered completely independently.

  beforeEach(function () {
    donationService.deleteAllCandidates();
  });

  afterEach(function () {
    donationService.deleteAllCandidates();
  });

  // a new test code on creation of a candidate
  test('create a candidate', function () {
    const returnedCandidate = donationService.createCandidate(newCandidate);
    assert(_.some([returnedCandidate], newCandidate), 'returnedCandidate must be a superset of newCandidate');
    assert.isDefined(returnedCandidate._id);
  });

  test('get candidate', function () {
    const c1 = donationService.createCandidate(newCandidate);
    const c2 = donationService.getCandidate(c1._id);
    assert.deepEqual(c1, c2);
  });

  test('get invalid candidate', function () {
    const c1 = donationService.getCandidate('1234');
    assert.isNull(c1);
    const c2 = donationService.getCandidate('012345678901234567890123');
    assert.isNull(c2);
  });

  // a new test to verify delete
  test('delete a candidate', function () {
    const c = donationService.createCandidate(newCandidate);
    assert(donationService.getCandidate(c._id) != null);
    donationService.deleteOneCandidate(c._id);
    assert(donationService.getCandidate(c._id) == null);
  });

  test('get all candidates', function () {
    for (let c of candidates) {
      donationService.createCandidate(c);
    }

    const allCandidates = donationService.getCandidates();
    assert.equal(allCandidates.length, candidates.length);
  });

  test('get candidates detail', function () {
    for (let c of candidates) {
      donationService.createCandidate(c);
    }

    const allCandidates = donationService.getCandidates();
    for (let i = 0; i < candidates.length; i++) {
      assert(_.some([allCandidates[i]], candidates[i]), 'returnedCandidate must be a superset of newCandidate');
    }
  });

  test('get all candidates empty', function () {
    const allCandidates = donationService.getCandidates();
    assert.equal(allCandidates.length, 0);
  });
});

