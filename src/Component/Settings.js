import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import "../CssFile/Setting.css";
import { useNavigate } from 'react-router-dom';

import { useImplemetContext } from "../Context/ImplemetContext";

const Settings = () => {
  const navi = useNavigate();
  const [User, setUser] = useState([]);
  const [AccountType1, setAccountType1] = useState("");


  const {LoginUserProfileData}=useImplemetContext();
  useEffect(()=>
  {
    setAccountType1(LoginUserProfileData.AccountType);
  },[])


  const onChange = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/instavista/changeaccouttype", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (!response.ok) throw new Error("Failed to change account type");
      const res = await response.json();
      setAccountType1(!AccountType1)
    } catch (error) {
      console.error("Error changing account type:", error);
    }
  };

  const onClick = () => {
    navi("/createnewpassword");
  };


  return (
    <div className='setting-Class'>
      <div>
        <Navbar />
      </div>
      <div className='main-setting-container'>
        <div className='setting-container'>
          <div>
            <h3>Account Setting</h3>
          </div>
          <div>
            <button className="forgotpas-button" onClick={onClick}>Change Password</button>
          </div>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              onChange={onChange}
              checked={AccountType1} // Ensure this is controlled by state
            />
            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
              Change it to public
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
