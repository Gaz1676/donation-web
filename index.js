'use strict';

const Hapi = require('hapi');
const corsHeaders = require('hapi-cors-headers');
const utils = require('./app/api/utils');

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
server.register([require('inert'), require('vision'), require('hapi-auth-cookie'), require('hapi-auth-jwt2')], err => {

    if (err) {
      throw err;
    }

    // assign handlebars engine for views to the server
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

    server.auth.strategy('jwt', 'jwt', {
        key: 'secretpasswordnotrevealedtoanyone',
        validateFunc: utils.validate,
        verifyOptions: { algorithms: ['HS256'] },
      });

    // enable the facility with default options
    server.ext('onPreResponse', corsHeaders);

    // route into the application server
    server.route(require('./routes'));

    // new api route included into the application server
    server.route(require('./routesapi'));

    server.start((err) => {
        if (err) {
          throw err;
        }

        console.log('Server listening at:', server.info.uri);
      });

  });
