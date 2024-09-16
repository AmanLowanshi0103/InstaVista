import React, { useState } from "react";
import { BrowserRouter as Router, Link, useNavigate } from "react-router-dom";
import "./Login.css"

const images = require.context('../images', false, /\.(png|jpe?g|svg)$/);

const Login = () => {
  const navi=useNavigate();
  const [LoginData,SetLoginData]=useState({
    Email:"",
    Password:""
  })
  const onChange=async(e)=>
  {
    SetLoginData({...LoginData,[e.target.name]:e.target.value})
  }
  const onSubmit=async(e)=>
  {
    e.preventDefault();
    const Response= await fetch("http://localhost:4000/api/instavista/loginuser",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(LoginData)
    })
    const Res= await Response.json();
    // console.log(Res);
    if(Res.success)
    {
      localStorage.setItem("token",Res.token);
      navi("/home")
    }
  }
  let imagePath;
  try {
      imagePath= images(`./backgroundphot.jpg`)
  } catch (err) {
    console.log(err)
  }

  return (
    <div className="div1">
      <div className="divc div2">
        <img className="img-login"
          src={imagePath}
          alt="Instagram Preview"
          />
      </div>
      <div className="divc div3">
        <div className="div4">
        <h1 className="h1-login">InstaVista</h1>
        </div>
        <div className="div5">
        <form onSubmit={onSubmit}>
          <input className="input1" type="text" name="Email" id="name" onChange={onChange} placeholder="Email"/>
          <input className="input1" type="password" name="Password" id="Password" onChange={onChange} placeholder="Password"/>
          <button className="button-login" type="submit">Log in</button>
        </form>
        <div className="div7">
        <Link className="Link-cs" to="/forgot-password">Forgot password?</Link>
        </div>
        </div>
        <div className="div6">
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
