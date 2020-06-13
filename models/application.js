var mongoose = require("mongoose");

var ApplicationSchema = new mongoose.Schema({
    memberApp: Boolean,
    bigApp: Boolean,
    presidentApp: Boolean,
    vpApp: Boolean,
    execApp: Boolean,
    directorApp: Boolean,
    memberAppFile: String,
    bigAppFile: String,
    presidentAppFile: String,
    vpAppFile: String,
    execAppFile: String,
    directorAppFile: String,
});

module.exports = mongoose.model("Application", ApplicationSchema);