import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import ProfilePagePost from "./ProfilePagePost";
import "./ProfilePage.css";

const images = require.context('../images', false, /\.(png|jpe?g|svg)$/);

const ProfilePage = () => {
  useEffect(() => {
    UserData1();
    AllPost();
  }, []);

  let navi = useNavigate();
  // Fetching the user data to display on the Profile Page
  const [ProfileData, SetProfileData] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenfollower, setIsModalOpenfollower] = useState(false);
  const [isModalOpenfollowing, setIsModalOpenfollowing] = useState(false);
  const [followerData,SetFollowerData]=useState([])
  const [followingData,SetFollowingData]=useState([])

  // hooks for profile picture
  const [PhotoModal,setPhotoModal]=useState(false)
  const [ProfilePic,setProfilePic]=useState({})





  // Function to toggle the modal
  const toggleModal = (e) => {
    e.preventDefault();
    setIsModalOpen(!isModalOpen);
  };

  // fetching the data of the user
  const [Bool, SetBool] = useState("true");
  const UserData1 = async () => {
    // console.log("test1");
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:4000/api/instavista/getuser",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }
    );
    const res = await response.json();
    SetProfileData(res);
  };
  

  // Add post for the user functionalti
  const [file, SetFile] = useState({});
  // const ref=useRef(null)
  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let formdata = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
    const file = fileInput.files;
    // console.log(file); // Should log a FileList or array
    // console.log(file[0]);
    if (file[0]) {
      formdata.append("file", file[0]);
    } else {
      console.error("No file selected.");
    }
    console.log(formdata.get("file"));

    const response = await fetch(
      "http://localhost:4000/api/instavista/addpost",
      {
        method: "Post",
        headers: {
          token: token,
        },
        body: formdata,
      }
    );
    const res = await response.json();
    navi("/profile"); //// we nedd to fix this because Image is appearing after refreshing the page
    setIsModalOpen(!isModalOpen);
    AllPost();
  };

  // fetching the all the post of the user
  const [ProfilePost, SetProfilePost] = useState([]);
  const AllPost = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:4000/api/instavista/allpostuser",
      {
        method: "GET",
        headers: {
          token: token,
        },
      }
    );
    const res = await response.json();
    let arr = Array.from(Object.entries(res), ([key, value]) => value);
    SetProfilePost(arr);
  };

  if (!ProfileData) {
    return <div>Loading...</div>; // Show a loading state while data is being fetched
  }

  const toggleModalforcommentsfollowing = () => {
    setIsModalOpenfollowing(false)
  };
  const toggleModalforcommentsfollower = () => {
    setIsModalOpenfollower(false)
  };

  const followerDisplay = () => {
    setIsModalOpenfollower(true)
    SetFollowerData(ProfileData[0].Follower)
    console.log(followerData)
  };
  const followingDisplay = () => {
    setIsModalOpenfollowing(true)
    SetFollowingData(ProfileData[0].Following)
    console.log(followingData)
  };



 
