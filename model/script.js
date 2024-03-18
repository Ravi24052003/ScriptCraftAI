const mongoose = require('mongoose');


// Schema
const scriptSchema = new mongoose.Schema({
    script: {
    type: String,
    required: true
    },
    scriptTitle: {
        type: String
    },
    genre: {
      type: String
    },
    wordCount: {
        type: Number
    },

    createdAtIst: {
        type: String
    },
    updatedAtIst: {
        type: String
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

const Script = mongoose.model('Script', scriptSchema);

module.exports = Script