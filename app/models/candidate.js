'use strict';

//  new schema to represent a Candidate in our app
const mongoose = require('mongoose');

const candidateSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    office: String,
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;
