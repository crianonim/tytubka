var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util');
// const stat = util.promisify(fs.stat)
const unlink=util.promisify(fs.unlink);
router.get('/:fileName', async function (req, res, next) {
    let fileName=req.params.fileName;
    let meta=__downloading.find(el=>el.id==fileName);
    if (meta){
        __downloading=__downloading.filter(el=>el.id!=fileName);
        meta.rs.unpipe();
        meta.rs.destroy();
    }
    res.redirect('/tytubka/list')
});

module.exports = router;
