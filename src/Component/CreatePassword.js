import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../CssFile/CreatePassword.css";

const CreatePassword = () => {
  const [newPassword, SetNewPassword] = useState("");
  let navi = useNavigate();
  const onClick = async () => {
    const Email = localStorage.getItem("Email");
    const Response = await fetch(
      "http://localhost:4000/api/instavista/updatepassword",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email, newPassword }),
      }
    );
    const res = await Response.json();
    if (res.success) {
      localStorage.removeItem("Email");
      navi("/");
    }
  };
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
            <p className="fg-p">Enter your new password</p>
            <input
              className="fg-inp"
              type="text"
              name="newPassword"
              id="newPassword"
              onChange={(e) => {
                SetNewPassword(e.target.value);
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
  );
};

export default CreatePassword;
