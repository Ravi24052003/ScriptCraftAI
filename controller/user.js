const User = require("../model/user.js");

  exports.getCurrentUser = async (req, res)=>{
    try {
      const token = req?.get('Authorization')?.split('Bearer ');

       const user = await User.findOne({'token': token[1]}).select("-password -token -userScripts");
   
    res.json(user)
    } catch (error) {
      res.status(400).json(error);
    }
  }

