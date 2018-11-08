'use strict';

import {app as server} from '../src/app.js';

import supergoose, { startDB, stopDB } from './supergoose.js';
import User from '../src/auth/model.js';

const mockRequest = supergoose(server);

beforeAll(startDB);
afterAll(stopDB);

beforeEach(async () => {
  await User.deleteMany({});
});

process.env.APP_SECRET = 'password';

describe('api', () => {
  
  xit('should sign up', async () => {

    const userInfo = {
      username: 'foo',
      password: 'bar',
      email: 'foo@bar.com',
    };
    const token = await mockRequest.post('/signup').send(userInfo);
    expect(token.text).toBeDefined();
  });

  xit('should sign in with token - bearer auth', async() => {
    const userInfo = {
      username: 'foofoo',
      password: 'bar',
      email: 'foo@bar.com',
    };
    
    let response = await mockRequest.post('/signup').send(userInfo);
    const token = response.text;
    response = await mockRequest.post('/signin').auth(token, {type:'bearer'});
    expect(token).toBe(response.text);
  });

  it('should sign in with username/password - bearer auth', async() => {
    const userInfo = {
      username: 'foo',
      password: 'bar',
      email: 'foo@bar.com',
    };
    
    let response = await mockRequest.post('/signup').send(userInfo);
    console.log(response.text);

    const token = response;
    response = await mockRequest.post('/signin').auth(token, {type:'bearer'});

    // expect(response.text).toBe('dunno');
  });

});


