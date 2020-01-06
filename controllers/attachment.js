const models = require('../models');
const upload = require('../config/fileupload').upload;
var fs=require('fs');
var path=require('path');
var mime=require('mime');
exports.upload = (req, res) => {
    var currentTime = new Date().getTime();
    req.params.path = currentTime;
    upload(req, res, function (err) {
        if (err) {
            return res.send({ err: "Error uploading file." });
        }
        res.send({
            msg: "File is uploaded", data: {
                path: '../uploads/tmp/' + req.params.email + '/' + req.params.path+"/"+req.files[0].filename,
                fileName: req.files[0].filename,
                fileSize: req.files[0].size
           }
        });

    });
}
exports.download = (req, res) => {
    if(!req.body.path){
        res.send({ err: "Invalid path" });
    }else{
        var filename=path.basename(req.body.path);
        var mimetype=mime.lookup(req.body.path);
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type', mimetype);
            var filestream=fs.createReadStream(req.body.path)
            filestream.pipe(res)
    }
}