const mongoose=require("mongoose");
const { Schema }=mongoose

const PostSchemas= new Schema({
  User:
  {
    type :mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  userName:
  {
    type:String,
  },
  image:{
    type:String
  },
  likes:{
    type:Array
  },
  comment:{
    type:Array
  },
})

module.exports=mongoose.model("Post",PostSchemas)