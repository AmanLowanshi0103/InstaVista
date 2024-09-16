const { MongoClient }=require('mongodb')

async function FetchAllPost(){
    console.log("testing the data retruve")
    const uri = "mongodb://localhost:27017/"; // Replace with your MongoDB URI
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try{
        await client.connect();
        const database=client.db("InstaVista");
        const collection1=database.collection('posts');
        const document=await collection1.find({}).toArray();
        document.reverse();
        global.All_Post=document; 
    }
    finally {
        await client.close();
    }
}
FetchAllPost().catch(console.error);
module.exports=FetchAllPost();