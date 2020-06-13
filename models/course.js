var mongoose = require("mongoose");

var CourseSchema = new mongoose.Schema({
    courseID: String,
    users: [{
        name: String,
        profilePicture: String
    }]
});

module.exports = mongoose.model("Course", CourseSchema);