// profile pic upload for the user

  const photo_upload=async()=>
  {
    setPhotoModal(true)
  }
  const toggleModalforphotoModal = () => {
    setPhotoModal(false)
  };


  const onSubmitProfilePic=async(e)=>
  {
    e.preventDefault();
    const token = localStorage.getItem("token");
    let formdata = new FormData();
    const fileInput = document.getElementById("profilepic")
    const file = fileInput.files;
    // console.log(file); // Should log a FileList or array
    // console.log(file[0]);
    if (file[0]) {
      formdata.append("file", file[0]);
    } else {
      console.error("No file selected.");
    }
    console.log(formdata.get("file"));

    const response = await fetch(
      "http://localhost:4000/api/instavista/uploadProfilePic",
      {
        method: "PUT",
        headers: {
          token: token,
        },
        body: formdata,
      }
    );
    const res = await response.json();
    navi("/profile"); 
    setPhotoModal(!PhotoModal);
  }

  let imagePath;
  try {
    // Dynamically require the image using the context
    if(ProfileData[0].ProfileImage)
    {
      imagePath = images(`./${ProfileData[0].ProfileImage}`);
    }
    else{
      imagePath= images(`./test.jpg`)
    }
  } catch (err) {
    // Fallback to a default image if the specific image is not found
    console.log(err)
  }


  return (
    <>
      <div className="main-container-profilepage-first">
        <div>
          <Navbar></Navbar>
        </div>
        <div className="common-container-div">
          <div className="profile-page">
            <div className="Image-and-profilediv">
              <div className="image-and-profile">
                <div className="image-div">
                  <img
                    src={imagePath}
                    alt="Profile"
                    className="profile-pic"
                    onClick={photo_upload}
                  />
                </div>
                {PhotoModal && (
                <div className="modal">
                  <div className="modal-content">
                    <span className="close-btn" onClick={toggleModalforphotoModal}>
                      &times;
                    </span>
                    <h2>Add Post</h2>
                    <form onSubmit={onSubmitProfilePic}>
                      <input
                        id="profilepic"
                        type="file"
                        enctype="multipart/form-data"
                        accept="image/*"
                        onChange={(e) => setProfilePic(e.target.files)}
                      />
                      <button className="button-sumbit-ProfilePage">
                        Upload
                      </button>
                    </form>
                  </div>
                </div>
              )}
                <div className="profile-info">
                  <h1>{ProfileData[0].UserName}</h1>
                  <div className="stats">
                    <span>
                      {ProfilePost.length} posts
                    </span>
                    <button className="profilebutton" onClick={followerDisplay}>
                      {ProfileData[0].Follower.length} followers
                    </button>
                    <button className="profilebutton" onClick={followingDisplay}>
                      {ProfileData[0].Following.length} following
                    </button>
                  </div>
                  {isModalOpenfollower && (
                    <div className="commentModal">
                      <div className="commentModal-content">
                        <span
                          className="close-btn"
                          onClick={toggleModalforcommentsfollower}
                        >
                          &times;
                        </span>
                        <h2>Follower</h2>
                        <div>
                          {followerData && followerData.map((e)=>
                          (
                            <div>
                              {e.UserName}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {isModalOpenfollowing && (
                    <div className="commentModal">
                      <div className="commentModal-content">
                        <span
                          className="close-btn"
                          onClick={toggleModalforcommentsfollowing}
                        >
                          &times;
                        </span>
                        <h2>Following</h2>
                        <div>
                        {followingData && followingData.map((e)=>
                          (
                            <div>
                              {e.OtherUserName}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="profile-name">{ProfileData[0].FullName}</p>
                  <p className="bio">{ProfileData[0].Bio}</p>
                </div>
              </div>
              <div className="button-div">
                <button
                  className="edit-profile"
                  onClick={() => {
                    navi("/editprofile");
                  }}
                >
                  Edit profile
                </button>
                <button className="AddPost-button" onClick={toggleModal}>
                  Add Post
                </button>
              </div>
              {isModalOpen && (
                <div className="modal">
                  <div className="modal-content">
                    <span className="close-btn" onClick={toggleModal}>
                      &times;
                    </span>
                    <h2>Add Post</h2>
                    <form onSubmit={onSubmit}>
                      <input
                        type="file"
                        enctype="multipart/form-data"
                        accept="image/*"
                        onChange={(e) => SetFile(e.target.files)}
                      />
                      <button className="button-sumbit-ProfilePage">
                        Upload
                      </button>
                    </form>
                  </div>
                </div>
              )}
              <div className="Post-div">
                {ProfilePost.map((e) => {
                  return (
                    <div className="2">
                      <ProfilePagePost
                        id={e._id}
                        image={e.image}
                        likes={e.likes}
                        AllPost={AllPost}
                        checkUser={true}
                        comment={e.comment}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
