const Donations = require('./app/controllers/donations');
const Assets = require('./app/controllers/assets');

module.exports = [

  { method: 'GET', path: '/', config: Donations.home },

  {
    method: 'GET',
    path: '/{param*}',
    config: { auth: false },
    handler: Assets.servePublicDirectory,
  },

  { method: 'GET', path: '/signup', config: Donations.signup },

  { method: 'GET', path: '/login', config: Donations.login },

  { method: 'GET', path: '/about', config: Donations.about },

];
