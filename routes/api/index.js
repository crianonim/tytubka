var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util');
const rename = util.promisify(fs.rename);
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);
const formats = require("../../formats");
const filesize = require('filesize');
const prettyms = require('pretty-ms');
const ytdl = require('ytdl-core');
const axios = require('axios');
// const mock = require('./mockDownload');
let downloading = [];
let waiting = {};

router.get('/store', async function (req, res, next) {
  console.log(req.query);
  let { url, itag } = req.query;
  let format=itag;
  let id = "" + Date.now();

  console.log(`GOT /store WITH url ${url} and format ${format}`);
  let metadata = {
    url,
    format,
    formatData: formats[format],
    id,
  }
  downloading.push(metadata)
  let rs = ytdl(url, { format });
  let ws = rs.pipe(fs.createWriteStream(__basedir + "/downloading/" + id))
  
  metadata.rs = rs;
  metadata.ws = ws;

  console.log("Downloading");
  rs.on("response", (r) => {
    // console.log("response")
    metadata.size = Number(r.headers['content-length'])
    res.send({ metadata });
    let time = Date.now();
   
  })
  rs.on("info", (info) => {
    metadata.title = info.title;
    // console.log("info", info.title)
    metadata.thumbnail_url = info.thumbnail_url;
    metadata.length = info.length_seconds;
    metadata.author = info.author;
  
  });
  rs.on("progress", (chunkLength, downloaded, total) => {
    metadata.progressTotal = total;
    metadata.progressDownloaded = downloaded;
    metadata.progressChunkLength = chunkLength;
    metadata.progressPercent = ((downloaded / total) * 100) >> 0;
   
  })
  rs.on("end", () => {
    console.log("FINISHED downloading...");
    rename(path.join(__basedir, 'downloading', id), path.join(__basedir, 'output', id))
    metadata.timestamp = Date.now();
    delete metadata.rs;
    delete metadata.ws;
    fs.writeFile(path.join(__basedir, 'output', id + ".json"), JSON.stringify(metadata, null, " "), () => { })
    downloading = downloading.filter(el => el.id != metadata.id);
    if (waiting[id]) {
      waiting[id].send("File " + metadata.title + " downloaded");
    }
    let time = Date.now();
    // let mockObj = JSON.stringify({
    //   event: 'END',
    //   time,
    //   offset: time - mockStart,

    // }, null, 1)
    // // console.log(mockObj);
    // mock.write(mockObj);
  });
  ws.on("unpipe", () => {
    console.log("Unpipe event")
    ws.end();
    fs.unlink(path.join(__basedir, 'downloading', id), (err) => {
      console.log("Couldn't delete file");
    })
  })
});

router.get('/cancel/:id', async function (req, res, next) {
    let id=req.params.id;
    let meta=__downloading.find(el=>el.id==id);
    if (meta){
        __downloading=__downloading.filter(el=>el.id!=id);
        meta.rs.unpipe();
        meta.rs.destroy();
        res.sendStatus(200);
    }
    else {
      res.sendStatus(404);
    }
    
});
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
router.get("/notify/:id", (req, res, next) => {
  console.log("NOTIFY")
  let id = req.params.id;
  if (downloading.find(el => el.id == id)) {
    console.log("FOund")
    waiting[req.params.id] = res;
  } else {
    res.sendStatus(404);
  }
})
router.get('/test', async (req, res, next) => {
  console.log("TEST")
  let { url, itag, title, extension } = req.query;
  let yrs = ytdl(url, { format: itag });
  let out = fs.createWriteStream('emitter.json');
  out.write('[\n');
  let emit = yrs.emit;
  let start = Date.now();

  yrs.emit = (name, ...rest) => {
    console.log(name);
    let offset = Date.now() - start;
    let obj = { time: offset, name, params: rest.length }
    obj.paramsTypes = rest.map(x => Object.prototype.toString.call(x))
    obj.registeredListenersCount = yrs.listenerCount(name);
    switch (name) {
      case 'info':
      case 'progress': obj = { ...obj, ...rest }; break;
      case 'data': obj.dataSize = rest[0].length; break;
      case 'response': obj.headers = rest[0].headers; break;
    }
    out.write(JSON.stringify(obj, null, 1) + ",\n")
    emit.call(yrs, name, ...rest)
  }
  yrs.pipe(res);
  // out.write('\n]\n');
  console.log("EVENT NAMES:", yrs.eventNames());

})


