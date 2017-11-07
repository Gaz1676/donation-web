'use strict';

const Candidate = require('../models/candidate');
const Boom = require('boom');

exports.find = {

  auth: false,

  handler: function (request, reply) {
    Candidate.find({}).exec().then(candidates => {
      reply(candidates);
    }).catch(err => {
      reply(Boom.badImplementation('error accessing db'));
    });
  },

};

/*exports.findOne = {

  auth: false,

  handler: function (request, reply) {
    Candidate.findOne({ _id: request.params.id }).then(candidate => {
      reply(candidate);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },
};*/

// Error when running above code during testing
// This is a concocted id, but the request is succeeding, but returning null.
// This is what is causing our utilities to generate an error in the test client.
// An alternative version of findOne to fix the issue
// The findOne query will generate an exception if the key is an invalid length,
// But will return a null object if it fails to find a matching object for a correctly formed key.

exports.findOne = {

  auth: false,

  handler: function (request, reply) {
    Candidate.findOne({ _id: request.params.id }).then(candidate => {
      if (candidate != null) {
        reply(candidate);
      } else {
        reply(Boom.notFound('id not found'));}
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};

exports.create = {

  auth: false,

  handler: function (request, reply) {
    const candidate = new Candidate(request.payload);
    candidate.save().then(newCandidate => {
      reply(newCandidate).code(201);
    }).catch(err => {
      reply(Boom.badImplementation('error creating candidate'));
    });
  },

};

exports.deleteAll = {

  auth: false,

  handler: function (request, reply) {
    Candidate.remove({}).then(err => {
      reply().code(204);
    }).catch(err => {
      reply(Boom.badImplementation('error removing candidates'));
    });
  },

};

exports.deleteOne = {

  auth: false,

  handler: function (request, reply) {
    Candidate.remove({ _id: request.params.id }).then(candidate => {
      reply(candidate).code(204);
    }).catch(err => {
      reply(Boom.notFound('id not found'));
    });
  },

};
