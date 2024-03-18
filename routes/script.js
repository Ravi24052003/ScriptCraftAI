const express = require('express');
const {createScript, updateScript, deleteScript, getAllUserScripts, correctSpellingAndGrammar, completeThePara} = require("../controller/script.js");
const scriptRouter = express.Router();

module.exports = scriptRouter


scriptRouter
.post('/create', createScript)
.get('/userScripts', getAllUserScripts)
.patch('/update/:id', updateScript)
.delete('/delete/:id', deleteScript)
.post('/spelling-grammar', correctSpellingAndGrammar)
.post('/complete-para', completeThePara);


scriptRouter.use("*", (req, res)=>{
    res.sendStatus(404);
  })