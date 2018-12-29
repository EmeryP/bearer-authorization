# Basic and Bearer Authorization
Added basic and bearer authentication/authorization functionality to a CRUD API.

## Setup and Testing
1) Fork and clone this repository to your local machine
2) Navigate to the root directory where the `index.js` is located
3) From your cmd line run `npm i`
4) In the `root` directory, run `mongod --dbpath=./data` from your command line and this will fire up the mongo database.
5) Again in the root directory from your command line, run `nodemon index.js`, this will fire up your node server.
6) Open yet another tab from your command line, navigate to the `__tests__` directory, run `api.test.js`.

## API Method, POST
1) Using Postman to signup; send a `POST` request to the following URL `http://localhost:3000/signup` with the below json object in the body of the request.
```
  {"username":"hive","email":"hive@bar.com","password":"hi"}
```
2) Using Postman to signin with basic auth, send a `POST` request to the following URL `http://localhost:3000/signin` with the password and username from above.
3) Using Postman to signin with bearer auth, send a `POST` request to the following URL `http://localhost:3000/signin` and use the token that was returned from the `signup` post completed in line 1. 

### Credits
Code Fellows demo code
