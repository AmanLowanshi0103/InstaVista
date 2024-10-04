import React, { useState } from 'react'
import Navbar from './Navbar'
import { useNavigate } from 'react-router-dom'

import "../CssFile/CreateNewPassword.css"

const CreateNewPassword = () => {
    let navi=useNavigate();
    const [oldPassword,setOldPassword]=useState("")
    const [newPassword,setNewPassword]=useState("")
    const onClick=async()=>
    {
        const token=localStorage.getItem("token");
        const response= await fetch("http://localhost:4000/api/instavista/loginCreatePassword",{
            method:"PUT",
            headers:
            {
                "Content-Type":"application/json",
                token:token,
            },
            body:JSON.stringify({oldPassword,newPassword})
        }) 
        const res= await response.json();
        console.log(res)   
        if(res.success)
        {
            navi("/settings")
        }
    }
  return (
    <>
    <div className="fg-otp-div">
        <div className="cp-common">
          <div>
            <h1 className="fgv-heading">
              <b>InstaVista</b>
            </h1>
          </div>
          <div>
            <h3>Password</h3>
          </div>
          <div className="">
            <p className="fg-p">Enter your Old password</p>
            <input
              className="fg-inp"
              type="text"
              name="newPassword"
              id="newPassword"
              onChange={(e) => {
                setOldPassword(e.target.value);
              }}
            />
          </div>
          <div className="">
            <p className="fg-p">Enter your New password</p>
            <input
              className="fg-inp"
              type="text"
              name="newPassword"
              id="newPassword"
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
            />
          </div>
          <div className="">
            <button className="fg-button" onClick={onClick}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateNewPassword
