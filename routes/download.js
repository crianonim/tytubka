var express = require('express');
const fs=require('fs');
const path=require('path');
var router = express.Router();
const ytdl=require('ytdl-core');
const util=require('util');
const rename=util.promisify(fs.rename);
const formats=require("../formats");

/* GET home page. */
router.get('/', async function(req, res, next) {
    //ytdl()
    let url=req.query.url;
    let format=req.query.format;
    let title=req.query.title;
    let downloadingFileName=""+Date.now();
   
    let metadata={
      title,
      url,
      format,
      formatData:formats[format],
      id:downloadingFileName,
    }
    let rs=ytdl(url,{format});
    rs.pipe(fs.createWriteStream(__basedir+"/downloading/"+downloadingFileName))
    rs.on("response",(r)=>{
      metadata.size=Number(r.headers['content-length'])
      // console.log("RS",r.headers['content-length']);
    })
    rs.on("info",(info)=>{
      metadata.thumbnail_url=info.thumbnail_url;
      metadata.length=info.length_seconds;
      metadata.author=info.author;
      
      // console.log("IN",JSON.stringify(r.thumbnail_url,null," "));

    })
    rs.on("end",()=>{
      console.log("FINISHED downloading...");
      rename(path.join(__basedir,'downloading',downloadingFileName),path.join(__basedir,'output',downloadingFileName))
      metadata.timestamp=Date.now();
      fs.writeFile(path.join(__basedir,'output',downloadingFileName+".json"),JSON.stringify(metadata,null," "),()=>{})
    });    

  res.render('index', { title: "TyTubka"});
});

module.exports = router;
