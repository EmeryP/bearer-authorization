
import express from 'express';
const authRouter = express.Router();

import User from './model.js';
import auth from './middleware.js';


authRouter.post('/signup', (request, response, next) => {
  let user = new User(request.body);
  user.save()
    .then((user) => {
      request.token = user.generateToken();
      request.user = user;
      response.send(request.token);
    }).catch(next);
});

authRouter.post('/signin', auth(), (request, response) => {
  response.send(request.token);
});

export default authRouter;