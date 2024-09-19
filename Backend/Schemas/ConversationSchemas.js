const mongoose=require("mongoose");
const { Schema }=mongoose


const conversation= new Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "user",
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "message",
				default: [],
			},
		],
	},
	{ timestamps: true }
);

module.exports=mongoose.model("conversation",conversation);