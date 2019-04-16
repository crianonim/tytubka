var express = require('express');
const fs=require('fs');

var router = express.Router();
const ytdl=require('ytdl-core');

/* GET home page. */
router.get('/', async function(req, res, next) {
    //ytdl()
    let url=req.query.url;
    let format=req.query.format;
    let title=req.query.title
    ytdl(url,{format}).pipe(fs.createWriteStream(__basedir+"/output/"+title.replace(/\W*/g,"")+".mp4"));    

  res.render('index', { title: "TyTubka"});
});

module.exports = router;
