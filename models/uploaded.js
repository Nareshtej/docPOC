'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UploadDocumentSchema = mongoose.Schema({
    filesHash:Object,
    usertype:String,       
    created_at: String    
});


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://risabhsharma71:Rpqb123@ds111420.mlab.com:11420/care4u', { useMongoClient: true });

module.exports = mongoose.model('upload', UploadDocumentSchema);