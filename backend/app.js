const express = require('express');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect('mongodb+srv://phoenix01:sadia1472@meancluster.ntj96.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(()=> {
    console.log('MongoDB Connected');
  }).catch((err)=>{
    console.log('Connection Failed to MongoDB! \n'+err);
  });

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// For CORS (Cross Origin Resource Sharing), As we have hosted our node server and Angular on different servers or domains
// that's why we have to allow this headers so that browser wont block this response, ex: Cross-Site Request Forgery (CSRF) security issue
app.use((req, res, next)=>{
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

// Addition od A post
app.post("/api/posts", (req, res, next)=>{
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(()=>{
    //console.log(post);
    res.status(201).json({
      message: "Post added Successfully!"
    }).catch((err)=>{
      console.log("Post Addition Failed! \n"+err);
    });
  });

});

// Get All Posts
app.get("/api/posts", (req, res, next)=>{
  Post.find().then(
    (documents)=>{
      //console.log(documents);
      res.status(200).json({
        message : "Posts Fetched Successfully",
        posts : documents
      });
    }
  ).catch((err)=>{
    console.log(err);
  });

});

module.exports = app;
