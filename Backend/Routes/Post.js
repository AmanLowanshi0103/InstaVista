const express = require("express");
const router = express.Router();
const multer = require("multer");
const fetchUser = require("../Middle/fetchUser");
const path = require("path");
const Post = require("../Schemas/Postschemas");
const user= require("../Schemas/userSchemas")
const FetchAllPost = require("../AllpostdataRetrive");
global.commentid=1001;
const { MongoClient } = require("mongodb");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.post("/addpost", fetchUser, upload.single("file"), async (req, res) => {
  // console.log(req.user);
  let success = false;
  try {
    let User= await user.findOne({_id:req.user})
    // console.log(User);
    let post = await Post.create({
      User: req.user,
      userName:User.UserName,
      image: req.file.filename,
      likes: [],
      comment: [],
    });
    success = true;
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(401).send({ success, error: "Internal Server Error" });
  }
});

router.get("/allpostuser", fetchUser, async (req, res) => {
  let success = false;
  try {
    let post = await Post.find({ User: req.user });
    success = true;
    post.reverse();
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(401).send({ success, error: "Internal Server Error" });
  }
});

/// Get all post from the backend with the help of {GET} "LocalHost/allPost"


router.get("/allpost", async (req, res) => {
  console.log("testing the data retruve");
  const uri = "mongodb://localhost:27017/"; // Replace with your MongoDB URI
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = await client.db("InstaVista");
    const collection1 = await database.collection("posts");
    const document = await collection1.find({}).toArray();
    document.reverse();
    global.All_Post = document;
    res.json(All_Post);
    client.close();
  } catch (error) {
    console.log(error);
    res.status(401).send({ error: "Internal Server Error" });
  }
});

//  adding the Likes in the Post {POST}, "LocalHost/likes"
router.post("/likes",fetchUser,async(req,res)=>
{
  try{
      const {id,Liked}=req.body;
      if(Liked)
      {
        let DuplicateData= await Post.findOne({_id:id,likes:req.user})
        if(DuplicateData)
        {
          console.log("Test3")
          let post=await Post.findOneAndUpdate({_id:id},{$pull:{likes:req.user}})
          res.json(post);
        }
        else{
          console.log("Test1")
          let post=await Post.findOneAndUpdate({_id:id},{$push:{likes:req.user}})
          res.json(post);
        }
      }
      else{
        console.log("Test2")
        let post=await Post.findOneAndUpdate({_id:id},{$pull:{likes:req.user}})
        res.json(post);
      }
  }
  catch (error) {
    console.log(error.message)
    res.status(500).send({error:"Internal server Error2"})
  }
})

router.delete("/deletepost",fetchUser,async(req,res)=>
{
  try{
    const {id}=req.body;
    // console.log(id)
    let post=await Post.findByIdAndDelete({_id:id})
    res.json({"success":"Post successully deleted"}) 
  }
  catch (error) {
    console.log(error.message)
    res.status(500).send({error:"Internal server Error2"})
  }
})

router.post("/addcomment",fetchUser,async(req,res)=>
{
  try
  {
    const {id,desc}=req.body;
    // console.log(req.body)
    const data={};
    if(desc)
    {
      data.desc=desc;
    }
    let User = await user.findOne({_id:req.user})
    global.commentid=global.commentid+1;
    data.commentid=global.commentid;
    data.user=req.user;
    data.userName=User.UserName;
    let post=await Post.findOneAndUpdate({_id:id},{$push:{comment:data}})
    res.json(post);
  }
  catch (error) {
    console.log(error.message)
    res.status(500).send({error:"Internal server Error2"})
  }
})

router.delete("/deletecomment",fetchUser,async(req,res)=>
  {
    try
    {
      console.log(req.body)
      const {id,desc}=req.body;
      let post=await Post.findOneAndUpdate({_id:id}, { $pull: { comment: {desc:desc} } })
      res.json(post);
    }
    catch (error) {
      console.log(error.message)
      res.status(500).send({error:"Internal server Error2"})
    }
  })


// Profile Pic 

router.put("/uploadProfilePic", fetchUser, upload.single("file"), async (req, res) => {
  // console.log(req.user);
  let success = false;
  try {
    const update={}
    update.ProfileImage= req.file.filename;
    let User= await user.findByIdAndUpdate({_id:req.user},update,{new:true})
    success = true;
    res.json({"pic":User.ProfileImage});
  } catch (error) {
    console.log(error);
    res.status(401).send({ success, error: "Internal Server Error" });
  }
});
module.exports = router;
