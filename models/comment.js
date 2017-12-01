var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    createdAt: {type: Date, default: Date.now},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" // refers to the model that we are going to refer to with this objectID, which is a user
        },
        username: String
    }
})

module.exports = mongoose.model("Comment", commentSchema);