var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util');
const rename = util.promisify(fs.rename);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const mkdir = util.promisify(fs.mkdir);
const access = util.promisify(fs.access);
const formats = require("../../formats");
const filesize = require('filesize');
const prettyms = require('pretty-ms');
const ytdl = require('ytdl-core');
const contentDisposition = require('content-disposition');
let downloading = [];
let waiting = {};


const  getUserDirectory=async (profile)=>{
  let pathToUserDir=path.join(__basedir,'output',profile.sub)
  await access(pathToUserDir,fs.F_OK).catch( async error=>{
    console.log("dir does not exist");
    await mkdir(pathToUserDir);
    fs.writeFile(path.join(pathToUserDir,'..',profile.sub+"_profile.json"),JSON.stringify(profile,null,2),()=>{
      console.log("Written")
    });
   
  })
  return pathToUserDir;
}



// /store?videoid=123&itag=18
router.get('/store', async function (req, res) {
  const userDir=await getUserDirectory(req.user);
  let {
    videoid,
    itag
  } = req.query;
  let format = itag;
  let id = "" + Date.now();
  let url = videoid;
  console.log(`GOT /store WITH url ${url} and format ${format}`);
  let metadata = {
    url,
    format,
    formatData: formats[format],
    id,
    user:req.user.sub
  }
  downloading.push(metadata)
  let rs = ytdl(url, {
    format
  });
  let ws = rs.pipe(fs.createWriteStream(__basedir + "/downloading/" + id))

  metadata.rs = rs;
  metadata.ws = ws;

  console.log("Downloading");
  rs.on("response", (r) => {
    metadata.size = Number(r.headers['content-length'])
    res.send({
      metadata
    });
    console.log("GOT METADATA", metadata);
  })
  rs.on("info", (info) => {
    metadata.title = info.title;
    metadata.thumbnail_url = info.player_response.videoDetails.thumbnail.thumbnails.pop().url;
    metadata.length = info.length_seconds;
    metadata.author = info.author;
    metadata.video_url = info.video_url;
    console.log("GOT METADATA", metadata);
  });
  rs.on("progress", (chunkLength, downloaded, total) => {
    metadata.progressTotal = total;
    metadata.progressDownloaded = downloaded;
    metadata.progressChunkLength = chunkLength;
    metadata.progressPercent = ((downloaded / total) * 100) >> 0;

  })
  rs.on("end", () => {
    console.log("FINISHED downloading...");
    rename(path.join(__basedir, 'downloading', id), path.join(userDir, id))
    metadata.timestamp = Date.now();
    
    delete metadata.rs;
    delete metadata.ws;
    fs.writeFile(path.join(userDir, id + ".json"), JSON.stringify(metadata, null, " "), () => {})
    downloading = downloading.filter(el => el.id != metadata.id);
    if (waiting[id]) {
      waiting[id].send("File " + metadata.title + " downloaded");
    }
  });
  ws.on("unpipe", () => {
    console.log("Unpipe event")
    ws.end();
    fs.unlink(path.join(__basedir, 'downloading', id), (err) => {
      console.log("Couldn't delete file");
    })
  })
});


// /cancel/123123
router.get('/cancel/:id', async function (req, res, next) {
  let id = req.params.id;
  let meta = downloading.find(el => el.id == id);
  if (meta) {
    downloading = downloading.filter(el => el.id != id);
    meta.rs.unpipe();
    meta.rs.destroy();
    delete waiting[id];
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});




// / 
router.get('/', async function (req, res, next) {
  const userDir=await getUserDirectory(req.user);
  console.log("Have user dir in",userDir);
  let fileNames = await util.promisify(fs.readdir)(path.join(userDir))
  fileNames = fileNames.filter(name => name.endsWith(".json"))
  files = await Promise.all(fileNames.map(async name => {
    return await readFile(path.join(userDir, name), 'utf8')
  }));
  files = files.reverse().map(el => JSON.parse(el))
    .map(el => {
      el.size = filesize(el.size);
      el.length = prettyms(el.length * 1000)
      delete el.ws;
      delete el.rs;
      return el;
    })
  res.json(files)
});



router.get('/info/:videoid', async function (req, res, next) {
  let url = 'https://youtube.com/watch?v=' + req.params.videoid;
  let info = await ytdl.getBasicInfo(url).catch(e => {
    res.json([])
  });
  let {
    title,
    thumbnail_url,
    fmt_list,
    length_seconds,
    author
  } = info;
  let format = fmt_list.map(el => formats[el[0]])
  let length = prettyms(length_seconds * 1000);
  if (!thumbnail_url) {
    thumbnail_url = info.player_response.videoDetails.thumbnail.thumbnails.pop().url;
    console.log(info.videoDetails)
  }
  if (req.query.debug) {
    res.json(info)
  } else {
    res.json({
      title,
      thumbnail_url,
      format,
      url,
      length,
      author
    })

  }
});


router.get('/direct', (req, res) => {
  let {
    videoid,
    itag
  } = req.query;
  let extension = formats[itag].Extension;
  console.log('DIRECT', itag, videoid, extension);
  let url = 'https://youtube.com/watch?v=' + videoid;
  let yrs = ytdl(url);
  let disposition;
  yrs.on("info", (info) => {
    disposition = contentDisposition(info.title.replace(/\//g, '_') + "." + extension);
    console.log("Has disposition", disposition)
  })

  yrs.on("response", (response) => {
    res.writeHead(200, {
      "Content-Type": response.headers["content-type"],
      "Content-Length": response.headers["content-length"],
      "Content-Disposition": disposition
    })
    yrs.pipe(res);
  })
})

router.get('/:user/:id', async function (req, res, next) {
  console.log("WILL DOWNLOAD")
  let id = req.params.id;
  const user = req.params.user
  let metadata = JSON.parse(await readFile(path.join(__basedir, "output",user, id + ".json"), 'utf8'));
  let disposition = contentDisposition(metadata.title.replace(/\//g, '_') + "." + metadata.formatData.Extension);
  console.log("TITLE", metadata.title.replace(/\//g, '_'), disposition)
  let rs = fs.createReadStream(path.join(__basedir, "output",user, id));
  res.writeHead(200, {
    "Content-Length": metadata.size,
    "Content-Disposition": disposition
  })
  rs.pipe(res);
});

function progress(id, percent) {
  let res = waiting[id]
  if (res) {
    res.json({
      progress: percent
    });
  }
}

router.delete('/:fileName', async function (req, res, next) {
  let fileName = req.params.fileName;
  const userDir=await getUserDirectory(req.user);
  //TODO ERROR CHECKING
  await unlink(path.join(userDir, fileName)).catch((e) => {
    console.error(e)
  });
  await unlink(path.join(userDir, fileName + ".json")).catch((e) => {
    console.error(e)
  });
  res.sendStatus(200);
});


module.exports = router;