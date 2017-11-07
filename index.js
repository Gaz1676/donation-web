'use strict';

const Hapi = require('hapi');

let server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 4000,
  routes: {
    validate: {
      options: {
        abortEarly: false,
      },
    },
  },
});

// import of the db just created
require('./app/models/db');

// plugins registration
server.register([require('inert'), require('vision'), require('hapi-auth-cookie')], err => {

  if (err) {
    throw err;
  }

  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layout',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  // cookie plugin
  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone',
    cookie: 'donation-cookie',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000,
    redirectTo: '/login',
  });

  // strategy set to all routes
  server.auth.default({
    strategy: 'standard',
  });

  server.route(require('./routes'));

  //New route included into the application server
  server.route(require('./routesapi'));

  server.start((err) => {
    if (err) {
      throw err;
    }

    console.log('Server listening at:', server.info.uri);
  });

});
