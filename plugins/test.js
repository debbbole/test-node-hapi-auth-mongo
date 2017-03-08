'use strict';

module.exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/test',
        handler: function (request, reply) {
            reply('Hello, test world!');
        }
    });

    next();
};

module.exports.register.attributes = {
    name: 'testHapiAuth',
    version: '0.0.1'
};