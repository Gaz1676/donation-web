'use strict';

// donate and report routes can then be updated to use this model

const Donation = require('../models/donation');

exports.home = {

  handler: function (request, reply) {
    reply.view('home', { title: 'Make a Donation' });
  },

};

exports.report = {

  handler: function (request, reply) {
    Donation.find({}).exec().then(allDonations => {
      reply.view('report', {
        title: 'Donations to Date',
        donations: allDonations,
      });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};
exports.donate = {
  // When we create a donation, we will insert the current users email as the donor
  handler: function (request, reply) {
    let data = request.payload;
    data.donor = request.auth.credentials.loggedInUser; //
    const donation = new Donation(data);
    donation.save().then(newDonation => {
      reply.redirect('/report');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};
