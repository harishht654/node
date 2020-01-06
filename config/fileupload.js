var express = require("express");
var multer = require('multer');
var fs = require('fs');
var app = express();
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // var dir = '../uploads/tmp/' + req.params.email + '/' + req.params.msgID;
    var dir = '../uploads/tmp/' + req.params.email+ '/' + req.params.path;
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) throw err;
        callback(null, dir);
    });
    }else{
      callback(null, dir);
    }

  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
exports.upload = multer({ storage: storage }).array('file', 5);    