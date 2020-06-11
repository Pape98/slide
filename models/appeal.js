var mongoose = require("mongoose");

var AppealSchema = new mongoose.Schema({
    eventName: String,
    eventDate: Date, 
    eventType: String,
    reason: String,
    reasonDescription: String,
    staffDecision:String,
    comment:String,
    submissionDate: Date,
    requesterID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    requesterName:String,
    requesterEmail:String,
    requesterPicture:String,
});

module.exports = mongoose.model("Appeal", AppealSchema);