const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const user = require("../Schemas/userSchemas");
const bcrypt = require("bcryptjs");
const SignJWT = "test123";
const jwt = require("jsonwebtoken");
const fectchUser = require("../Middle/fetchUser");
const { useState } = require("react");

// Route 1 : {Post} Create an user :api/instavista/createuser

router.post(
  "/createuser",
  [
    body("Email").isEmail(),
    body("FullName", "Please enter the name more than 3 characters").isLength({
      min: 2,
    }),
    body(
      "Password",
      "Please enter the Password more than 3 characters"
    ).isLength({ min: 2 }),
    body("UserName", "UserName should not be less than 5 characters").isLength({
      min: 2,
    }),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } //sending bad request when error accoured
    try {
      let User = await user.findOne({ Email: req.body.Email });
      console.log("Executed");
      if (User) {
        return res.status(400).json({ success, error: "user already exist" });
      }
      const salt = await bcrypt.genSaltSync(10);
      secpassword = await bcrypt.hashSync(req.body.Password, salt);
      User = await user.create({
        FullName: req.body.FullName,
        UserName: req.body.UserName,
        Email: req.body.Email,
        Password: secpassword,
        Follower: [],
        Following: [],
        Bio:"",
        AccountType:true,
        ProfileImage:""
      });
      data = {
        user: User.id,
      };
      console.log(data);
      success = true;
      let Token = jwt.sign(data, SignJWT);
      res.json({ success, Token });
      console.log("Executed 2");
    } catch (error) {
      res.status(500).json({ success, error: "Internal sever error" });
      console.log(error);
    }
  }
);

// Route 1 : {Post} Login:api/instavista/login

router.post(
  "/loginuser",
  [
    body("Email").isEmail(),
    body("Password", "Password should not be less than 5 characters").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() }); //sending bad request when error accoured
    }
    const { Email, Password } = req.body;
    try {
      let User = await user.findOne({ Email });
      if (!User) {
        return res.status(400).send({ success, error: "Invalid Credentials" });
      }
      const passwordCompare = await bcrypt.compare(Password, User.Password);
      if (!passwordCompare) {
        success = false;
        return res
          .status(400)
          .json({ success, erro: "please enter valid credentials" }); //sending bad request when error accoured
      }
      data = {
        user: User.id,
      };
      console.log(data);
      const token = jwt.sign(data, SignJWT); // creating a JasonWebToken to generate a unique token for decreasing the chance of a hacker to hack our website later verify that token to login into our website
      success = true;
      res.json({ success, token });
    } catch (error) {
      res.status(400).send({ success, error: "Internal Server Error" });
      console.log(error);
    }
  }
);

router.put("/updatepassword", async (req, res) => {
  let success = false;
  try {
    const { Email, newPassword } = req.body;
    // console.log(req.body);
    const Changepassword = {};

    const salt = await bcrypt.genSaltSync(10);
    const secpassword = await bcrypt.hashSync(newPassword, salt);
    if (newPassword) {
      Changepassword.Password = secpassword;
    }
    let User1 = await user.findOne({ Email: Email });
    if (!User1) {
      return res.status(400).send({ success, error: "User does not exists" });
    }
    let User = await user.findByIdAndUpdate(User1._id, Changepassword, {
      new: true,
    });
    success = true;
    res.json({ success, Status: "Password Changed success" });
  } catch (error) {
    res.status(400).send({ success, error: "Internal Server Error" });
    console.log(error);
  }
});

// Get user data /getuser : login required

router.get("/getuser", fectchUser, async (req, res) => {
  let success = false;
  try {
    let User = await user.find({ _id: req.user });
    res.json(User);
  } catch (error) {
    res.status(400).send({ success, error: "Internal Server Error" });
    console.log(error);
  }
});

// {Put} for updating user with the help of ("/updateuser")

router.put("/updateuser", fectchUser, async (req, res) => {
  let success = false;
  try {
    console.log(req.body)
    const { Email, FullName, UserName, Bio } = req.body; // Corrected here
    const Data = {};
    
    if (Email) {
      Data.Email = Email;
    }
    if (FullName) {
      Data.FullName = FullName;
    }
    if (UserName) {
      Data.UserName = UserName;
    }
    if (Bio) {
      Data.Bio = Bio;
    }

    console.log(Data);
    
    let User1 = await user.findOne({ _id: req.user }); // Corrected here
    if (!User1) {
      return res.status(400).send({ success, error: "User does not exist" });
    }
    
    let updatedUser = await user.findByIdAndUpdate(User1._id, Data, { new: true });
    success = true;
    res.json({success,updatedUser});

  } catch (error) {
    res.status(500).send({ success, error: "Internal server error" }); // Changed status code to 500 for server errors
    console.log(error);
  }
});


//  {Put} for updating user account type with the help of ("/changeaccouttype")

router.put("/changeaccouttype",fectchUser,async(req,res)=>
{
  try{
    console.log(req.user)
    let User1 = await user.findOne({ _id: req.user }); // Corrected here
    if (!User1) {
      return res.status(400).send({ success, error: "User does not exist" });
    }
    const Data={
      AccountType:!User1.AccountType
    }
    
    let updatedUser = await user.findByIdAndUpdate(User1._id, Data, { new: true });
    success = true;
    res.json({ success, updatedUser });
  }catch (error) {
    res.status(500).send({ success, error: "Internal server error" }); // Changed status code to 500 for server errors
    console.log(error);
  }
})



router.put("/loginCreatePassword",fectchUser,async(req,res)=>
{
  try
  {
    const {newPassword,oldPassword}=req.body;
    const Changepassword={}
    let User= await user.findOne({_id:req.user})
    const passwordCompare = await bcrypt.compare(oldPassword, User.Password);
    if(passwordCompare)
    {
      const salt = await bcrypt.genSaltSync(10);
      const secpassword = await bcrypt.hashSync(newPassword, salt);
      Changepassword.Password=secpassword;
      let User1 = await user.findByIdAndUpdate(User._id, Changepassword, {
        new: true,
      });
      success = true;
      res.json({ success, Status: "Password Changed success" });
    }
    else{
      success = false;
      res.json({ success, Status: "Invalid Old Password success" });
    }
  }
  catch (error) {
    res.status(500).send({ success, error: "Internal server error" }); // Changed status code to 500 for server errors
    console.log(error);
  }
})




router.get("/getallUser",async(req,res)=>
{
  try{
    let User=await user.find({});
    // console.log(User);
    res.json(User)
  }
  catch (error) {
    res.status(500).send({ success, error: "Internal server error" }); // Changed status code to 500 for server errors
    console.log(error);
  }
})



router.post("/getaparticularUserData",async(req,res)=>
{
   try
   {
    console.log("test for paritcu;lar user",req.body)
    const {PostedByuserId}=req.body;
    let User=await user.findOne({_id:PostedByuserId})
    if(!User)
    {
      return res.status(400).json({"Error":"user does not exists"})
    }
    res.json(User)
   }
   catch (error) {
    res.status(500).send({error: "Internal server error" }); // Changed status code to 500 for server errors
    console.log(error);
  }
})

module.exports = router;
