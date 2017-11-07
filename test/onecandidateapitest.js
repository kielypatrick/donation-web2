'use strict';

const assert = require('chai').assert;
var request = require('sync-request');

suite('Candidate API tests', function () {

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

  });
});