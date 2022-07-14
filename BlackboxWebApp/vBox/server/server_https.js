/*eslint-disable*/
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser");

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const app = express();

app.use(cors());
app.use(bodyParser.json());

let rawdata = fs.readFileSync('credentials.json');
let credentials = JSON.parse(rawdata); // convert to json object

let storedUsername = credentials.username;
let storedPassword = credentials.password;

app.use('/login', (request, response) => {

  let queriedUsername = request.body.username;
  let queriedPassword = request.body.password;

  // send the token to the user
  if (queriedUsername === storedUsername && queriedPassword === storedPassword) {
    response.send({
      token: 'success'
    });
    console.log("User successfully logged in!");
  } else {
    console.log("User entered incorrect credentials!");
  }
});


const server = https.createServer(options, app);
server.listen(8080, () => console.log('API is running on https://localhost:8080/login'));