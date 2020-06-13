var mongoose = require("mongoose");

var GoalSchema = new mongoose.Schema({
    socialGoal: String,
    serviceGoal: String,
    programmingGoal: String,
    meetingGoal: String,

});

module.exports = mongoose.model("Goal", GoalSchema);