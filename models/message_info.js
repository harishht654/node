var mongoose = require('mongoose');

var message_info = new mongoose.Schema({
  from: { type: String, require: true },
  to: [{
    email: { type: String },
    status: { type: Number, require: true, default: 1 },
    unread: { type: Boolean, require: true, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }],
  attachments:[{
    fileName:{type:String,require:true},
    fileSize:{type:Number,require:true},
    path: {type:String,require:true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  }],
  status: { type: Number, default: 1 ,require:true},
  body: { type: String },
  subject: { type: String },
  createdAt: { type: Date, default: Date.now,require:true },
  sentAt: { type: Date, default: Date.now,require:true },
  updatedAt: { type: Date, default: Date.now,require:true },
  repliedTo:{type:mongoose.Schema.Types.ObjectId,require:true},
  forwardedOf: { type:mongoose.Schema.Types.ObjectId,require:true},
  
});

module.exports = mongoose.model('message_info', message_info);