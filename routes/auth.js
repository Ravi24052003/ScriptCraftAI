const express = require("express");
const {signup, login} = require("../controller/auth.js");

const authRouter = express.Router();

module.exports = authRouter

authRouter
.post('/signup', signup)
.post('/login', login);

authRouter.use("*", (req, res)=>{
    res.sendStatus(404);
  });