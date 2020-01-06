const models = require('../models');

exports.save = (req, res) => {

    var to_info = [];
    var splitTo = req.body.to.split(",");
    req.body.to.split(",").forEach(element => {
        to_info.push({
            email: element,
        })
    });
    var inputBody = req.body;
    inputBody.to = to_info;

    if (req.body.mailID) {
        models.message_info.updateMany(
            { _id: req.body.mailID },
            {
                '$set': inputBody
            }, { upsert: true },
            function (err, result) {
                if (result) {
                    models.message_info.findOne({ _id: req.body.mailID }).exec(function (err, result) {
                        res.send({ msg: "Saved successfully", data: result });
                    })
                } else {
                    res.status(500).send({
                        message: "Error while saving mail"
                    });
                }
                if (err) {
                    res.status(500).send({
                        message: "Error while saving mail"
                    });
                }
            })
    } else {
        const message_info = new models.message_info(inputBody);
        message_info.save().then(result => {
            if (result) {
                res.send({ msg: "Saved successfully", data: result })
            } else {
                res.status(500).send({
                    message: "Error while saving mail"
                });
            }

        }).catch(err => {
            res.status(500).send({
                message: "Error while saving mail"
            });
        });
    }

};

exports.send = (req, res) => {
    if (!req.body.mailID) {
        res.status(500).send({
            message: "No mail selected"
        });
    } else {
        models.message_info.update(
            { _id: req.body.mailID, "to._id": { $exists: true } },
            {
                '$set':
                {
                    "status": 2,
                    "sentAt": Date.now(),
                    "to.$[].status": 2,
                    "to.$[].updatedAt": Date.now(),
                    "updatedAt": Date.now()
                }
            }, { upsert: true },
            function (err, result) {

                if (result) {
                    checkMail(req.body.mailID)
                    res.send({ msg: "Mail sent", data: result })
                } else {
                    res.status(500).send({
                        message: "Failed to send"
                    });
                }
                if (err) {
                    res.status(500).send({
                        message: "Failed to send"
                    });
                }
            })
    }
};


function checkMail(id) {
    var BouncedMails = [];
    models.message_info.find(
        {
            _id: id,
        }).sort({ _id: -1 }).exec((err, result) => {
            var emails = [];
            if (result.length > 0) {
                // emails = result[0].to.split(",");
            
                result[0].to.forEach((element, i,arr) => {
                    models.users.find(
                    {
                        email: element.email,
                    }).sort({ _id: -1 }).exec((err, result1) => {
                

                        if (result1.length <= 0) {
                            BouncedMails.push(element.email);
                        }
                        if((i>=arr.length-1) &&(BouncedMails.length>0)){
                            var inputBody = {
                                from: "no-replay@domain.com",
                                subject: "Bounced Mail",
                                to:      [ {email:result[0].from ,
                                status: 2,
                                unread: true,
                                sentAt: Date.now() }]
                                
                               
                            }
                            var body = "-------Mails not found-------</br>";
                            var boun = "";
                            BouncedMails.forEach(element => {
                                boun = boun + "<br/>" + element;
                            });
                            body = body + boun + "<br/>";
                            body = body+"----Mail Data----<br/>";
                            body = body+result[0].body;
                            inputBody.body = body;
                            const message_info = new models.message_info(inputBody);
                      
                            
                            
                            message_info.save().then((result,err) => {
                            }).catch(err => {

                                // res.status(500).send({
                                //     message: "Error while saving mail"
                                // });
                            });
                        }
                    })
                });
                
               
            
        }
        })



}

exports.sentMails = (req, res) => {
    if (!req.params.email) {
        res.status(500).send({
            message: "Not authorized person"
        });
    } else {

        var resultArry = [];
        models.message_info.find(
            {
                repliedTo:
                    { $exists: 1 }
            },
            { repliedTo: 1, _id: 0 }).exec((err, result) => {

                result.forEach(replyId => {
                    resultArry.push(replyId.repliedTo)
                });
                models.message_info.find(
                    {
                        _id: { $nin: resultArry },
                        "from": req.params.email,
                        status: 2
                    }).sort({ _id: -1 }).exec((err, result) => {
                        res.send(result)
                    })
            })

    }

};

exports.inbox = (req, res) => {
    if (!req.params.email) {
        res.status(500).send({
            message: "Not authorized person"
        });
    } else {
        var resultArry = [];
        models.message_info.find(
            {
                repliedTo:
                    { $exists: 1 }
            },
            { repliedTo: 1, _id: 0 }).exec((err, result) => {

                result.forEach(replyId => {
                    resultArry.push(replyId.repliedTo)
                });
                models.message_info.find(
                    {
                        _id: { $nin: resultArry },
                        "to.email": req.params.email,
                        "to.status": 2
                    }).sort({ _id: -1 }).exec((err, result) => {
                        res.send(result)
                    })
            })
    }
};

exports.drafts = (req, res) => {
    if (!req.params.email) {
        res.status(500).send({
            message: "Not authorized person"
        });
    } else {

        var resultArry = [];
        models.message_info.find(
            {
                repliedTo:
                    { $exists: 1 }
            },
            { repliedTo: 1, _id: 0 }).exec((err, result) => {

                result.forEach(replyId => {
                    resultArry.push(replyId.repliedTo)
                });
                models.message_info.find(
                    {
                        _id: { $nin: resultArry },
                        "from": req.params.email,
                        status: 1
                    }).sort({ _id: -1 }).exec((err, result) => {
                        res.send(result)
                    })
            })
    }

};


