const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

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

async function googleAuth(code) {
  console.log("Google Login");
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID
    });

    const userInfo = await ticket.getPayload();
    console.log("Google User", userInfo);
    return { user: userInfo, tokens };

  } catch (error) {
    console.log("Error in Google authenitication", error);
    return { error: "Failed to authenticate with Google" };
  }
};

module.exports = { generateAccessToken, verifyAccessToken, googleAuth };