const express = require("express");
const fectchUser = require("../Middle/fetchUser");
const router = express.Router();
const Post = require("../Schemas/Postschemas");
const user= require("../Schemas/userSchemas")

router.get("/user/:userName",fectchUser,async(req,res)=>
{
    try{
        console.log(req.params.userName)
        let User= await user.findOne({UserName:req.params.userName})
        if(User._id==req.user)
        {
            let post=await Post.find({User:User._id})
            return res.json({LoginUser:true,SameUser:req.user,User,post})
        }
        if(User)
        {
            let post=await Post.find({User:User._id})
            return res.json({LoginUser:false,SameUser:req.user,User,post})
        }
        else
        {
            return res.status(500).json({"error":"user not find"})
        }
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({error:"Internal server Error2"})
    }
})

router.put("/followuser",fectchUser,async(req,res)=>
{
    try
    {
        const {OtherUser}=req.body;
        let UserOther = await user.findOne({_id:OtherUser})
        console.log(UserOther)
        let DataOther={}
        DataOther.OtherId=OtherUser;
        DataOther.OtherUserName=UserOther.UserName
        
        let DataReq={}
        let UserReq = await user.findOne({_id:req.user})
        DataReq.reqId=req.user;
        DataReq.UserName=UserReq.UserName
        let User= await user.findOneAndUpdate({_id:req.user},{$push:{Following:DataOther}})
        let User1= await user.findOneAndUpdate({_id:OtherUser},{$push:{Follower:DataReq}})
        res.json({success:true})
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({error:"Internal server Error2"})
    }
})

router.put("/unfollowuser",fectchUser,async(req,res)=>
    {
        try
        {
            const {OtherUser}=req.body;
            let User= await user.findOneAndUpdate({_id:req.user},{$pull:{Following:{OtherId:OtherUser}}})
            let User1= await user.findOneAndUpdate({_id:OtherUser},{$pull:{Follower:{reqId:req.user}}})
            res.json({User})
        }
        catch (error) {
            console.log(error.message)
            res.status(500).send({error:"Internal server Error2"})
        }
    })


module.exports = router;