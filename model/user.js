const mongoose = require('mongoose');


// Schema
const userSchema = new mongoose.Schema({
  firstName: {type: String, required: [true, "First name is required"]},
  lastName: {
    type: String
  },
  email: {
    type: String,
    unique: [true, "Email {VALUE} already exists"],
    validate: {
        validator: (v)=>{
         return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props)=> `${props.value} is not a valid email address`
    },
    required: [true, "Email is required"]
  },

  password: {type: String,
    validate: {
        validator: (v)=>{
          return !/\s/.test(v);
        },
        message: (props)=> "Password should not contain space characters"
    },

    minlength: [8, "Password length should not be below 8"], required: [true, "Password is required"]
  },
  token: String,
  date: {
    type: Date,
    default: Date.now
 },
  userScripts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Script"
    }
  ]
  });

const User = mongoose.model('User', userSchema);

module.exports = User