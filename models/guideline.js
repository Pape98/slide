var mongoose = require("mongoose");

var GuidelineSchema = new mongoose.Schema({
    category: String,
    text: String,
    title: String
});

module.exports = mongoose.model("Guideline", GuidelineSchema);