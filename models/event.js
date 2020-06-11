var mongoose = require("mongoose");

var EventSchema = new mongoose.Schema({
    eventName: String,
    pointType: String,
    pointShift: {type:Number,default:1}, 
    eventDate: Date, 
    startTime: String,
    endTime: String,
    numberSpots: Number, 
    Description: String,
    Location: String,
    creatorName: String,
    creatorPicture:String,
    slots:String,
    shift:String,
    wasSubmitted: {type:Boolean,default:false},
    lunchBuddy:{type:Boolean,default:false},
    lunchBuddyIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    bigId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: String,
    comment:String,
    creatorID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    // People that signed up for the event
    userIDs: [{         
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    // People that actually went to the event
    wentUserIDs: [{                                 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    slotsIDs: [{                                 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    postCondition:{type:Boolean,default:true} // Used to post missed/went buttons for 
});

module.exports = mongoose.model("Event", EventSchema);