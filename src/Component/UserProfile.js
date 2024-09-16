import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";
import ProfilePagePost from "./ProfilePagePost";
import "./ProfilePage.css";


const images = require.context('../images', false, /\.(png|jpe?g|svg)$/);

const UserProfile = () => {
  const { userName } = useParams();
  const navigate = useNavigate();
  const [userProfileData, setUserProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userData();
  }, []);

  const userData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/instavista/user/${userName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: token,
          },
        }
      );
      const res = await response.json();
      setUserProfileData(res.User);
      setUserPosts(res.post);
      setIsLoggedInUser(res.SameUser);
      setFollowers(res.User?.Follower || []);
      setFollowing(res.User?.Following || []);
      setLoading(false);

      if (res.LoginUser) {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const followUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:4000/api/instavista/followuser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ OtherUser: userProfileData._id }),
      });
      userData();
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const unfollowUser = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:4000/api/instavista/unfollowuser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
        body: JSON.stringify({ OtherUser: userProfileData._id }),
      });
      userData();
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while data is being fetched
  }

  if (!userProfileData) {
    return <div>User not found.</div>; // Handle case when user data is not available
  }

  const isFollowing = followers.some((follower) => follower.reqId === isLoggedInUser);


  let imagePath;
  try {
    // Dynamically require the image using the context
    if(userProfileData.ProfileImage)
    {
      imagePath = images(`./${userProfileData.ProfileImage}`);
    }
    else{
      imagePath= images(`./test.jpg`)
    }
  } catch (err) {
    // Fallback to a default image if the specific image is not found
    console.log(err)
  }

  return (
    <div className="main-container-profilepage-first">
      <Navbar />
      <div className="common-container-div">
        <div className="profile-page">
          <div className="Image-and-profilediv">
            <div className="image-and-profile">
              <div className="image-div">
                <img
                  src={imagePath}
                  alt="Profile"
                  className="profile-pic"
                />
              </div>
              <div className="profile-info">
                <h1>{userProfileData.UserName}</h1>
                <div className="stats">
                  <span>
                    <strong>{userPosts.length}</strong> posts
                  </span>
                  <span>
                    <strong>{followers.length}</strong> followers
                  </span>
                  <span>
                    <strong>{following.length}</strong> following
                  </span>
                </div>
                <p className="profile-name">{userProfileData.FullName}</p>
                <p className="bio">{userProfileData.Bio}</p>
              </div>
            </div>
            {isFollowing ? (
              <button className="edit-profile" onClick={unfollowUser}>
                Unfollow
              </button>
            ) : (
              <button className="edit-profile" onClick={followUser}>
                Follow
              </button>
            )}

            <div className="Post-div">
              {!userProfileData.AccountType || isFollowing ? (
                userPosts.map((post) => (
                  <div key={post._id} className="post-container">
                    <ProfilePagePost
                      id={post._id}
                      image={post.image}
                      likes={post.likes}
                      AllPost={userData}
                      checkUser={false}
                      comment={post.comment}
                    />
                  </div>
                ))
              ) : (
                <div>This account is private</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
