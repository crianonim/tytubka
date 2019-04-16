var express = require('express');
var router = express.Router();
const ytdl=require('ytdl-core');

/* GET home page. */
router.get('/', async function(req, res, next) {
    //ytdl()
    let url=req.query.url;
    let info=await ytdl.getBasicInfo(url);
    

  res.render('info', { title: "TyTubka",
  movieTitle:info.title,
  thumbnail:info.thumbnail_url,
  formats:info.fmt_list,
  url:url,
});
});

module.exports = router;
