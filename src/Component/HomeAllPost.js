import { useNavigate } from "react-router-dom";
import "../CssFile/HomeAllPost.css";

import { useEffect, useState } from "react";
import particularUserHooks from "../Hooks/particularUserHook"

import { FcLike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { CiHeart } from "react-icons/ci";


const images = require.context("../images", false, /\.(png|jpe?g|svg)$/);

const HomeAllPost = ({ id, image, likes, allPost, userName, comment,PostedByuserId }) => {
  const [Liked, SetLiked] = useState(true);
  const [CommentDisplay, SetCommentDisplay] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [desc, setdesc] = useState("");
  const [UserImage,setUserImage]=useState([]);
  let navi = useNavigate();

  const userData = async () => {
    try {
      const res=await particularUserHooks(PostedByuserId);
      console.log(res)
      setUserImage(res);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // Fetch comments and other data if necessary on mount
    SetCommentDisplay(comment);
  }, [comment]);

  useEffect(()=>
  {
    userData()
  },[])

  const toggleModal = () => {
    SetLiked(!Liked);
  };

  const toggleModalForComments = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onClick = async () => {
    console.log("Like button clicked for post " + id);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/instavista/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ id, Liked }),
      });

      if (!response.ok) throw new Error("Failed to like the post.");

      const res = await response.json();
      allPost();
    } catch (error) {
      console.error(error.message);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
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
      allPost();
    } catch (error) {
      console.error(error.message);
    }
  };

  const onDelete = async (descToDelete) => {
    try {
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
      allPost();
    } catch (error) {
      console.error(error.message);
    }
  };

  const userNameClick = (username) => {
    navi(`/profile/${username}`);
  };

  let imagePath;
  try {
    imagePath = images(`./${image}`);
  } catch (err) {
    console.error(err);
    imagePath = images("./test.jpg"); // Provide a default image path here
  }

  // another image function for profile 
  let profileImagePath;
  try {
    profileImagePath = images(`./${UserImage.ProfileImage}`);
  } catch (err) {
    console.error(err);
    profileImagePath = images("./test.jpg"); // Provide a default image path here
  }

  return (
    <div className="card-container">
      <div className="Home-Username">
       <img key={id} src={profileImagePath} className="image-heading" alt="..." />
        <button
          className="userName-heading"
          onClick={() => userNameClick(UserImage.UserName)}
        >
          {UserImage && UserImage.UserName}
        </button>
      </div>
      <hr className="userName-horizonatal" />
      <img key={id} src={imagePath} className="card-img-top" alt="..." />
      <div className="button-trip">
        <button
          className="button-card"
          onClick={() => {
            toggleModal();
            onClick();
          }}
        >
        {Liked?<FcLike/>:<CiHeart />}{likes.length}
        </button>
        <button className="button-card" onClick={toggleModalForComments}>
        <FaRegComment /> {CommentDisplay.length}
        </button>
        {isModalOpen && (
          <div className="commentModal">
            <div className="commentModal-content">
              <span className="close-btn" onClick={toggleModalForComments}>
                &times;
              </span>
              <h2>Comment</h2>
              <div className="allcomments">
                {CommentDisplay.map((e) => (
                  <div className="Comment_Main_Div" key={e._id}>
                    <div className="heading_div">
                    <div className="Comment_UserName">{e.userName}</div>
                    <div>
                    <button className="deletebutton" onClick={() => onDelete(e.desc)}><MdDeleteOutline /></button>
                    </div>
                    </div>
                    <hr className="hrline_div"></hr>
                    <div className="Comment_Description">{e.desc}</div>
                  </div>
                ))}
              </div>
              <form onSubmit={onSubmit}>
                <input
                  className="input21"
                  type="text"
                  name="desc"
                  id="desc"
                  placeholder="comment"
                  onChange={(e) => {
                    setdesc(e.target.value);
                  }}
                />
                <button className="button-submit-ProfilePage">Upload</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeAllPost;
