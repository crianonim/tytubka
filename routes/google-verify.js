var express = require('express');
var router = express.Router();

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client();
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
  });

  const payload = ticket.getPayload();
  console.log(ticket,payload)
  return payload;
}


router.get('/token', async (req,res)=>{
    let id_token=req.query.id_token;
    console.log("IN TOKEN",id_token);
    res.send(await verify(id_token));
})

module.exports = router
