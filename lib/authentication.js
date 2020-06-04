const jwt = require('jsonwebtoken');
const secretKey = 'CloutAppDev123';
const {
  getUserByEmail
} = require('../models/user');

exports.generateAuthToken = async function (email) {
  const val = await getUserByEmail(email);
  const payload = {
     sub: val._id,
     role: val.role
    };
  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
};
