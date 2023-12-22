const crypto = require('crypto');
const fs = require('fs');
const users = require('../data/users.json');

function saveData(data) {
  const json = JSON.stringify(data);
  fs.writeFileSync('./data/users.json', json, 'utf-8');
}

function generateResponse(code, description, data) {
  return { code, description, data };
}

function generateSalt() {
  const randomString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890^-?!$¨*"';
  let salt = '';
  for (let i = 0; i < 11; i += 1) {
    salt += randomString.charAt(Math.floor(Math.random() * randomString.length - 1));
  }
  return salt;
}

function authenticate(request, response) {
  if (typeof request.body.username !== 'string') {
    return generateResponse(400, 'username is not defined or not a string', null);
  }
  if (typeof request.body.password !== 'string') {
    return generateResponse(400, 'password is not defined or not a string', null);
  }
  let correctUser = null;
  for (const user of users.data) {
    if (user.username === request.body.username) {
      correctUser = user;
    }
  }
  if (correctUser === null) {
    return generateResponse(400, `user ${request.body.username} doesnt exist`, null);
  }

  const correctUserIndex = users.data.indexOf(correctUser);
  // hashes the sent password and checks it
  const hash = crypto.createHash('sha256').update(request.body.password).digest('hex');
  if (hash === correctUser.password) {
    // generates a salt to make a unique hash for the cookie, this is done to avoid
    // stolen cookie to be working forever. the hex will be regenerated
    // everytime it checks for authentication. Reason is that on a password
    // change all cookies get invalidated
    const salt = generateSalt();
    const cookieHash = crypto.createHash('sha256').update(hash + salt).digest('hex');
    response.cookie('username', request.body.username);
    response.cookie('authentication', cookieHash);
    users.data[correctUserIndex].salt = salt;
    saveData(users);
    return generateResponse(202, 'authenticated', null);
  }

  return generateResponse(401, 'password is wrong', null);
}

module.exports.authenticate = authenticate;

function cookieIsValid(cookies) {
  if (cookies.authentication === undefined || cookies.username === undefined) {
    return generateResponse(400, 'Cookies has not been found', null);
  }

  for (const user of users.data) {
    if (user.username === cookies.username) {
      const cookieHash = crypto.createHash('sha256').update(user.password + user.salt).digest('hex');

      if (cookies.authentication === cookieHash) {
        return generateResponse(202, 'Cookie is valid', null);
      }
      return generateResponse(401, 'Cookie is invalid', null);
    }
  }
  return generateResponse(400, 'user saved in cookie doesnt exist', null);
}

module.exports.cookieIsValid = cookieIsValid;

function deleteCookies(request, response) {
  // checking if cookies are valid since else it would be possible to just type in any username to
  // invalidate their session
  if (cookieIsValid(request.cookies).code === 202) {
    for (const user of users.data) {
      if (user.username === request.cookies.username) {
        users.data[users.data.indexOf(user)].salt = null;
        saveData(users);
      }
    }
  }
  response.clearCookie('username');
  response.clearCookie('authentication');
  return generateResponse(200, 'logged out', null);
}

module.exports.deleteCookies = deleteCookies;
