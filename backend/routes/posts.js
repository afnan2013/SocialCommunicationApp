const express = require('express');

const router = express.Router();

const Post = require('../models/post');

// Addition od A post
router.post("", (req, res, next)=>{
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(createdPost=>{
    //console.log(createdPost);
    res.status(201).json({
      message: "Post added Successfully!",
      postId: createdPost._id
    });
  }).catch((err)=>{
    console.log("Post Addition Failed! \n"+err);
  });;

});

// Get All Posts
router.get("", (req, res, next)=>{
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

// Get A Post by its ID
router.get("/:id", (req, res, next)=>{
  Post.findById(req.params.id).then(postData=>{
    if(postData){
      res.status(200).json({
        message : "Post Fetched Successfully",
        post : postData
      });
    }else{
      res.status(404).json({
        message : "Post is not Found"
      });
    }
  }).catch(err=> {console.log(err);});
});

// Delete A post
router.delete("/:id", (req, res, next)=>{
  Post.deleteOne({_id: req.params.id})
    .then(result=>{
      console.log(result);
      res.status(200).json({ message: "Post Deleted!"});
    }).catch(err=>{console.log(err);});
});

// Update A Post
router.put("/:id", (req, res, next)=>{
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result=>{
    console.log(result);
    res.status(200).json({ message: "Post Updated!"})
    .catch(err=>{console.log(err)});
  });
});

module.exports = router;
