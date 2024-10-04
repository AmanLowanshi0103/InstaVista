import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar"
import "../CssFile/Home.css"
import HomeAllPost from "./HomeAllPost";

const Home = () => {
  let navi=useNavigate()
  const [AllPost,SetAllPost]=useState([])
  const allPost=async ()=>
  {
    const response=await fetch("http://localhost:4000/api/instavista/allpost",{
      method:"GET",
    })
    const res=await response.json();
    // console.log(res)
    SetAllPost(res);
  }
  useEffect(()=>{
    if(!localStorage.getItem("token"))
    {
      navi("/")
    }
    allPost()
  },[])
  return (
    <>
    <div className="Main-Container-home">
    <div>
    <Navbar></Navbar>
    </div>
    <div className="Home-Conatianer">
      <div className="card-align"></div>
    {AllPost.map((e)=>
          {
            return <div className="grid-container"><HomeAllPost PostedByuserId={e.User} key={e.id+e.user} id={e._id} image={e.image} likes={e.likes} allPost={allPost} comment={e.comment}/></div>
          })
        }
    </div>
    </div>
    </>
  );
};

export default Home;
