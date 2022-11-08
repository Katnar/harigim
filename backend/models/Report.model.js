const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const {ObjectId} = mongoose.Schema;

const ReportSchema = new mongoose.Schema({
    name: {type: String,trim: true,required: true,maxlength: 32},
    lastname: {type: String,trim: true,required: true},
    personalnumber: {type: String,trim: true,require:true},
    cellphone:String,
    yhida:String,
    typevent:String,
    resevent:String,
    cli:String,
    yn:Boolean,
    selneshek:String,
    whap:String,
    amlahtype:String,
    rekemtype:String,
    mazavrekem:String,
    dwork:String,
    mataftype:String,
    apitype:String,
    mholaztype:String,
    mhalztype:String,
    pirot:String,
    datevent:Date,
    mikom:String,
    nifga:{type: Number,default:0},
}, {timestamps: true})

module.exports = mongoose.model("Report", ReportSchema);