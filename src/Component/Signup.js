import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css"

const Signup = () => {
  const navi = useNavigate();

  const [SignUpData, SetSignUpData] = useState({
    email: "",
    fullname: "",
    username: "",
    password: "",
  });

  const onChange = (e) => {
    SetSignUpData({ ...SignUpData, [e.target.name]: e.target.value });
  };

  const Otpsend = async () => {
    const token = localStorage.getItem("token");
    const Response = await fetch(
      "http://localhost:4000/api/instavista/send-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }
    );
    const Res = await Response.json();
    console.log(Res);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, fullname, username, password } = SignUpData;
    const Response = await fetch(
      "http://localhost:4000/api/instavista/createuser",
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Email: email,
          FullName: fullname,
          UserName: username,
          Password: password,
        }),
      }
    );
    const data = await Response.json();
    console.log(data);
    if (data.success) {
      localStorage.setItem("token", data.Token);
      navi("/otpverification");
      Otpsend();
    }
  };

  return (
    <>
        <div className="SignUp">
          <div className="common">

          <div className="div2">
            <h1 className="signup-title">InstaVista</h1>
          </div>
          <div className="div3">  
          <form onSubmit={onSubmit}>
            <input
            className="input2"
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            onChange={onChange}
            />
            <input
            className="input2"
            type="text"
            name="fullname"
            id="fullname"
            placeholder="Full Name"
            onChange={onChange}
            />
            <input
            className="input2"
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            onChange={onChange}
            />
            <input
              className="input2"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              onChange={onChange}
              />
            <button  className="SignUp-Button" type="submit">
              Sign up
            </button>
          </form>
          </div>
          <div className="div4">
          <p className="login-link">
            Have an account? <Link to="/">Log in</Link>
          </p>
          </div>
          </div>
        </div>
    </>
  );
};

export default Signup;
