import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../CssFile/Navbar.css";
import { BiSolidMessageRoundedMinus } from "react-icons/bi";
import { useImplementContext } from "../Context/ImplemetContext";
import { useState } from "react";

import { IoIosLogOut } from "react-icons/io";

const Navbar = () => {
  const [AllUser, setAllUser] = useState();
  const getAllUser = async () => {
    const response = await fetch(
      "http://localhost:4000/api/instavista/getAllUser",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const res = await response.json();
    setAllUser(res);
    console.log(res);
  };

  const [SearchData, setSearchData] = useState("");
  let Nav = useNavigate();
  const onClick = () => {
    localStorage.removeItem("token");
    Nav("/");
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const onClickSearchBar=async(UserName)=>
  {
    // console.log("Clicked",UserName)
    Nav(`/profile/${UserName}`);
  }

  return (
    <nav>
    <div className="nav">
      <div className="home">
        <h1>InstaVista</h1>
      </div>
      <div>
        <ul className="list">
          <li>
            <Link className="nav-content" aria-current="page" to="/home">
              Home
            </Link>
          </li>
          <li>
            <Link className="nav-content" to="/profile">
              Profile
            </Link>
          </li>
          <li>
            <Link className="nav-content" to="/settings">
              Settings
            </Link>
          </li>
          <li>
            <Link className="nav-content" to="/messages">
              Messages
            </Link>
          </li>
        </ul>
      </div>
      <div className="SearchBar">
        <div className="search-container">
          <input
            type="text"
            id="search"
            onChange={(e) => setSearchData(e.target.value)}
            placeholder="Type to search..."
            />
        </div>
        <div className="Display-Result">
          <ul>
            {!SearchData=="" && AllUser &&
              AllUser.filter((user) => user.FullName.includes(SearchData)).map(
                (user) => <div className="Display-Result1" onClick={()=>{onClickSearchBar(user.UserName)}} key={user._id}>{user.UserName}</div>
              )}
          </ul>
        </div>
      </div>
      <div>
        <button className="logout-button" onClick={onClick}>
        <IoIosLogOut />
        </button>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
