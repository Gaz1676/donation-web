'use strict';

// donate and report routes can then be updated to use this model
const Donation = require('../models/donation');
const User = require('../models/user');
const Candidate = require('../models/candidate');
const Joi = require('joi');

// home view - pass the list of candidates to the view
// enables the user to select which candidate to make a donation
exports.home = {

    handler: function (request, reply) {
        Candidate.find({}).then(candidates => {
            reply.view('home', {
                title: 'Make a Donation',
                candidates: candidates,
            });
        }).catch(err => {
            reply.redirect('/');
        });
    },

};

// ensures that the donor object will be retrieve on the single query
// thus our donor object should successfully resolve in the form.
exports.report = {

    handler: function (request, reply) {
        Donation.find({}).populate('donor').populate('candidate').then(allDonations => {
            let total = 0;
            allDonations.forEach(donation => {
                total += donation.amount;
            });
            reply.view('report', {
                title: 'Donations to Date',
                donations: allDonations,
                total: total,
            });
        }).catch(err => {
            reply.redirect('/');
        });
    },
};

// Creating a donation is more complex, as we have to locate the current user in the database
// only when these three queries are performed can we create and insert a new donation object
// abortEarly: false returns all the errors found during validation
// returns a promise from the save() function
exports.donate = {
    validate: {

        payload: {
            amount: Joi.number().required(),
            method: Joi.string().required(),
            candidate: Joi.string().required(),
        },

        failAction: function (request, reply, source, error) {
            Candidate.find({}).then(candidates => {
                reply.view('home', {
                    title: 'Invalid Donation',
                    candidates: candidates,
                    errors: error.data.details,
                }).code(400);
            }).catch(err => {
                reply.redirect('/');
            });
        },
    },
    handler: function (request, reply) {
        let userEmail = request.auth.credentials.loggedInUser;
        let userId = null;
        let donation = null;
        User.findOne({ email: userEmail }).then(user => {
            let data = request.payload;
            userId = user._id;
            donation = new Donation(data);
            const rawCandidate = request.payload.candidate.split(',');
            return Candidate.findOne({ lastName: rawCandidate[0], firstName: rawCandidate[1] });
        }).then(candidate => {
            donation.donor = userId;
            donation.candidate = candidate._id;
            return donation.save();
        }).then(newDonation => {
            reply.redirect('/report');
        }).catch(err => {
            reply.redirect('/');
        });
    },
};
