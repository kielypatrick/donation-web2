'use strict';

const Hapi = require('hapi');
const corsHeaders = require('hapi-cors-headers');
const utils = require('./app/api/utils.js');



var server = new Hapi.Server();
// const fs = require('fs');
// var options = {
//   port: 4443,     //  or any port you wish
//   tls: {
//       key: fs.readFileSync('private/webserver.key'),
//       cert: fs.readFileSync('private/webserver.crt')
//   }
// };
// server.connection(options);

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


server.register([require('inert'), require('vision'), require('hapi-auth-cookie'), require('hapi-auth-jwt2')], err => {

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

  server.auth.strategy('jwt', 'jwt', {
    key: 'secretpasswordnotrevealedtoanyone',
    validateFunc: utils.validate,
    verifyOptions: { algorithms: ['HS256'] },
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

  server.ext('onPreResponse', corsHeaders);
  server.route(require('./routes'));
  server.route(require('./routesapi'));


  server.start(err => {
    if (err) {
      throw err;
    }
    console.log('Server listening at:', server.info.uri);
  });
});
