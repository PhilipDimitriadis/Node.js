const jwt = require('jsonwebtoken');

function generateAccessToken(user) {

  console.log("Auth Service", user);

  const payload = {
    username: user.username,
    email: user.email,
    roles: user.roles
  }

  const secret = process.env.TOKEN_SECRET;
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secret, options);
}

function verifyAccessToken(token) {
  const secret = process.env.TOKEN_SECRET;

  try {
    const decoded = jwt.verify(token, secret);

    console.log("VerifyToken", decoded);
    return { verified: true, data: decoded };
  } catch (err) {
    return { verified: false, data: err.message };
  }
}

module.exports = { generateAccessToken, verifyAccessToken };