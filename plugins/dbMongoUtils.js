'use strict'
const UUID = require('uuid');
var Assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://node_auth:node_auth@localhost:27017/node_auth';

module.exports.insert = function(namespace, input, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            callback(err);
        } else {
            var collection = db.collection(namespace);
            input.key = UUID.v1();
            collection.insert(input, function(err, res) {
                Assert.equal(null, err);
                Assert.equal(1, res.insertedCount);
                db.close();
                var result = {
                    key : input.key,
                    token : input.token
                }
                callback(null, result);
            });
        }
    });
}

module.exports.update = function(namespace, inKey, input, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            callback(err);
        } else {
            var filter = {
                key: inKey
            };
            var updOp = {
                $set: {
                    email: input.email,
                    password: input.password
                }
            };
            var collection = db.collection(namespace);
            collection.updateOne(filter, updOp, function(err, res) {
                Assert.equal(null, err);
                Assert.equal(1, res.modifiedCount);
                db.close();
                callback(null, input.key);
            });
        }
    });
}

module.exports.query = function(namespace, inKey, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            callback(err);
        } else {
            var filter = {
                key: inKey
            };
            var collection = db.collection(namespace);
            //TODO remove "secret" fields
            collection.find(filter, {'_id':0}).next(function(err, res) {
                if (res) {
                    callback(null, res);
                } else {
                    var error = {
                        notFound: true
                    }
                    callback(error, null);
                }
            });
            db.close();
        }
    });
}

module.exports.list = function(namespace, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            callback(err);
        } else {
            var collection = db.collection(namespace);
            collection.find({}, {'_id':0}).toArray(function(err, res) {
                if (res) {
                    callback(null, res);
                } else {
                    var error = {
                        notFound: true
                    }
                    callback(error, null);
                }
            });
            db.close();
        }
    });
}

module.exports.listByExternalKey = function(namespace, extKey, callback) {
    MongoClient.connect(url, function(err, db) {
        if (err) {
            callback(err);
        } else {
            var filter = {};
            if (extKey) {
                filter[extKey.name] = extKey.value;
            }
            var collection = db.collection(namespace);
            collection.find(filter, {'_id':0}).toArray(function(err, res) {
                if (res) {
                    callback(null, res);
                } else {
                    var error = {
                        notFound: true
                    }
                    callback(error, null);
                }
            });
            db.close();
        }
    });
}

module.exports.delete = function(namespace, key, callback) {
    callback(new Error("NOT IMPLEMENTED"));
}