var express = require('express');
var router = express.Router();
var controller = require("../controllers");

router.post('/upload/:email', controller.attachment.upload);
router.post('/download', controller.attachment.download);
module.exports = router;