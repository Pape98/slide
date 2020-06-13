var mongoose = require("mongoose");

var AnnouncementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model("Annoucement", AnnouncementSchema);