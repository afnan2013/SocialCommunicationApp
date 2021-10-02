const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/user');

router.post("/login", (req, res, next)=>{
  User.findOne({email: req.body.email}).then(user=>{
    if (!user){
      return res.status(401).json({
        message: "OOps...Email is not registered! Please Sign Up",
      });
    }
    bcrypt.compare(req.body.password, user.password).then(result =>{
      if(!result){
        return res.status(401).json({
          message: "Password is invalid"
        });
      }
      const token = jwt.sign({email: user.email, id: user._id}, "secret_key_need_longer", {expiresIn: "1h"});
      res.status(200).json({
        token: token,
        expiresIn: 3600
      });
    });
  }).catch(err=>console.log(err));
});

router.post("/signup", (req, res, next)=>{
  bcrypt.genSalt(10).then(salt=>{
    bcrypt.hash(req.body.password, salt).then(hash=>{
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
      .then((user) => {
        res.status(200).json({
          message: "User Created",
          authUser: user
        });
      }).catch(err=>{
        console.log(err);
        res.status(400).json({
          message: "Email is already Registered!",
          authUser: user
        });
      });
    });
  });


  // // generate salt to hash password
  // const salt = await bcrypt.genSalt(10);
  // // now we set user password to hashed password
  // user.password = await bcrypt.hash(user.password, salt);

});

module.exports = router;