exports.trash = (req, res) => {

    if (!req.params.email) {
        res.status(500).send({
            message: "Not authorized person"
        });
    } else {
        models.message_info.find({ $or: [{ "from": req.params.email, status: 3 }, { "to.email": req.params.email, "to.status": 3 }] }).sort({ modifiedAt: -1 }).exec(function (err, result) {
            if (err) {
                res.status(500).send({
                    message: "Something went wrong !"
                });
                return;
            }
            res.send(result)
        })
    }
};

exports.discardDrafts = (req, res) => {

    models.message_info.remove({ _id: { $in: req.body.selectedMails } }, function (err, result) {
        if (err) {
            res.status(500).send({
                message: "Something went wrong !"
            });
            return;
        }
        else {
            res.send({ msg: "Discarded sucessfully" })
        }
    });

};



exports.changeReadState = (req, res) => {
    console.clear()
    if (!req.params.email) {
        res.status(500).send({
            message: "No mail selected"
        });
    } else {

        models.message_info.updateMany(
            { _id: { $in: req.body.selectedMails }, 'to.email': req.params.email },
            {
                '$set':
                {
                    "to.$.unread": req.params.unread,
                    "to.$.updatedAt": Date.now(),
                }
            }, { upsert: true },
            function (err, result) {

                if (result) {
                    res.send({ msg: "updated", data: result })
                } else {
                    res.status(500).send({
                        message: "Failed to send"
                    });
                }
                if (err) {
                    res.status(500).send({
                        message: "Failed to send"
                    });
                }
            })

    }
};

exports.moveToTrash = (req, res) => {
    console.clear()
    if (!req.params.email) {
        res.status(500).send({
            message: "No mail selected"
        });
    } else {
        var updateObject = {};
        var mailIDSelected = {};
        if (req.params.from == "inbox") {
            updateObject = {
                "to.$.status": 3,
                "to.$.updatedAt": Date.now(),
            }
            mailIDSelected['to.email'] = req.params.email;
        } else if (req.params.from == "sent") {
            updateObject = {
                "status": 3,
                "updatedAt": Date.now(),
            }
            mailIDSelected['from'] = req.params.email;
        }


        if (req.params.from == "sent") {
            models.message_info.updateMany(
                { _id: { $in: req.body.selectedMails }, "from": req.params.email },
                {
                    '$set': updateObject
                },
                function (err, result) {
                    console.log("ERR___", err, result)
                    if (result) {
                        res.send({ msg: "updated", data: result })
                    } else {
                        res.status(500).send({
                            message: "Failed to send"
                        });
                    }
                    if (err) {
                        res.status(500).send({
                            message: "Failed to send"
                        });
                    }
                })
        } else if (req.params.from == "inbox") {
            models.message_info.updateMany(
                { _id: { $in: req.body.selectedMails }, "to.email": req.params.email },
                {
                    '$set': updateObject
                },
                function (err, result) {
                    console.log("ERR___", err, result)
                    if (result) {
                        res.send({ msg: "updated", data: result })
                    } else {
                        res.status(500).send({
                            message: "Failed to send"
                        });
                    }
                    if (err) {
                        res.status(500).send({
                            message: "Failed to send"
                        });
                    }
                })
        }

    }
};


exports.viewMail = (req, res) => {
    if (!req.body.email) {
        res.status(500).send({
            message: "No mail selected"
        });
    } else {
        if (req.params.from == "inbox") {
            models.message_info.find(
                { _id: req.body.msgID, 'to.email': req.body.email },
                function (err, result) {
                    models.message_info.updateMany(
                        { _id: req.body.msgID, 'to.email': req.body.email },
                        {
                            '$set':
                            {
                                "to.$.unread": false,
                                "to.$.updatedAt": Date.now(),
                            }
                        }, { upsert: true },
                        function (err, result1) {
                            res.send(result)
                        })
                })
        } else {
            models.message_info.find(
                { _id: req.body.msgID },
                function (err, result) {
                    res.send(result)
                })

        }
    }
};


exports.replayMail = (req, res) => {
    var resultArry = [];
    models.message_info.find(
        {
            repliedTo:
                { $exists: 1 }
        },
        { repliedTo: 1, _id: 0 }).exec((err, result) => {

            result.forEach(replyId => {
                resultArry.push(replyId.repliedTo)
            });
            models.message_info.find(
                {
                    _id:
                        { $nin: resultArry }
                }).exec((err, result) => {
                    res.send(result)
                })
        })

}
exports.deleteFromTrash = (req, res) => {
    models.message_info.updateMany(
        { _id: { $in: req.body.selectedMails }, "from": req.params.email },
        {
            '$set': {
                "status": 4,
                "updatedAt": Date.now(),
            }
        },
        function (err, result) {
            if (result) {
                models.message_info.updateMany(
                    { _id: { $in: req.body.selectedMails }, "to.email": req.params.email },
                    {
                        '$set': {
                            "to.$.status": 4,
                            "to.$.updatedAt": Date.now(),
                        }
                    },
                    function (err, result) {
                        if (result) {
                            res.send({ msg: "updated", data: result })
                        } else {
                            res.status(500).send({
                                message: "Failed to send"
                            });
                        }
                        if (err) {
                            res.status(500).send({
                                message: "Failed to send"
                            });
                        }
                    })
            } else {
                res.status(500).send({
                    message: "Failed to send"
                });
            }
            if (err) {
                res.status(500).send({
                    message: "Failed to send"
                });
            }
        })

}
