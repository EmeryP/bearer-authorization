'use strict';

import User from './model.js';
import { request } from 'https';

export default (capability) => {

  return (req, res, next) => {

    try {
      console.log('auth header', req.header.authorization);

      let [authType, authString] = req.headers.authorization.split(/\s+/);

      console.log('auth info', authType, authString);

      switch (authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default:
        return _authError();
      }

    } catch (e) {
      return _authError();
    }

    function _authBasic(authString) {
      let base64Buffer = Buffer.from(authString, 'base64');
      let bufferString = base64Buffer.toString();
      let [username, password] = bufferString.split(':');
      let auth = {
        username,
        password,
      };
      console.log('user info', auth);

      return User.authenticateBasic(auth)
        .then(user => _authenticate(user));
    }

    function _authBearer(authString) {
      return User.authenticateToken(authString)
        .then(user => _authenticate(user)); 
    }

    function _authenticate(user){
      if(user && (!capability || (user.can(capability)))){
        request.user = user;
        request.token = user.generateToken();
        next();
      } else {
        _authError();
      }
    }
    function _authError(){
      next({
        status:401,
        statusMessage: 'Unathorized',
        message: 'Invalid User ID/Password',
      });
    }
  };
};

