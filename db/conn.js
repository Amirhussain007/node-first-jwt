const mongoose=require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"Backendtest"
})
.then(()=>{
    console.log("Db Connected")
}).catch((err)=>{
    console.log(err)
})

const userSchema=new mongoose.Schema({
    Name:String,
    email:String,
    password:String,
})

const User=mongoose.model("User",userSchema)

module.exports=User


