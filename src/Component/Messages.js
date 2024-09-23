import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

import "./Message.css";
import { useMessageContext } from "../Context/MessageContext";
import { useListenMessage } from "../Hooks/useListenMessage";

const Messages = () => {
  const [ProfileData, setProfileData] = useState({});
  const [sidebarUser, setSidebarUser] = useState([]);

  const [windowDisplay, setWindowDisplay] = useState(false);
  const [chatUserName, setChatUserName] = useState("");

  // for Storing messages
  const {message,setMessage}=useMessageContext();
  useListenMessage()

  // Render update
  const [Test,setTest]=useState(0)

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
    setProfileData(res);
    setSidebarUser(res[0].Following);
    console.log(res);
  };

  const onClick = async (chatuserName) => {
    setChatUserName(chatuserName);
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:4000/api/instavista/getall/${chatuserName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }
    );
    const res = await response.json();
    setMessage(res);
    setWindowDisplay(true);
  };

  const [TextMessage,setTextMessage]=useState("")

  const SendMessage=async()=>
  {
    const token=localStorage.getItem("token")
    const response=await fetch(`http://localhost:4000/api/instavista//send/${chatUserName}`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        token:token,
      },
      body:JSON.stringify({message:TextMessage})
    })
    const res=await response.json();
    console.log(res)
    setMessage([...message,TextMessage])
    setTextMessage("")
    onClick(chatUserName)
  }

  useEffect(() => {
    UserData1();
  }, []);


  return (
    <>
      <div>
        <Navbar></Navbar>
        <div className="chat-container">
          <div className="sidebar">
            {sidebarUser &&
              sidebarUser.map((e) => {
                return (
                  <div
                    className="contact"
                    onClick={() => {
                      onClick(e.OtherUserName);
                    }}
                  >
                    <div
                      className="avatar"
                      style={{ backgroundColor: "#ffcccb" }}
                    />
                    <div className="contact-name">{e.OtherUserName}</div>
                  </div>
                );
              })}
          </div>
          <div className="chat-window">
            {windowDisplay ? (
              <>
                <div className="chat-header">
                  <div className="chat-header-info">
                    <div className="chat-header-name">{chatUserName}</div>
                  </div>
                </div>
                {message &&
                  message.map((e) => {
                    return <div className="chat-messages">
                      <div
                        className={`message ${
                          ProfileData[0]._id == e.senderId ? "sent" : "received"
                        }`}
                      >
                        <div className="message-content">{e.message}</div>
                      </div>
                    </div>;
                  })}
              </>
            ) : (
              <div>Please Select any contact for Message</div>
            )}

            {/* Chat Input Box */}
            <div className="chat-input">
              <input type="text" onChange={(e)=>setTextMessage(e.target.value)} value={TextMessage}placeholder="Type your message here" />
              <button className="send-button" onClick={SendMessage}>Send</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;
