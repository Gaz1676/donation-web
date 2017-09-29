'use strict';

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
  auth: false, // reopens all accounts routes
  handler: function (request, reply) {
    const user = request.payload;
    this.users[user.email] = user;
    reply.redirect('/login');
  },

};

exports.authenticate = {
  auth: false, // reopens all accounts routes
  handler: function (request, reply) {
    const user = request.payload;
    if ((user.email in this.users) && (user.password === this.users[user.email].password)) {
      request.cookieAuth.set({
        loggedIn: true,
        loggedInUser: user.email,
      });
      reply.redirect('/home');
    } else {
      reply.redirect('/signup');
    }
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
  handler: function (request, reply) {
    let userEmail = request.auth.credentials.loggedInUser;
    reply.view('settings', {
      title: 'Update your settings',
      user: this.users[userEmail],
    });
  },

};

exports.updateSettings = {
  handler: function (request, reply) {
    let user = request.payload;
    let loggedInUser = request.auth.credentials.loggedInUser;
    this.users[loggedInUser] = user;
    reply.redirect('/settings');
  },
};
