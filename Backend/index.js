const ConnectToMongoDB=require("./mgd")
const express=require("express")
var cors = require('cors')
const FetchAllPost=require("./AllpostdataRetrive.js")

const {app,server}=require("./socket.js");


const port=4000
app.use(cors())
app.use(express.json())
// app.use(express.static('public'))

app.use("/api/instavista",require("./Routes/User.js"))
app.use("/api/instavista",require("./Routes/Otp.js"))
app.use("/api/instavista",require("./Routes/Post.js"))
app.use("/api/instavista",require("./Routes/otheruser.js"))
app.use("/api/instavista",require("./Routes/Message.js"))

server.listen(port,()=>
{
    console.log(`Example app listening on port http://localhost:${port}`)
})
