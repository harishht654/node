var fs = require('fs');
var controllers={}
fs.readdirSync(__dirname).forEach(function (route) {
  route = route.split('.')[0];
  if (route === 'index') return;
  controllers[route]=require('./' + route + '.js');
});

module.exports = controllers;

