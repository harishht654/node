var express = require('express'),
  router = express.Router(),
  fs = require('fs');
fs.readdirSync(__dirname).forEach(function (route) {
  route = route.split('.')[0];
  if (route === 'index') return;
  console.log('Loading route ' + route + '... : Router => ' + '/' + route);
  router.use('/' + route, require('./' + route + '.js'));
});
module.exports = router;

