'use strict';

const User = require('../models/user');

exports.main = {
  auth: false, // reopens all accounts routes
  handler: function (request, reply) {
    reply.view('main', { title: 'Welcome to Donations' });
  },

};

exports.signup = {
  auth: false, // reopens all accounts routes
  handler: function (request, reply) {
    reply.view('signup', { title: 'Sign up for Donations' });
  },

};

exports.login = {
  auth: false, // reopens all accounts routes
  handler: function (request, reply) {
    reply.view('login', { title: 'Login to Donations' });
  },

};

exports.register = {
  auth: false,
  handler: function (request, reply) {
    const user = new User(request.payload);

    user.save().then(newUser => {
      reply.redirect('/login');
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

//  updated to consult the database when validating a user
exports.authenticate = {
  auth: false,
  handler: function (request, reply) {
    const user = request.payload;
    User.findOne({ email: user.email }).then(foundUser => {
      if (foundUser && foundUser.password === user.password) {
        request.cookieAuth.set({
          loggedIn: true,
          loggedInUser: user.email,
        });
        reply.redirect('/home');
      } else {
        reply.redirect('/signup');
      }
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.logout = {
  auth: false, // reopens all accounts routes
  handler: function (request, reply) {
    request.cookieAuth.clear();
    reply.redirect('/');
  },
};

exports.about = {
  auth: false, // reopens all accounts routes
  handler: function (request, reply) {
    reply.view('about', { title: 'About Donations' });
  },

};

exports.viewSettings = {

  // read from the database to get the user details
  // render these to the view (sending the user to the start page if there is an error):

  handler: function (request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: userEmail }).then(foundUser => {
      reply.view('settings', { title: 'Edit Account Settings', user: foundUser });
    }).catch(err => {
      reply.redirect('/');
    });
  },

};

exports.updateSettings = {

  // reads user details from the database
  // updates with new values entered by the user
  // Here is a fragment that will accomplish this (without error handling)
  // returns a promise from the save() function
  // re renders the updated user details to the settings view.

  handler: function (request, reply) {
    const editedUser = request.payload;
    let loggedInUserEmail = request.auth.credentials.loggedInUser;
    User.findOne({ email: loggedInUserEmail }).then(user => {
      user.firstName = editedUser.firstName;
      user.lastName = editedUser.lastName;
      user.email = editedUser.email;
      user.password = editedUser.password;
      return user.save();
    }).then(user => {
      reply.view('settings', { title: 'Edit Account Settings', user: user });
    });
  },
};
