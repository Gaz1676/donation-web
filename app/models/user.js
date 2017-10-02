'use strict';
// models folder is a key step in may the application perform some useful function.
// creates a new module to represent a Schema for a User model
// The accounts controller now requires this model

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);
module.exports = User;
