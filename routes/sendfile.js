var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util');
// const stat = util.promisify(fs.stat)
const readFile=util.promisify(fs.readFile);
router.get('/:fileName', async function (req, res, next) {
    let fileName=req.params.fileName;
    // console.log(req.params.fileName)
    let metadata=JSON.parse(await readFile(path.join(__basedir,"output",fileName+".json"),'utf8'));
    let destinationFileName=metadata.title.replace(/\W*/g,"")+"."+metadata.formatData.Extension;
    console.log(metadata);
    res.download(path.join(__basedir,"output",fileName),destinationFileName)
});

module.exports = router;
