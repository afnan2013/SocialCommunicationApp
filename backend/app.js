const express = require('express');
const mongoose = require('mongoose');

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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

// Adding All Posts Routes
app.use("/api/posts", require('./routes/posts') );

module.exports = app;
