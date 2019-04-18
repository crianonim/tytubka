var express = require('express');
var router = express.Router();

var createError = require('http-errors');
const ytdl = require('ytdl-core');
const formats = require("../../formats");
const prettyMs= require('pretty-ms');
/* GET home page. */
router.get('/:url', async function (req, res, next) {
  let url = 'https://youtube.com/watch?'+req.params.url;
    console.log("URL",url)
    let info = await ytdl.getBasicInfo(url).catch(e=>{
      res.json([])
      //  next(createError(404));

    });
    let {title,thumbnail_url,fmt_list,length_seconds,author}=info;
    let format=fmt_list.map(el=>formats[el[0]])
    let length=prettyMs(length_seconds*1000);
    res.json({title,thumbnail_url,format,url,length,author})
    
    // res.render('info', {
    //   title: "TyTubka",
    //   movieTitle: info.title,
    //   thumbnail: info.thumbnail_url,
    //   formats: info.fmt_list.map(el=>formats[el[0]]),
    //   url: url,
    //   length: prettyMs(info.length_seconds*1000),
    //   author: info.author,
    // });

});

module.exports = router;
