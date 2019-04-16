var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const util = require('util');
const stat = util.promisify(fs.stat)
router.get('/:fileName', async function (req, res, next) {
    console.log(req.params.fileName)
    res.download(path.join(__basedir,"output",req.params.fileName))
});

module.exports = router;
