var express = require('express');
var router = express.Router();

var createError = require('http-errors');
const ytdl = require('ytdl-core');
const formats = require("../formats");
const prettyMs= require('pretty-ms');
/* GET home page. */
router.get('/', async function (req, res, next) {
  let url = req.query.url;

    let info = await ytdl.getBasicInfo(url).catch(e=>{
      next(createError(404));

    });
    
    
    res.render('info', {
      title: "TyTubka",
      movieTitle: info.title,
      thumbnail: info.thumbnail_url,
      formats: info.fmt_list.map(el=>formats[el[0]]),
      url: url,
      length: prettyMs(info.length_seconds*1000),
      author: info.author,
    });

});

module.exports = router;
