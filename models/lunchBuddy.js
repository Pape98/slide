var mongoose = require("mongoose");

var lunchBuddySchema = new mongoose.Schema({
    title: String,
    Date: {
        type: Date,
        default: Date.now
    },
    groupA: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    groupB: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
});

module.exports = mongoose.model("lunchBuddy", lunchBuddySchema);