router.get('/info/:url', async function (req, res, next) {
  let url = 'https://youtube.com/watch?v=' + req.params.url;
  console.log("URL", url)
  let info = await ytdl.getBasicInfo(url).catch(e => {
    res.json([])
    //  next(createError(404));

  });
  let { title, thumbnail_url, fmt_list, length_seconds, author } = info;
  let format = fmt_list.map(el => formats[el[0]])
  let length = prettyms(length_seconds * 1000);
  res.json({ title, thumbnail_url, format, url, length, author })

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
router.get('/headersStatus', async (req, res, next) => {
  let url = req.query.url;
  console.log("Got request for ", url);
  try {
    let answer = await axios.head(url);
    console.log("AXIOS", answer.status)
    res.send(answer.status);
  }
  catch (e) {
    res.sendStatus(400);
  }

})
router.get('/direct', (req, res, next) => {
  let { url, itag, title, extension } = req.query;
  console.log('DIRECT', itag, url, "filename:" + title + "." + extension);
  // let yrs = ytdl(url, { format: itag });
  let yrs = ytdl(url, { filter: "audioonly" });
 
  yrs.on("response", (response) => {
    res.writeHead(200, {
      "Content-Type": response.headers["content-type"],
      "Content-Length": response.headers["content-length"],
      "Content-Disposition": "attachment;filename=" + title.replace(/[^A-z0-9 ]/g, '') + "." + extension
    })
    yrs.pipe(res);
  })
})

router.get('/:id', async function (req, res, next) {
  let id = req.params.id;
  // console.log(req.params.fileName)
  let metadata = JSON.parse(await readFile(path.join(__basedir, "output", id + ".json"), 'utf8'));
  let destinationFileName = metadata.title.replace(/\W*/g, "") + "." + metadata.formatData.Extension;
  // console.log(metadata);
  res.download(path.join(__basedir, "output", id), destinationFileName)
});

router.post('/', async function (req, res, next) {
  console.log(req.body);
  let { url, format } = req.body;

  let id = "" + Date.now();

  console.log(`GOT POST WITH url ${url} and format ${format}`);
  //  res.sendStatus(200);
  //  return 
  let metadata = {
    url,
    format,
    formatData: formats[format],
    id,
  }

  downloading.push(metadata)
  let rs = ytdl(url, { format });
  let ws = rs.pipe(fs.createWriteStream(__basedir + "/downloading/" + id))
  let mock = fs.createWriteStream('mock.json')
  let mockStart = Date.now();
  metadata.rs = rs;
  metadata.ws = ws;

  console.log("Downloading");
  rs.on("response", (r) => {
    console.log("response")
    metadata.size = Number(r.headers['content-length'])
    res.send({ metadata });
    let time = Date.now();
    let mockObj = JSON.stringify({
      event: 'response',
      time,
      headers: r.headers,
      offset: time - mockStart,
    }, null, 1)
    console.log(mockObj);
    mock.write(mockObj);
  })
  rs.on("info", (info) => {
    metadata.title = info.title;
    console.log("info", info.title)
    metadata.thumbnail_url = info.thumbnail_url;
    metadata.length = info.length_seconds;
    metadata.author = info.author;
    let time = Date.now();
    let mockObj = JSON.stringify({
      event: 'info',
      time,
      offset: time - mockStart,
      info: info,
    }, null, 1)
    console.log(mockObj);
    mock.write(mockObj);

  });
  rs.on("data", (chunk) => {
    let time = Date.now();
    let mockObj = JSON.stringify({
      event: 'data',
      time,
      offset: time - mockStart,
      data: chunk.length,
    }, null, 1)
    // console.log(mockObj);
    mock.write(mockObj);
  })
  rs.on("progress", (chunkLength, downloaded, total) => {
    metadata.progressTotal = total;
    metadata.progressDownloaded = downloaded;
    metadata.progressChunkLength = chunkLength;
    metadata.progressPercent = ((downloaded / total) * 100) >> 0;
    let time = Date.now();
    let mockObj = JSON.stringify({
      event: 'progress',
      time,
      offset: time - mockStart,
      downloaded,
      chunkLength,
      total
    }, null, 1)
    // console.log(mockObj);
    mock.write(mockObj);
  })
  rs.on("end", () => {
    console.log("FINISHED downloading...");
    rename(path.join(__basedir, 'downloading', id), path.join(__basedir, 'output', id))
    metadata.timestamp = Date.now();
    delete metadata.rs;
    delete metadata.ws;
    fs.writeFile(path.join(__basedir, 'output', id + ".json"), JSON.stringify(metadata, null, " "), () => { })
    downloading = downloading.filter(el => el.id != metadata.id);
    if (waiting[id]) {
      waiting[id].send("File " + metadata.title + " downloaded");
    }
    let time = Date.now();
    let mockObj = JSON.stringify({
      event: 'END',
      time,
      offset: time - mockStart,

    }, null, 1)
    // console.log(mockObj);
    mock.write(mockObj);
  });
  ws.on("unpipe", () => {
    console.log("Unpipe event")
    ws.end();
    fs.unlink(path.join(__basedir, 'downloading', id), (err) => {
      console.log("Couldn't delete file");
    })
  })
});


router.delete('/:fileName', async function (req, res, next) {
  let fileName = req.params.fileName;
  //TODO ERROR CHECKING
  await unlink(path.join(__basedir, "output", fileName)).catch((e) => { console.error(e) });
  await unlink(path.join(__basedir, "output", fileName + ".json")).catch((e) => { console.error(e) });
  res.sendStatus(200);
});


module.exports = router;
