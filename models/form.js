var mongoose = require("mongoose");

var FormSchema = new mongoose.Schema({
    title: {type:String, required:true},
    link: {type:String, required:true}, 
});

module.exports = mongoose.model("Form", FormSchema);