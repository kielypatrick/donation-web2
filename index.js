'use strict';

const Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({ port: process.env.PORT || 4000 });

const initUsers = {
  'bart@simpson.com': {
    firstName: 'bart',
    lastName: 'simpson',
    email: 'bart@simpson.com',
    password: 'secret',
  },
  'lisa@simpson.com': {
    firstName: 'lisa',
    lastName: 'simpson',
    email: 'lisa@simpson.com',
    password: 'secret',
  },
};
//server.bind({  //No longer needed after mongo introduced
//  users: initUsers,
//  donations: [],
//});
require('./app/models/db');


server.register([require('inert'), require('vision'), require('hapi-auth-cookie')], err => {

  if (err) {
    throw err;
  }

  server.auth.strategy('standard', 'cookie', {
    password: 'secretpasswordnotrevealedtoanyone',
    cookie: 'donation-cookie',
    isSecure: false,
    ttl: 24 * 60 * 60 * 1000,
    redirectTo: '/login',

  });

  server.auth.default({
    strategy: 'standard',
  });

  server.views({
    engines: {
      hbs: require('handlebars'),
    },
    relativeTo: __dirname,
    path: './app/views',
    layoutPath: './app/views/layouts',
    partialsPath: './app/views/partials',
    layout: true,
    isCached: false,
  });

  server.route(require('./routes'));
  server.start(err => {
    if (err) {
      throw err;
    }
    console.log('Server listening at:', server.info.uri);
  });
});
