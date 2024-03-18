const jwt = require("jsonwebtoken");
const User = require("../model/user.js");
const bcrypt = require("bcrypt");


exports.signup = async (req, res)=>{
  try {
    const user = new User(req.body);

    await user.save();

    var token = jwt.sign({email: req.body.email}, process.env.PRIVATE_KEY, {algorithm: 'RS256', expiresIn: '60m'});

    const hash = bcrypt.hashSync(String(req.body.password), 10);

    user.token = token;
    user.password = hash;
  
    await user.save();
  
      res.status(201).json({token});
  } catch (error) {
    res.status(400).json({error});
  }

  }


  exports.login = async (req, res)=>{
    try {
      const user = await User.findOne({email: req.body.email});

      if(user === null){
        let obj = {};
        
        const checkEmailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email);

        if(!checkEmailFormat){
          obj.emailError = `${req.body.email} is not a valid email`;
        }

        if((req.body.email.trim() === "") || (req.body.email === undefined)){
         obj.emailError = "Email is required";
        }

        if(obj.emailError){
          res.status(400).json({error: obj});
          return;
        }

        res.status(400).json({error: {emailError: `Email ${req.body.email} doesn't exists`}});
        return;
      }

      const isAuth = bcrypt.compareSync(String(req.body.password), user.password);
     

      if(isAuth){
        var token = jwt.sign({email: req.body.email},  process.env.PRIVATE_KEY, {algorithm: 'RS256', expiresIn: '60m'});

       
        user.token = token;

        const data = await user.save();


        res.status(201).json({token});
      }
      else{

        let obj = {};
        let passwordStr = String(req.body.password);

        if(req.body.password.length < 8 ){
         obj.passwordError = "Password length should not be below 8";
        }

        if((passwordStr.trim() === "") || (req.body.password === undefined)){
          obj.passwordError = "Password is required";
        }

        if(obj.passwordError){
          res.status(401).json({error: obj});
          return;
        }

        res.status(401).json({error: {passwordError: "Password is incorrect"}});
      }
  
    } catch (error) {
      res.status(401).json({error: error.message});
    } 
  }