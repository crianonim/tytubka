var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util');
const rename=util.promisify(fs.rename);
const readFile = util.promisify(fs.readFile);
const unlink=util.promisify(fs.unlink);
const formats = require("../../formats");
const filesize = require('filesize');
const prettyms = require('pretty-ms');
const ytdl=require('ytdl-core');
const axios=require('axios');

let downloading=[];
let waiting={};
router.get('/', async function (req, res, next) {
    let fileNames = await util.promisify(fs.readdir)(path.join(__basedir, "output"))
    fileNames = fileNames.filter(name => name.endsWith(".json"))
    files = await Promise.all(fileNames.map(async name => {

        return await readFile(path.join(__basedir, "output", name), 'utf8')
    }
    ));
    files = files.reverse().map(el => JSON.parse(el))
        .map(el => {
          //  el.format = formats[el.format];
            el.size = filesize(el.size);
            el.length = prettyms(el.length * 1000)
            delete el.ws;
            delete el.rs;
            return el;
        })
   res.json(files)
});
router.get("/notify/:id",(req,res,next)=>{
  console.log("NOTIFY")
  let id=req.params.id;
  if (downloading.find(el=>el.id==id)){
    console.log("FOund")
    waiting[req.params.id]=res;
  } else {
    res.sendStatus(404);
  }
})
router.get('/info/:url', async function (req, res, next) {
  let url = 'https://youtube.com/watch?v='+req.params.url;
    console.log("URL",url)
    let info = await ytdl.getBasicInfo(url).catch(e=>{
      res.json([])
      //  next(createError(404));

    });
    let {title,thumbnail_url,fmt_list,length_seconds,author}=info;
    let format=fmt_list.map(el=>formats[el[0]])
    let length=prettyms(length_seconds*1000);
    res.json({title,thumbnail_url,format,url,length,author})
    
    // res.render('info', {
    //   title: "TyTubka",
    //   movieTitle: info.title,
    //   thumbnail: info.thumbnail_url,
    //   formats: info.fmt_list.map(el=>formats[el[0]]),
    //   url: url,
    //   length: prettyms(info.length_seconds*1000),
    //   author: info.author,
    // });

});
router.get('/headersStatus',async (req,res,next)=>{
  let url=req.query.url;
  console.log("Got request for ",url);
  try {
    let answer=await axios.head(url);
    console.log("AXIOS",answer.status)
    res.send(answer.status);
  }
  catch(e) {
    res.sendStatus(400);
  }

})

router.get('/:id', async function (req, res, next) {
    let id=req.params.id;
    // console.log(req.params.fileName)
    let metadata=JSON.parse(await readFile(path.join(__basedir,"output",id+".json"),'utf8'));
    let destinationFileName=metadata.title.replace(/\W*/g,"")+"."+metadata.formatData.Extension;
    // console.log(metadata);
    res.download(path.join(__basedir,"output",id),destinationFileName)
});
router.post('/', async function(req, res, next) {
  console.log(req.body);  
  let {url,format}=req.body;
  
    let id=""+Date.now();

   console.log(`GOT POST WITH url ${url} and format ${format}`);
  //  res.sendStatus(200);
  //  return 
    let metadata={
      url,
      format,
      formatData:formats[format],
      id,
    }
    downloading.push(metadata)
    let rs=ytdl(url,{format});
    let ws=rs.pipe(fs.createWriteStream(__basedir+"/downloading/"+id))
    metadata.rs=rs;
    metadata.ws=ws;
    console.log("Downloading");
    rs.on("response",(r)=>{
      console.log("response")
        metadata.size=Number(r.headers['content-length'])
        res.send({metadata});
    })
    rs.on("info",(info)=>{
      metadata.title=info.title;
      console.log("info",info.title)
      metadata.thumbnail_url=info.thumbnail_url;
      metadata.length=info.length_seconds;
      metadata.author=info.author;
    });
    rs.on("progress",(chunkLength,downloaded,total)=>{
      metadata.progressTotal=total;
      metadata.progressDownloaded=downloaded;
      metadata.progressChunkLength=chunkLength;
      metadata.progressPercent=((downloaded/total)*100)>>0
    })
    rs.on("end",()=>{
      console.log("FINISHED downloading...");
      rename(path.join(__basedir,'downloading',id),path.join(__basedir,'output',id))
      metadata.timestamp=Date.now();
      delete metadata.rs;
      delete metadata.ws;
      fs.writeFile(path.join(__basedir,'output',id+".json"),JSON.stringify(metadata,null," "),()=>{})
      downloading=downloading.filter(el=>el.id!=metadata.id);
      if (waiting[id]){
        waiting[id].send("File "+metadata.title+" downloaded");
      }
    });    
    ws.on("unpipe",()=>{
        console.log("Unpipe event")
      ws.end();
      fs.unlink(path.join(__basedir,'downloading',id),(err)=>{
        console.log("Couldn't delete file");
      })
    })
});


router.delete('/:fileName', async function (req, res, next) {
    let fileName=req.params.fileName;
    //TODO ERROR CHECKING
    await unlink(path.join(__basedir,"output",fileName)).catch((e)=>{console.error(e)});
    await unlink(path.join(__basedir,"output",fileName+".json")).catch((e)=>{console.error(e)});
    res.sendStatus(200);
});


module.exports = router;
