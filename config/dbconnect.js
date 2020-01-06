var dbConfig=require('./config')
const mongoose = require('mongoose');

mongoose.connect(dbConfig.mongodburl, {
	useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});