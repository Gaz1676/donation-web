'use strict';

const assert = require('chai').assert;
const DonationService = require('./donation-service');
const fixtures = require('./fixtures.json');
const _ = require('lodash');

suite('Donation API tests', function () {

    let donations = fixtures.donations;
    let newCandidate = fixtures.newCandidate;
    let users = fixtures.users;

    const donationService = new DonationService(fixtures.donationService);

    beforeEach(function () {
        donationService.login(users[0]);
        donationService.deleteAllCandidates();
        donationService.deleteAllDonations();
      });

    afterEach(function () {
        donationService.deleteAllCandidates();
        donationService.deleteAllDonations();
        donationService.logout();
      });

    //=================Create Donations
    test('create a donation', function () {
        const returnedCandidate = donationService.createCandidate(newCandidate);
        donationService.makeDonation(returnedCandidate._id, donations[0]);
        const returnedDonations = donationService.getDonations(returnedCandidate._id);
        assert.equal(returnedDonations.length, 1);
        assert(_.some([returnedDonations[0]], donations[0]), 'returned donation must be a superset of donation');
      });

    //=================Create Multi Donations
    test('create multiple donations', function () {
        const returnedCandidate = donationService.createCandidate(newCandidate);
        for (let i = 0; i < donations.length; i++) {
          donationService.makeDonation(returnedCandidate._id, donations[i]);
        }

        const returnedDonations = donationService.getDonations(returnedCandidate._id);
        assert.equal(returnedDonations.length, donations.length);
        for (let i = 0; i < donations.length; i++) {
          assert(_.some([returnedDonations[i]], donations[i]), 'returned donation must be a superset of donation');
        }
      });


    //=================Delete Candidate Donation
    test('delete donations', function () {
        const returnedCandidate = donationService.createCandidate(newCandidate);
        for (let i = 0; i < donations.length; i++) {
          donationService.makeDonation(returnedCandidate._id, donations[i]);
        }

        const d1 = donationService.getDonations(returnedCandidate._id);
        assert.equal(d1.length, donations.length);
        donationService.deleteDonations(returnedCandidate._id);
        const d2 = donationService.getDonations(returnedCandidate._id);
        assert.equal(d2.length, 0);
      });

    //=================Delete All Donations
    test('delete all donations', function () {
        const returnedCandidate = donationService.createCandidate(newCandidate);
        for (let i = 0; i < donations.length; i++) {
          donationService.makeDonation(returnedCandidate._id, donations[i]);
        }

        const d1 = donationService.getDonations(returnedCandidate._id);
        assert.equal(d1.length, donations.length);
        donationService.deleteAllDonations();
        const d2 = donationService.getDonations(returnedCandidate._id);
        assert.equal(d2.length, 0);
      });
  });
