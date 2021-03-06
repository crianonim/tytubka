const {
  OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client();
async function verify(req, res, next) {
  const token = req.query.id_token;
  console.log(req.url, "in middle", token);
  if (req.url.startsWith('/info') || req.url.startsWith('/direct')) {
    next();
  } else
  if (token && token !== "undefined") {
    console.log("Has token", token, typeof token)
    const ticket = await client.verifyIdToken({
      idToken: token,
    });

    const payload = ticket.getPayload();
    console.log(ticket, payload)
    req.user = payload;
    next();
  } else {
    // next();
    console.log("empty token")
    res.send();
  }
}



module.exports = verify;