


import "./ProfilePagePost.css"
import { useEffect, useState } from "react";

import { FcLike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { CiHeart } from "react-icons/ci";


const images = require.context('../images', false, /\.(png|jpe?g|svg)$/);

const ProfilePagePost = ({id, image,likes,AllPost,checkUser,comment }) => {

  const [Liked,SetLiked]=useState(true)
  const [CommentDisplay, SetCommentDisplay] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [desc, setdesc] = useState("");

  const toggleModal = (e) => {
    SetLiked(!Liked);
  };

  useEffect(() => {
    // Fetch comments and other data if necessary on mount
    SetCommentDisplay(comment);
    // console.log(CommentDisplay)
  }, [comment]);

  const onClick=async()=>
  {
    const token=localStorage.getItem("token");
    const Response= await fetch("http://localhost:4000/api/instavista/likes",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        token:token,
      },
      body:JSON.stringify({id,Liked})
    })
    const res=await Response.json(); 
    AllPost()
  }

  const onDelete=async()=>
  {
    const token=localStorage.getItem("token");
    // console.log("linked button has been clicked "+id)
    const Response=await fetch("http://localhost:4000/api/instavista/deletepost",{
      method:"DELETE",
      headers:
      {
        "Content-Type":"application/json",
        token:token,
      },
      body:JSON.stringify({id})
    })
    const res= await Response.json();
    AllPost()
    console.log(res)
  }


  let imagePath;
  try {
    // Dynamically require the image using the context
    imagePath = images(`./${image}`);
  } catch (err) {
    // Fallback to a default image if the specific image is not found
    console.log(err)
  }
  
  // for comment modal 
  

  const toggleModalforcomments = (e) => {
    setIsModalOpen(!isModalOpen);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log("Add Comment")
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4000/api/instavista/addcomment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ id, desc }),
        }
      );

      if (!response.ok) throw new Error("Failed to add comment.");

      const res = await response.json();
      SetCommentDisplay(res.comment);
      AllPost();
    } catch (error) {
      console.error(error.message);
    }
  };

  const onDeletecommet = async (descToDelete) => {
    try {
      // console.log("Delete")
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:4000/api/instavista/deletecomment",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
          body: JSON.stringify({ id, desc: descToDelete }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete comment.");

      const res = await response.json();
      SetCommentDisplay(res.comment);
      AllPost();
    } catch (error) {
      console.error(error.message);
    }
  };
  
  return <div class="profile-card" >
  <img key={id} src={imagePath} class="profile-card-img-top" alt="..." />
  <div className="Post-button">
  <button className="button-post" onClick={(e)=>{toggleModal();onClick()}}>{!Liked?<FcLike/>:<CiHeart />}{likes.length}</button>
  <button className="button-post" onClick={toggleModalforcomments}><FaRegComment />{CommentDisplay.length}</button>
  {isModalOpen && (
          <div className="commentModal">
            <div className="commentModal-content">
              <span className="close-btn" onClick={toggleModalforcomments}>
                &times;
              </span>
              <h2>Comment</h2>
              <div className="allcomments">
                {CommentDisplay.map((e) => {
                  return (
                    <div>
                      <div>{e.userName}</div>
                      <div>{e.desc}</div>
                      <button onClick={()=>onDeletecommet(e.desc)}><MdDeleteOutline /></button>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={onSubmit}>
                <input
                  className="input2"
                  type="text"
                  name="desc"
                  id="desc"
                  placeholder="comment"
                  onChange={(e) => {
                    setdesc(e.target.value);
                  }}
                />
                <button className="button-sumbit-ProfilePage">Upload</button>
              </form>
            </div>
          </div>
        )}
  {checkUser && <button className="button-post" onClick={(e)=>{onDelete()}}><MdDeleteOutline /></button>
  }
  </div>
  </div>
};

export default ProfilePagePost;

