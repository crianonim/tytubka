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
router.get('/:id', async function (req, res, next) {
    let id=req.params.id;
    // console.log(req.params.fileName)
    let metadata=JSON.parse(await readFile(path.join(__basedir,"output",id+".json"),'utf8'));
    let destinationFileName=metadata.title.replace(/\W*/g,"")+"."+metadata.formatData.Extension;
    // console.log(metadata);
    res.download(path.join(__basedir,"output",id),destinationFileName)
});
router.post('/:videoId/:itag', async function(req, res, next) {
    
    let url=req.params.videoId;
    let format=req.params.itag;
    let downloadingFileName=""+Date.now();
   console.log("")
    let metadata={
      url,
      format,
      formatData:formats[format],
      id:downloadingFileName,
    }
    __downloading.push(metadata)
    let rs=ytdl(url,{format});
    let ws=rs.pipe(fs.createWriteStream(__basedir+"/downloading/"+downloadingFileName))
    metadata.rs=rs;
    metadata.ws=ws;
    console.log("Downloading");
    rs.on("response",(r)=>{
        metadata.size=Number(r.headers['content-length'])
        res.send({size:metadata.size});
    })
    rs.on("info",(info)=>{
      metadata.title=info.title;
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
      rename(path.join(__basedir,'downloading',downloadingFileName),path.join(__basedir,'output',downloadingFileName))
      metadata.timestamp=Date.now();
      delete metadata.rs;
      delete metadata.ws;
      fs.writeFile(path.join(__basedir,'output',downloadingFileName+".json"),JSON.stringify(metadata,null," "),()=>{})
      __downloading=__downloading.filter(el=>el.id!=metadata.id);
    });    
    ws.on("unpipe",()=>{
        console.log("Unpipe event")
      ws.end();
      fs.unlink(path.join(__basedir,'downloading',downloadingFileName),(err)=>{
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
