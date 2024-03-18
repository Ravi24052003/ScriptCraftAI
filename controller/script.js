const Script = require("../model/script.js");
const User = require("../model/user.js");

const moment = require('moment-timezone');
const { default: axios } = require("axios");
const { default: OpenAI } = require("openai");


exports.createScript = async (req, res)=>{
    try {
        const token = req?.get('Authorization')?.split('Bearer ');
  
         const user = await User.findOne({'token': token[1]});
     

         if(req.body?.scriptTitle.trim() === ""){
          delete req.body?.scriptTitle
          }
   
          if(req.body?.genre.trim() === ""){
           delete req.body?.genre
           }

           if(req.body?.script.trim()=== ""){
            res.status(400).json({createScriptError: "script is required"});

            return;
           }

        const script = new Script(req.body);
        
       const text = script?.script?.trim();

       const words = text.split(/\s+/);

       script.wordCount = words?.length;

        script.owner = user._id;

        const dateIndia = moment.tz(Date.now(), "Asia/Kolkata");

        script.createdAtIst = String(dateIndia);

        await script.save();

        user.userScripts = [script, ...user.userScripts];

        await user.save();

        res.status(201).json(script);
        
      } catch (error) {
        res.status(400).json({createScriptError: error.message});
      }
}



exports.updateScript = async (req, res)=>{ 
  try {
    const token = req?.get('Authorization')?.split('Bearer ');

    const user = await User.findOne({token: token[1]}).populate("userScripts");

    const userScripts = user.userScripts;

    const script = userScripts?.find((elem)=> elem._id == req.params.id);

    if(script){
      const obj = {};
      let scriptStr = String(req.body?.script);
      let scriptTitle = String(req.body?.scriptTitle);
      let genre = String(req.body?.genre);
      

if(scriptStr.trim() === ""){
        obj.scriptError = "Script should contain at least one non space or non empty character";
       }

       if(scriptTitle.trim() === ""){
       delete req.body?.scriptTitle
       }

       if(genre.trim() === ""){
        delete req.body?.genre
        }

      if(obj.scriptError){
        res.status(400).json({...obj, scriptId: req.params.id});
        return;
      }

      if(!req.body.script){
        const dateIndia = moment.tz(Date.now(), "Asia/Kolkata");

        const script = await Script.findOneAndUpdate({'_id': req.params.id}, { updatedAtIst: String(dateIndia), ...req.body}, {new: true});

        res.status(200).json(script);

        return;
      }

    
        const text = req.body?.script?.trim();

        const words = text.split(/\s+/);

        const dateIndia = moment.tz(Date.now(), "Asia/Kolkata");

      const script = await Script.findOneAndUpdate({'_id': req.params.id}, {wordCount: words?.length, updatedAtIst: String(dateIndia), ...req.body}, {new: true});

      res.status(200).json(script);
    }
    else{
      res.status(400).json({error: "Can't update another user script", scriptId: req.params.id});
    }

  } catch (error) {
    
   res.status(400).json({...error, scriptId: req.params.id}) 
  }
  }




  exports.deleteScript = async (req, res)=>{
    try {

      const token = req?.get('Authorization')?.split('Bearer ');

      const user = await User.findOne({token: token[1]}).populate('userScripts');
  
     const userScripts = user.userScripts;
  
      const script = userScripts?.find((elem)=> elem._id == req.params.id);

      if(script){
        const deletedScript = await Script.findOneAndDelete({'_id': req.params.id});

        const index = userScripts?.findIndex((ele)=>ele._id == req.params.id);

        userScripts.splice(index, 1);

        await user.save();

        res.json(deletedScript);
      }
      else{
        res.status(400).json({deleteScriptError: "Can't delete another user product"});
      }

    } catch (error) {
     res.status(400).json({deleteScriptError: error.message}) 
    }
  }



  exports.getAllUserScripts = async (req, res)=>{
   try {
     const token = req?.get('Authorization')?.split('Bearer ');
 
     const user = await User.findOne({token: token[1]}).populate('userScripts');

     res.status(200).json(user?.userScripts);
   } catch (error) {
    res.status(400).json({AllScriptsError: error.message})
   }
  }


  exports.correctSpellingAndGrammar = async (req, res)=>{
    try {

      if(!req.body.script){
        res.status(400).json({SandGerror: "Please provide a script to correct its spelling and grammar"});

        return;
      }

      if(String(req.body?.script).trim() === ""){
       res.status(400).json({SandGerror: "Please provide a proper script to correct its spelling and grammar"});

       return;
      }

      let value = req.body.script+" (correct spelling and grammar)";

      const openai = new OpenAI({
        apiKey: process.env.MULTI_FEATURE_WEB_APP_KEY
      });

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: value}],
        model: "gpt-3.5-turbo",
      });
    
      const ans = completion.choices[0].message.content;

     res.status(200).json({AIanswer: ans});
    } catch (error) {
    res.status(400).json({SandGbigError: error.message})
    }
  }


  exports.completeThePara = async (req, res)=>{
    try {

      if(!req.body.script){
        res.status(400).json({completeParaError: "Please provide a script to complete its paragraph"});

        return;
      }

      if(String(req.body?.script).trim() === ""){
       res.status(400).json({completeParaError: "Please provide a proper script to complete its paragraph"});

       return;
      }

      let value = req.body.script+" (complete the paragraph)";

      const openai = new OpenAI({
        apiKey: process.env.MULTI_FEATURE_WEB_APP_KEY
      });

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: value}],
        model: "gpt-3.5-turbo",
      });
    
      const ans = completion.choices[0].message.content;

     res.status(200).json({AIanswer: `${req.body.script} ${ans}`});
    } catch (error) {
    res.status(400).json({completeParaBigError: error.message})
    }
  }