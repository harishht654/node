var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
  fistName: {type:String,require:true},
  lastName:{type:String,require:true},
  email:{type:String,require:true,unique:true},
  password: {type:String,require:true},
  userStatus: {type:Boolean,require:true,default:true},           //true-> Active user,false->inactive User
  userType: {type:Number,require:true,default:2},               //1->Admin, 2-> user
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Users', UsersSchema);