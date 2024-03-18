const express = require('express');
const {getCurrentUser} = require("../controller/user.js");
const userRouter = express.Router();



module.exports = userRouter;

userRouter
.get('/user', getCurrentUser)


userRouter.use("*", (req, res)=>{
    res.sendStatus(404);
  })

