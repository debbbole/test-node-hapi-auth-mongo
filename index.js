'use strict';
const Hapi = require('hapi');
const Good = require('good');
const AuthBearer = require('hapi-auth-bearer-token');
const DomainUtils = require('./plugins/domainUtils');

const server = new Hapi.Server();

server.connection({ port: 3000, host: 'localhost' });

server.register(AuthBearer, (err) => {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.auth.strategy('simple', 'bearer-access-token', true, {
        allowQueryToken: true,              // optional, false by default
        allowMultipleHeaders: false,        // optional, false by default
        accessTokenName: 'access_token',    // optional, 'access_token' by default
        validateFunc: function (token, callback) {

            // For convenience, the request object can be accessed
            // from `this` within validateFunc.
            var request = this;

            DomainUtils.select(DomainUtils.namespaces.PERSON, token).then(
                function(res) {
                    return callback(null, true, { token: token }, res);
                },
                function(error) {
                    return callback(null, false, { token: token }, error);
                }
            );

        }
    });

});

server.register(require('./plugins/test'), (err) => {
    if (err) {
        server.error('Failed to load plugin:', err);
    }
});

server.register({
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
}, (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start((err) => {
        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
