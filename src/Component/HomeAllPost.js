import { useNavigate } from "react-router-dom";
import "./HomeAllPost.css";
import { useEffect, useState } from "react";

const images = require.context("../images", false, /\.(png|jpe?g|svg)$/);

const HomeAllPost = ({ id, image, likes, allPost, userName, comment }) => {
  const [Liked, SetLiked] = useState(true);
  const [CommentDisplay, SetCommentDisplay] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [desc, setdesc] = useState("");
  let navi = useNavigate();

  useEffect(() => {
    // Fetch comments and other data if necessary on mount
    SetCommentDisplay(comment);
  }, [comment]);

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
    imagePath = images("./default.png"); // Provide a default image path here
  }

  return (
    <div className="card-container">
      <div className="Home-Username">
        <button
          className="userName-heading"
          onClick={() => userNameClick(userName)}
        >
          {userName}
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
          Likes ({likes.length})
        </button>
        <button className="button-card" onClick={toggleModalForComments}>
          Comment ({CommentDisplay.length})
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
                  <div key={e._id}>
                    <div>{e.userName}</div>
                    <div>{e.desc}</div>
                    <button onClick={() => onDelete(e.desc)}>Delete</button>
                  </div>
                ))}
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
