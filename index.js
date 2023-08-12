const express=require("express")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
require("cookie-parser")
const path=require("path");
const message = require("./db/conn");
const cookieParser = require("cookie-parser");
const User = require("./db/conn");
const app=express();
require("./db/conn");
const port=process.env.PORT || 3000 



const users=[];

// middlewares
app.use(express.static(path.join(path.resolve(),"public")))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.set("view engine","ejs")

const isAuthenticated=async(req,res,next)=>{
    const{token}=req.cookies;
     if(token){
    const decoded=jwt.verify(token, "jhvuyjvhjvhj")
    req.user=await User.findById(decoded._id)
        next();
     }
     else{
        res.redirect("/login");
     }

}
app.get("/",isAuthenticated,(req,res)=>{
    res.render("logout",{name:req.user.name})
}) 
app.get("/login",(req,res)=>{
    res.render("login")
}) 
app.get("/register",(req,res)=>{
    res.render("register")
}) 

app.post("/login", async(req,res)=>{
    const {email, password } =req.body;
    let user=await User.findOne({email})
    if(!user) return res.redirect("/register")

    const isMatch = bcrypt.compare(password, user.password)

    
    if(!isMatch) return res.render("login", {email, message:"Incorrect Password"})
    
    const token=jwt.sign({_id:user._id},"jhvuyjvhjvhj")

    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000)
    })
});
   
app.post("/register", async(req,res)=>{
     const {name, email,password}= req.body;

     let user=await User.findOne({email})
     if(user){
      return  res.redirect("/login")
    }
     const hashedPassword=await bcrypt.hashedPassword

     user= await User.create({
        name,
        email,
        password:hashedPassword,
     });


     const token=jwt.sign({_id:user._id},"jhvuyjvhjvhj")

    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000)
    })
   res.redirect("/");
   
})
app.get("/logout", (req,res)=>{
    res.cookie("token",null,{
        httpOnly:true,
        expires:new Date(Date.now())
    })
   res.redirect("/");
   
})
// app.get("/add", async(req,res)=>{

//     message.create({name:"Harry2", email:"harry@test.com"})
//         res.send("Nice");
//     })

// app.get("/success", (req,res)=>{
//     res.render("success")
   
// })
// app.post("/", async(req,res)=>{
//    const {name,email} = req.body;
//   await message.create({name, email})
//    res.redirect("/success")
// })

// app.get("/users", (req,res)=>{
//     res.json({
//         users,
//     })
   
// })

app.listen(port,()=>{
    console.log(`Server is working ${port}`)
})