const jwt = require('jsonwebtoken');
const { ObjectId, collectionNames } = require('mongodb');
const bcrypt = require('bcryptjs');
const { getDBReference } = require('../lib/mongo');
const secretKey = 'CloutAppDev123';
const {
  getUserByEmail,
  getUserById
} = require('../models/user');

exports.generateAuthToken = async function (email) {
  const val = await getUserByEmail(email);
  const payload = {
     sub: val._id,
     role: val.role
    };
  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
};


exports.requireAuthentication = function (req, res, next) {
  /*
   * Authorization: Bearer <token>
   */
  const authHeader = req.get('Authorization') || '';
  const authHeaderParts = authHeader.split(' ');
  const token = authHeaderParts[0] === 'Bearer' ?
    authHeaderParts[1] : null;

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload.sub;
    req.role = payload.role;
    next();
  } catch (err) {
    console.error("  -- error:", err);
    res.status(401).send({
      error: "Invalid authentication token"
    });
  }
};
