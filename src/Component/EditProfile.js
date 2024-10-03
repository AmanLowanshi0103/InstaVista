import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./EditProfile.css";
import { useImplemetContext } from "../Context/ImplemetContext";

const EditProfile = () => {
  let navi = useNavigate();
  const {setLoginUserProfileData}=useImplemetContext();
  const [ProfileDataUpdate, SetProfileDataUpdate] = useState({
    Email: "",
    FullName: "",
    UserName: "",
    Bio: "",
  });
  const onChange = (e) => {
    SetProfileDataUpdate({
      ...ProfileDataUpdate,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    const { Email, FullName, UserName, Bio } = ProfileDataUpdate;
    const response = await fetch(
      "http://localhost:4000/api/instavista/updateuser",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ Email, FullName, UserName, Bio }),
      }
    );
    const res = await response.json();
    if (res.success) {
      console.log(res.updatedUser)
      setLoginUserProfileData(res.updatedUser)
      navi("/profile");
    }
  };

  const Back = () => {
    navi("/profile");
  };
  return (
    <div className="Ep-box">
      <div className="Ep-common">
        <div>
          <h1 className="fgv-heading">InstaVista</h1>
        </div>
        <div>
        <form onSubmit={onSubmit}>
          <input
          className="Ep-Input"
            type="text"
            name="Email"
            id="Email"
            placeholder="Email"
            onChange={onChange}
            />
          <input
          className="Ep-Input"
            type="text"
            name="FullName"
            id="FullName"
            placeholder="Full Name"
            onChange={onChange}
            />
          <input
          className="Ep-Input"
            type="text"
            name="UserName"
            id="UserName"
            placeholder="Username"
            onChange={onChange}
            />
          <input
          className="Ep-Input"
            type="text"
            name="Bio"
            id="Bio"
            placeholder="Bio"
            onChange={onChange}
            />
          <button className="fg-button" type="submit">
            Update
          </button>
          <button type="button" className="fg-button" onClick={Back}>
            Back
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
