// app/lnpayreqauth.js
const basicAuth = require('basic-auth');
const debug = require('debug')('lncliweb:lnpayreqauth');
const crypto = require('crypto');
const zpay32 = require('./zpay32.js')();

// expose the routes to our app with module.exports
module.exports = function (lightning, config) {
  const module = {};

  // configure basic authentification for express
  module.filter = function (req, res, next) {
    debug(`url: ${req.originalUrl}`);
    function unauthorized(res) {
      res.set('WWW-Authenticate', `Basic realm=lnpayreq:${config.defaultAuthPayReq}`);
      return res.sendStatus(401);
    }

    const user = basicAuth(req);
    if (!user || !user.name) {
      return unauthorized(res);
    }

    debug('payment.preimage', user.name);

    const preimageHash = crypto.createHash('sha256').update(Buffer.from(user.name, 'hex')).digest('hex');

    debug('payment.preimage.hash', preimageHash);

    const decodedPayReq = zpay32.decode(config.defaultAuthPayReq);

    debug('decodedPayReq', decodedPayReq);

    if (decodedPayReq.paymentHashHex === preimageHash) {
      req.limituser = false;
      next();
    } else {
      unauthorized(res);
    }
  };

  return module;
};
