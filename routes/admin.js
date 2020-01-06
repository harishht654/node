var express = require('express');
var router = express.Router();
var controller = require("../controllers");

router.get('/update-status/:email/:value', controller.admin.statusUpdate);
// router.post('/update-usertype', controller.admin.userTypeUpdate);
router.get('/resetPassword/:email', controller.admin.resetPassword);
// router.get('/users-count', controller.admin.usersCount);
router.get('/getAllUsers', controller.admin.getAllUsers);
module.exports = router;