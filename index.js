require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRouter = require("./routes/user.js");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const authRouter = require('./routes/auth.js');
const scriptRouter = require("./routes/script.js");

const server = express();

//db connection
main().catch(err => console.log("Error in database ->",err));
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log('database connected'); 
}



const auth = (req, res, next)=>{
  try {
    console.log("index.js auth process.env.PUBLIC_KEY", process.env.PUBLIC_KEY);
  const token = req?.get('Authorization')?.split('Bearer ');
  
    var decoded = jwt.verify(token[1],  process.env.PUBLIC_KEY);
   
    console.log(decoded);
    next();
  } catch (error) {
    res.status(401).send({error: error.message, doc: "user is not authenticated"});
  }
};


server.use(cors());
server.use(express.json());  
server.use(express.urlencoded());
server.use(morgan('combined')); 
server.use('/auth', authRouter);
server.use("/user", auth, userRouter);
server.use("/script", auth, scriptRouter);

server.use("*", (req, res)=>{
  res.sendStatus(404)
});





server.listen(process.env.PORT, ()=>{
    console.log('server started');
});