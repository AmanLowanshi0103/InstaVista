
const { Server } =require("socket.io");
const http=require('http');
const express=require("express")

const app=express()

const server=http.createServer(app);
const io=new Server(server,{
    cors:
    {
        origin:["http://localhost:3000"],
        method:["GET","POST","PUT","DELETE"]
    }
});


const getReceiverSocketId=(receiverdId)=>
{
    return userSocketMap[receiverdId];
}


const userSocketMap={};

io.on('connection',(socket)=>
{
    console.log("a user has been connected",socket.id)

    const userId=socket.handshake.query.userId;
    if(userId != "undefined") userSocketMap[userId]=socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    
    socket.on("disconnect",()=>
    {
    console.log("a user has been disconnected",socket.id)
    delete userSocketMap[userId];
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
})

module.exports={app,io,server}