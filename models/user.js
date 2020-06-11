var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    major: String,
    password: String,
    phoneNumber: String, 
    subcommittee: String, 
    firstName: String,
    lastName: String,
    email: String,
    accessCode: String, 
    birthday:Date, 
    position:String,
    role: String,   // member or staff
    meetingPoints: Number, // For DM meetings 
    socialPoints: Number,
    programmingPoints: Number,
    servicePoints: Number,
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    wentEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    programmingEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    socialEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    serviceEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    appeals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appeal"
    }],
    currentLunchBuddy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    },
    oldLunchBuddies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    biography:String,
    presidentMessage:String,
    vpMessage:String,
    execMessage:String,
    courses:[String],
    profilePicture:String,
    haveReadConstitution: {type:Boolean, default:false}
});

UserSchema.plugin(passportLocalMongoose); // Helps hashsing and unhashing

module.exports = mongoose.model("User", UserSchema);