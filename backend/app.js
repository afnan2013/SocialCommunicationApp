const express = require('express');

const app = express();


app.use("/api/posts", (req, res, next)=>{
  const posts = [
    {
      id:"sjhavshs",
      title: "First Post",
      content: "This is the first post"
    },
    {
      id:"sasasasas",
      title: "Second Post",
      content: "This is the Second post"
    },
  ];
  res.status(200).json({
    message : "Posts Fetched Successfully",
    posts : posts
  });
});

module.exports = app;
