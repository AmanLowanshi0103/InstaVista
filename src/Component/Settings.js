import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import "./Setting.css";
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navi = useNavigate();
  const [User, setUser] = useState([]);
  const [AccountType1, setAccountType1] = useState("");

  const userData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/instavista/getuser`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch user data");
      const res = await response.json();
      // console.log(res)
      // setUser(res);
      setAccountType1(res[0].AccountType)
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Optional: Handle token expiration or other errors here
    }
  };

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

  useEffect(() => {
    userData();
  }, [AccountType1]);

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
