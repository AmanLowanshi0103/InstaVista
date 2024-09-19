const mongoose=require("mongoose");
const { Schema }=mongoose


const message= new Schema({
    senderId:
    {
        type :mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    receiverId:
    {
        type :mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    message:
    {
        type:String,
        required:true
    }
},{ timestamps: true });

module.exports=mongoose.model("message",message);