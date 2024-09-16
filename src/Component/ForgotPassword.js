import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"

const ForgotPassword = () => {
  let navi=useNavigate()
  const [Email,SetEmail]=useState("");
  const onSubmit=async()=>
  {
    const Response= await fetch("http://localhost:4000/api/instavista/forgotpassword-send-otp",{
      method:"POST",
      headers:
      {
        "Content-Type":"application/json",
      },
      body:JSON.stringify({Email})
    })
    const Res=await Response.json();
    if(Res.success)
    {
      navi("/fgotpverification")
      localStorage.setItem("Email",Email)
    }
  }
  const onBack=()=>
  {
    navi("/")
  }

  return (
    <>
    <div className="forgotpassword-div">
      <div className="forgotpassword-box">
        <div className="fg-heading">
        <h1>
          <b>InstaVista</b>
        </h1>
        </div>
        <hr className="fg-hr"></hr>
        <div>
        <h4>Forgot Password</h4>
        </div>
        <div className="">
        <p className="fg-p">Enter the Email Id</p>
          <input
            className="fg-inp"
            type="Email"
            name="Email"
            id="Email"
            onChange={(e) => {
              SetEmail(e.target.value);
            }}
            />
        </div>
        <div className="">
          <button className="fg-button" onClick={onSubmit}>
            Submit
          </button>
          <button className="fg-button" onClick={onBack}>
            Back
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ForgotPassword;
