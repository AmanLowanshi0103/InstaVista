import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";



import "./Message.css";

const UserMessage = () => {

  const [chatUserName, setChatUserName] = useState("");
  const [ProfileData,setProfileData]=useState({})

  const { username } = useParams();



  // for Storing messages
  const [Conversation, setConversation] = useState([]);


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
    console.log(res);
  };

  const onClick = async (chatuserName) => {
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
    setConversation(res);
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
    const res=response.json();
    console.log(res)
    setTextMessage("")
    onClick(chatUserName)
  }
  
  useEffect(() => {
    UserData1();
    setChatUserName(username)
    onClick(chatUserName)
  }, []);


  return (
    <>
      <div>
        <Navbar></Navbar>
          <div className="chat-window">
                <div className="chat-header">
                  <div className="chat-header-info">
                    <div className="chat-header-name">{chatUserName}</div>
                  </div>
                </div>
                {Conversation &&
                  Conversation.map((e) => {
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
            {/* Chat Input Box */}
            <div className="chat-input">
              <input type="text" onChange={(e)=>setTextMessage(e.target.value)} value={TextMessage}placeholder="Type your message here" />
              <button className="send-button" onClick={SendMessage}>Send</button>
            </div>
          </div>
        </div>
    </>
  );
};

export default UserMessage;

