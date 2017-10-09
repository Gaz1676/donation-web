'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// changed to localhost:12345
//let dbURI = 'mongodb://donationuser:donationuser@ds113925.mlab.com:13925/donation-web';

let dbURI = 'mongodb://localhost:12345/donation';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

// This will establish a connection to the database.
