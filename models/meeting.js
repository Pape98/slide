var mongoose = require("mongoose");

var MeetingSchema = new mongoose.Schema({
    meetingDate: String,
    // People that went
    presentIDs: [{         
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    // People that didn't go
    absentIDs: [{                                 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
});

module.exports = mongoose.model("Meeting", MeetingSchema);