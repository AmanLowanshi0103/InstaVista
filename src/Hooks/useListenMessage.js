import { useEffect } from "react";

import { useSocketContext } from "../Context/SocketContext";
import { useMessageContext } from "../Context/MessageContext";

export const useListenMessage=()=>
{
    const {socket}=useSocketContext();
    const {message,setMessage}=useMessageContext();
    
    useEffect(()=>
        {
            socket?.on("newMessage",(newMessage)=>
                {
            console.log("tested")
            console.log(newMessage)
            setMessage([...message,newMessage])
        })
        return ()=> socket?.off("newMessage")
    }
    ,[socket,setMessage,message])
}