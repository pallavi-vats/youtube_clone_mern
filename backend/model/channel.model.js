import mongoose from "mongoose";

// define the schema
const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true 
    },
    description: { 
        type: String 
    },
    channelPic: { 
        type: String 
    },
    channelBanner: { 
        type: String 
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, // save user's id
        ref: "User",
        required: true,
    },
    subscribers: { 
        type: Number, 
        default: 0 
    },
    videos: [{ 
        type: mongoose.Schema.Types.ObjectId, // array of _IDs
        ref: "Video" 
    }],
}, { timestamps: true }); // save timestamp

const ChannelModel = mongoose.model("Channel", channelSchema); // create model based on the schema

export default ChannelModel; // export model