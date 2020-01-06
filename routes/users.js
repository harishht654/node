var express = require('express');
var router = express.Router();
var controller = require("../controllers");
router.post('/create', controller.users.create);
router.post('/change-password', controller.users.changePassword);
router.get('/email-check/:email', controller.users.emailCheck);
router.post('/login', controller.users.login);
module.exports = router;