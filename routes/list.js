var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util');
const stat = util.promisify(fs.stat)
router.get('/', async function (req, res, next) {
    
    let fileNames = await util.promisify(fs.readdir)(path.join(__basedir, "output"));
    
    let files=await Promise.all(fileNames.map(async fileName=>{
        let file=await stat(path.join(__basedir, "output",fileName));
        file.name=fileName;
        return file;
    }))
    res.render('list', {
        title: "TyTubka - List",
        fileList: files,

    });
    console.log(files)


});

module.exports = router;
