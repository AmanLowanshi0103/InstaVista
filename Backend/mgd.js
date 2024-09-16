const mongoose=require("mongoose")

const ConnectToMongoDB=async()=>
{
    try{
        await mongoose.connect(('mongodb://localhost:27017/InstaVista'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database Connected Sucessfully")
    }
    catch(error)
    {
        console.log(error.message)
    }
}

module.exports=ConnectToMongoDB();