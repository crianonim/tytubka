var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util');
// const stat = util.promisify(fs.stat)
const unlink=util.promisify(fs.unlink);
router.get('/:fileName', async function (req, res, next) {
    let fileName=req.params.fileName;
    await unlink(path.join(__basedir,"output",fileName)).catch((e)=>{console.error(e)});
    await unlink(path.join(__basedir,"output",fileName+".json")).catch((e)=>{console.error(e)});
    res.redirect(res.locals.MOUNT_PATH+'/list')
});

module.exports = router;
