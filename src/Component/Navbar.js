import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { BiSolidMessageRoundedMinus } from "react-icons/bi";

const Navbar = () => {
  let Nav = useNavigate();
  const onClick = () => {
    localStorage.removeItem("token");
    Nav("/");
  };
  return (
    <nav className="navbar">
      <div className="home">
        <h1>InstaVista</h1>
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
        </ul>
      </div>
      <div>
        <button className="logout-button" onClick={onClick}>
          logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
