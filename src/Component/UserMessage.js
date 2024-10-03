import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams } from "react-router-dom";

// import useConversation from "../Zustand/useConversation"
import { useMessageContext } from "../Context/MessageContext";



import "./Message.css";
import { useListenMessage } from "../Hooks/useListenMessage";
import { useImplemetContext } from "../Context/ImplemetContext";

const UserMessage = () => {

  const [chatUserName, setChatUserName] = useState("");
  const [ProfileData,setProfileData]=useState({})

  // const {message,setMessage}=useConversation()

  const { username } = useParams();

  // for Storing messages
  const {message,setMessage}=useMessageContext();
  useListenMessage()


  const {LoginUserProfileData}=useImplemetContext();
  useEffect(()=>
  {
    console.log("tets")
    setProfileData(LoginUserProfileData);
  },[])


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
    setMessage(res);
    // setMessage(res)
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
    const res= await response.json();
    console.log(res)
    setTextMessage("")
    onClick(chatUserName)
  }
  
  useEffect(() => {
    // UserData1();
    setChatUserName(username)
    onClick(username)
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

