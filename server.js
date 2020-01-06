var express = require('express');
var app = express();
var config = require('./config/config');
var routers = require('./routes');
var db = require('./config/dbconnect');


app.use(express.urlencoded({extended:true}))
app.use( express.json() );
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use("/",routers)
app.get('/', (req,res)=>{
    console.clear()
    res.send("test")
  });
app.listen(config.port, () => {
    console.log(`Server running on ${config.port}!`);
})




