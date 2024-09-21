const express = require("express");
const fectchUser = require("../Middle/fetchUser");
const Conversation = require("../Schemas/ConversationSchemas");
const Message=require("../Schemas/MessageSchemas")
const user = require("../Schemas/userSchemas");
const { getReceiverSocketId } = require("../socket");
const router = express.Router();

router.get("/getall/:username", fectchUser,async(req,res)=>
{
    try
    {
        const {username}=req.params;
        let chatUser= await user.findOne({UserName:username})
        if(!chatUser)
        {
            res.status(400).send({"error":"user not found to messaage"})
        }

        const conversation = await Conversation.findOne({
            participants:{$all:[req.user,chatUser.id]}
        }).populate("messages")
		if (!conversation) return res.status(200).json([]);
		const messages = conversation.messages;
		res.status(200).json(messages);
    }
    catch (error) {
        console.log(error.message)
        res.status(500).send({error:"Internal server Error2"})
    }
});
router.post("/send/:username", fectchUser, async(req,res)=>{

    try {
		const { message } = req.body;

        let chatUser= await user.findOne({UserName:req.params.username})
        if(!chatUser)
        {
            res.status(400).send({"error":"user Not found"})
        }

		let conversation = await Conversation.findOne({
			participants: { $all: [req.user, chatUser.id] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [req.user, chatUser.id],
			});
		}

		const newMessage = new Message({
			senderId:req.user,
			receiverId:chatUser._id,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}


		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);

		// SOCKET IO FUNCTIONALITY WILL GO HER

		const receiverSocketId=getReceiverSocketId(chatUser._id);
		if(receiverSocketId)
		{
			io.to(receiverSocketId).emit("newMessage",newMessage)
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
});

module.exports=router