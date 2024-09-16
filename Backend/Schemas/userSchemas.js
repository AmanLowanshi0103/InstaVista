const { type } = require("@testing-library/user-event/dist/type");
const mongoose = require("mongoose");

const { Schema }=mongoose

const userSchemas= new Schema(
{
    FullName:{
        type:String,
        required: true
    },
    Email:{
        type:String,
        required: true,
        unique:true
    },
    Password:{
        type:String,
        required: true
    },
    UserName:{
        type:String,
        required: true,
        unique:true
    },
    ProfileImage:{
        type:String,
    },
    Follower:
    {
        type:Array
    },
    Following:
    {
        type:Array
    },
    Bio:
    {
        type:String
    },
    AccountType:
    {
        type:Boolean
    }
})

module.exports=mongoose.model("user",userSchemas)