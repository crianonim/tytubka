var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const formats = require("../formats");
const filesize = require('filesize');
const prettyms = require('pretty-ms');
router.get('/', async function (req, res, next) {

    let fileNames = await util.promisify(fs.readdir)(path.join(__basedir, "output"))
    fileNames = fileNames.filter(name => name.endsWith(".json"))
    files = await Promise.all(fileNames.map(async name => {

        return await readFile(path.join(__basedir, "output", name), 'utf8')
    }
    ));
    files = files.reverse().map(el => JSON.parse(el))
        .map(el => {
            el.format = formats[el.format];
            el.size = filesize(el.size);
            el.length = prettyms(el.length * 1000)
            return el;
        })




    /*
    let files=await Promise.all(fileNames.map(async fileName=>{
        let file=await stat(path.join(__basedir, "output",fileName));
        file.name=fileName;
        return file;
    }))
    */
    res.render('list', {
        title: "TyTubka - List",
        fileList: files,

    });
    console.log(files)


});

module.exports = router;
