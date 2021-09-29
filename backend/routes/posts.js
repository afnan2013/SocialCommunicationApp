const { createECDH } = require('crypto');
const express = require('express');
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    console.log(file.originalname)
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

const Post = require('../models/post');

// Addition od A post
router.post("", multer({storage: storage}).single("image"),(req, res, next)=>{
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" +req.file.filename
  });
  post.save().then(createdPost=>{
    // console.log(createdPost);
    res.status(201).json({
      message: "Post added Successfully!",
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  }).catch((err)=>{
    console.log("Post Addition Failed! \n"+err);
  });;

});

// Get All Posts
router.get("", (req, res, next)=>{
  const currentPage = +req.query.pageindex; // + is to make these variales integer as they are strings from the queryString
  const pageSize = +req.query.pagesize;

  const postQuery = Post.find();
  if (currentPage && pageSize){
    postQuery.skip(pageSize * (currentPage-1))
      .limit(pageSize);
  }
  postQuery.then(
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
router.put("/:id", multer({storage: storage}).single("image"), (req, res, next)=>{
  const url = req.protocol + "://" + req.get("host");
  let post;
  // console.log(req.file);
  if (req.file){
    post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" +req.file.filename || null
    });

  }else{
    post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: req.body.imagePath
    });
  }

  Post.updateOne({_id: req.params.id}, post).then(result=>{
    // console.log(result);
    res.status(200).json({
      message: "Post Updated!",
      updatedPost: {
        ...post,
        id: post._id
      }
    });
  }).catch(err=> {console.log("Update: "+err)});
});

module.exports = router;
