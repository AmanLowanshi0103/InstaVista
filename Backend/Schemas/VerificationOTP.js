const mongoose = require("mongoose");

const { Schema }=mongoose

const Verification= new Schema({
    email:String,
    otp:String,
    createdAt: Date,
    expiredAt: Date,
})

module.exports=mongoose.model("OTP",Verification)