//jshint esversion:6
require('dotenv').config();
const express = require("express");
const path = require('path');
const fs = require('fs');
const methodOverride= require("method-override");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const Blog=require('./models/dlogdata');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const multer  = require('multer');
const upload = multer({ dest: 'public/uploads/' })
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
  }
});

const uploads = multer({
  storage: storage
}).single('file')
const dateTime = require('node-datetime');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'me',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(methodOverride("_method"));
mongoose.connect("mongodb+srv://Dlog_admin:dlogpassword@cluster0.2la1x.mongodb.net/test",{
  useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true 
} );

//Mongoose config
const userSchema = new mongoose.Schema({
  fname: String,
  username: String,
  password: String,
  age: String,
  gender: String
});
let info = {
  user_id:"",user_n:""
}
userSchema.plugin(findOrCreate);

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",async function(req, res){
  const blogss=await Blog.find({})
    res.render("home",{blogss});
  });

  


app.get("/login", function(req, res){
res.render("login");
});

app.get("/quiz",(req,res)=>{
  res.render("start.html");
});
app.get("/start",(req,res)=>{
  res.render("quiz.html");
})
app.get("/end",(req,res)=>{
  res.render("end.html");
})
app.get("/answers",(req,res)=>{
  res.render("index.html");
})

app.get('/register', function (req, res) {
  res.render('register.ejs', { message: '', user: '' });
});
app.get("/secrethome",async function(req, res){
  const blogss=await Blog.find({})
User.find({"secret": {$ne: null}}, function(err, foundUsers){
  if (err){
    console.log(err);
  } else {
    if (foundUsers) {
      
      res.render("secrethome", {blogss});
    }
  }
});
});
app.get("/secrets",async function(req, res){
  const blogss=await Blog.find({})
User.find({"secret": {$ne: null}}, function(err, foundUsers){
  if (err){
    console.log(err);
  } else {
    if (foundUsers) {
      
      res.render("secrets", {blogss});
    }
  }
});
});
app.get("/contribute",(req,res)=>{
  res.render("contribute");
});
app.get("/submit", function(req, res){
if (req.isAuthenticated()){
  res.render("submit");
} else {
  res.redirect("/login");
}
});

app.post("/submit", function(req, res){
const submittedSecret = req.body.secret;

//Once the user is authenticated and their session gets saved, their user details are saved to req.user.
// console.log(req.user.id);

User.findById(req.user.id, function(err, foundUser){
 
  if (err) {
    console.log(err);
  } else {
    if (foundUser) {
      foundUser.secret = submittedSecret;
      foundUser.save(function(){
        res.redirect("/secrets");
      });
    }
  }
});
});

app.get("/logout", function(req, res){
req.logout();
res.redirect("/");
});

app.post("/register", function (req, res) {
  const newUser = new User({ fname: req.body.fname, username: req.body.username,gender: req.body.gender,age: req.body.age, verify: false });
  if (req.body.password !== req.body.confirm_password) {
    res.render('register', { message: 'Password does not match', user: newUser });
  }
  else {
    User.findOne({ username: req.body.username }, function (err, foundUser) {
      if (err) {
        console.log(err);
      }
      else if (req.body.password.length < 6) {
        res.render('register', { message: 'Password must be atleast 6 characters long', user: newUser });
      }  
     else {
        if (foundUser) {
          res.render('register', { message: 'User already exists, please login', user: newUser });
        } else {
          User.register(newUser, req.body.password, function (err, user) {
            if (err) {
              console.log(err);
              res.redirect("/register");
            } else {
              res.redirect("/");
            }
          });
        }
      }
    });

  }
});
let x;
app.post("/login", function(req, res){

const user = new User({
  username: req.body.username,
  password: req.body.password
});

req.login(user, function(err){
  if (err) {
    console.log(err);
  } else {
    User.findOne({ username: req.body.username }, function (err, foundUser) {
      if(foundUser)
      {
        info.user_n=foundUser.fname;
        info.user_id=foundUser._id;
        
      }
    });
    
    passport.authenticate("local")(req, res, function(){
      
      res.redirect("/secrets");
    });
  }
});

});
//Restful Routes

//index
app.get("/blogs",async function(req,res){
  const blogs=await Blog.find({})
  const usercheck=info.user_id;
 
          res.render("index",{blogs,usercheck:usercheck});
          
})

//new
app.get("/blogs/new",async function(req,res){
  
  res.render("new");
  
})
//create
app.post("/blogs",uploads,function(req,res){
  const datetime = require('node-datetime');
const dt = datetime.create();
const formatted = dt.format('m/d/Y H:M:S');  

if(req.file) {
  
    const  x=new Blog({title:req.body.title,content:req.body.content,created:formatted,image:req.file.filename,user:info.user_n,user_id:info.user_id});
     x.save();
     
}
else{
  
  const  x=new Blog({title:req.body.title,content:req.body.content,created:formatted,user:info.user_n,user_id:info.user_id});
  
     x.save();
}
          res.redirect("/blogs");
  
})
// edit
app.get("/blogs/:id/edit",async (req,res)=>{
  const {id}=await req.params;
  //console.log(id);
  const newblog=await Blog.findById(id);
 
  res.render('edit',{newblog});
  
});
// update
app.post('/blogs/:id', uploads,async function(req, res) {
  const {id}=await req.params;
  const datetime = require('node-datetime');
  const dt = datetime.create();
  const formatted =await dt.format('m/d/Y H:M:S');  
  
 if(req.file){

const dataRecords={
  title:req.body.title,content:req.body.content,created:formatted,
    image:req.file.filename
    
}

  }else{

    const dataRecords={
      title:req.body.title,content:req.body.content,created:formatted
      
    }
  }


const update=await Blog.findByIdAndUpdate(id,dataRecords, {runValidators: true,new: true});

res.redirect('/blogs');
});


//delete
app.delete("/blogs/:id",async (req,res)=>{ 
  const {id}=await req.params;
  const blog=await Blog.findByIdAndDelete(id,req.body);
  res.redirect('/blogs');
  
});
  

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});