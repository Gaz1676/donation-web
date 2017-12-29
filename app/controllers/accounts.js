'use strict';

const Joi = require('joi');
const User = require('../models/user');

exports.main = {
    auth: false, // reopens all accounts routes
    handler: function (request, reply) {
        reply.view('main', { title: 'Welcome to Donations' });
    },

};

exports.signup = {
    auth: false,
    handler: function (request, reply) {
        reply.view('signup', { title: 'Sign up for Donations' });
    },

};

exports.login = {
    auth: false,
    handler: function (request, reply) {
        reply.view('login', { title: 'Login to Donations' });
    },

};

// payload: This defines a schema which defines rules that our fields must adhere to.
// failAction: This is the handler to invoke of one or more of the fields fails the validation.
exports.register = {
    validate: {
        // lays out the rules for our fields
        // firstName: begin with upper case letter and then 2+ lower case letters
        // lastName:  begin with upper case letter, then any 2+ characters
        // email: has to be unique (makes sure email is not already used)
        // password: has to be min 6 and max 20
        payload: {
            firstName: Joi.string().regex(/^[A-Z][a-z]{2,}$/).required(),
            lastName: Joi.string().regex(/^[A-Z]/).min(3).required(),
            email: Joi.string().email({ unique: true }).required(),
            password: Joi.string().min(6).max(20).required(),
        },

        // used if validation fails
        failAction: function (request, reply, source, error) {
            reply.view('signup', {
                title: 'Sign up error',
                errors: error.data.details,
            }).code(400);
        },

    },
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

// updated to consult the database when validating a user
// Here is a fragment that will accomplish this (with error handling)
exports.authenticate = {
    validate: {

        payload: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
        failAction: function (request, reply, source, error) {
            reply.view('login', {
                title: 'Login error and now',
                errors: error.data.details,
            }).code(400);
        },
    },

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
    auth: false,
    handler: function (request, reply) {
        request.cookieAuth.clear();
        reply.redirect('/');
    },
};

exports.about = {
    auth: false,
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
    // returns a promise from the save() function
    validate: {
        // lays out the rules for our fields
        // firstName: begin with upper case letter and then 2+ lower case letters
        // lastName:  begin with upper case letter, then any 2+ characters
        // email: has to be unique (makes sure email is not already used)
        // password: has to be min 6 and max 20
        payload: {
            firstName: Joi.string().regex(/^[A-Z][a-z]{2,}$/).required(),
            lastName: Joi.string().regex(/^[A-Z]/).min(3).required(),
            email: Joi.string().email({ unique: true }).required(),
            password: Joi.string().min(6).max(20).required(),
        },
        failAction: function (request, reply, source, error) {
            reply.view('settings', {
                title: 'Settings error',
                errors: error.data.details,
            }).code(400);
        },
    },
    handler: function (request, reply) {
        const editedUser = request.payload;
        const loggedInUserEmail = request.auth.credentials.loggedInUser;

        User.findOne({ email: loggedInUserEmail }).then(user => {
            user.firstName = editedUser.firstName;
            user.lastName = editedUser.lastName;
            user.email = editedUser.email;
            user.password = editedUser.password;
            return user.save();
        }).then(user => {
            reply.view('settings', { title: 'Edit Account Settings', user: user });
        }).catch(err => {
            reply.redirect('/');
        });
    },
};
