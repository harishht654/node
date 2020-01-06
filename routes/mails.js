var express = require('express');
var router = express.Router();
var controller = require("../controllers");

// router.post('/create', controller.mails.create);
router.post('/save', controller.mails.save);
router.post('/send', controller.mails.send);
router.get('/sent/:email', controller.mails.sentMails);
router.get('/drafts/:email', controller.mails.drafts);
router.get('/inbox/:email', controller.mails.inbox);
router.get('/trash/:email', controller.mails.trash);
router.post('/discardDrafts', controller.mails.discardDrafts);
router.post('/changeReadState/:email/:unread', controller.mails.changeReadState);
router.post('/moveToTrash/:from/:email', controller.mails.moveToTrash);
router.post('/viewMail/:from', controller.mails.viewMail);
router.post('/replay/:replayFrom/:mailID', controller.mails.replayMail);
router.post('/deleteFromTrash/:email', controller.mails.deleteFromTrash);
router.get('/replay', controller.mails.replayMail);
module.exports = router;

