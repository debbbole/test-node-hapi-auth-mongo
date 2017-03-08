'use strict'
const dbUtils = require('./dbMongoUtils');
const Crypto = require('crypto');
const Base64Url = require('base64url');

function buildResponse(obj, resCode) {
    return {
        code : resCode,
        result : obj
    }
}

module.exports.namespaces = {
    PERSON : "person"
}

module.exports.generateToken = function(byteSize) {
    if (!byteSize) {
        byteSize = 20;
    }
    return Base64Url(Crypto.randomBytes(byteSize));
}

module.exports.store = function(NAMESPACE, input) {
    return new Promise(function(resolve, reject) {
        dbUtils.insert(NAMESPACE, input, function(err, value) {
            if (err) {
                console.error(err);
                var res = {
                    status : "error"
                };
                return reject(buildResponse(res, 500));
            } else {
                console.log("created " + NAMESPACE + " object: " + value.key);
                var res = {
                    status : "ok",
                    result : {
                        key : value.key,
                        token : value.token
                    }
                };
                return resolve(buildResponse(res, 201));
            }
        });
    });
}

module.exports.update = function(NAMESPACE, id, input) {
    return new Promise(function(resolve, reject) {
        dbUtils.update(NAMESPACE, id, input, function(err) {
            if (err) {
                console.error(err);
                var res = {
                    status : "error"
                };
                return reject(buildResponse(res, 500));
            } else {
                console.log("updated object: " + id);
                var res = {
                    status : "ok"
                };
                return resolve(buildResponse(res, 200));
            }
        });
    });
}

module.exports.select = function(NAMESPACE, id) {
    return new Promise(function(resolve, reject) {
        dbUtils.query(NAMESPACE, id, function(err, value) {
            if (err) {
                var statusMsg = "error";
                var statusCode = 500;
                if (err.notFound) {
                    statusMsg = "not found";
                    statusCode = 404;
                }
                var res = {
                    status: statusMsg
                }
                return reject(buildResponse(res, statusCode));
            } else {
                var res = {
                    status: "ok",
                    result: value
                };
                return resolve(buildResponse(res, 200));
            }
        });
    });
}

module.exports.list = function(NAMESPACE) {
    return new Promise(function(resolve, reject) {
        dbUtils.list(NAMESPACE, function(err, value) {
            if (err) {
                var statusMsg = "error";
                var statusCode = 500;
                if (err.notFound) {
                    statusMsg = "not found";
                    statusCode = 404;
                }
                var res = {
                    status: statusMsg
                }
                return reject(buildResponse(res, statusCode));
            } else {
                var res = {
                    status: "ok",
                    result: value
                };
                return resolve(buildResponse(res, 200));
            }
        });
    });
}

module.exports.listByExternalKey = function(NAMESPACE, extKey) {
    return new Promise(function(resolve, reject) {
        dbUtils.listByExternalKey(NAMESPACE, extKey, function(err, value) {
            if (err) {
                var statusMsg = "error";
                var statusCode = 500;
                if (err.notFound) {
                    statusMsg = "not found";
                    statusCode = 404;
                }
                var res = {
                    status: statusMsg
                }
                return reject(buildResponse(res, statusCode));
            } else {
                var res = {
                    status: "ok",
                    result: value
                };
                return resolve(buildResponse(res, 200));
            }
        });
    });
}