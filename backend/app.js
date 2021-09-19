const express = require('express');

const app = express();


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
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: "Post added Successfully!"
  });
});

// Get All Posts
app.get("/api/posts", (req, res, next)=>{
  const posts = [
    {
      id:"sjhavshs",
      title: "First Post From Server",
      content: "This is the first post"
    },
    {
      id:"sasasasas",
      title: "Second Post From Server",
      content: "This is the Second post"
    },
  ];
  res.status(200).json({
    message : "Posts Fetched Successfully",
    posts : posts
  });
});

module.exports = app;
