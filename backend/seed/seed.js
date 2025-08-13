import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import UserModel from "../model/user.model.js";
import ChannelModel from "../model/channel.model.js";
import VideoModel from "../model/video.model.js";
import CommentModel from "../model/comment.model.js";
import { predefinedVideos, predefinedComments } from "./seedData.js";

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" Connected to MongoDB");

    await Promise.all([
      UserModel.deleteMany(),
      ChannelModel.deleteMany(),
      VideoModel.deleteMany(),
      CommentModel.deleteMany()
    ]);

    // Insert users
    const users = await UserModel.insertMany([
      {
        username: "pallavi_vats",
        email: "pallavi@example.com",
        password: "hashed-password",
        avatar: "https://i.pravatar.cc/100?u=pallavi_vats@example.com"
      },
      {
        username: "harshit_singh",
        email: "harshit@example.com",
        password: "hashed-password",
        avatar: "https://i.pravatar.cc/100?u=harshit@example.com"
      },
      {
        username: "gyan_coding",
        email: "code@example.com",
        password: "hashed-password",
        avatar: "https://i.pravatar.cc/100?u=gyan@example.com"
      }
    ]);
    const userMap = {
      user01: users[0]._id,
      user02: users[1]._id,
      user03: users[2]._id
    };

    // Insert channels
    const channels = await ChannelModel.insertMany([
      {
        channelName: "Explore with Pallavi",
        description: "Sharing full stack projects and dev tips.",
        channelPic: "https://i.pravatar.cc/150?u=channel01",
        channelBanner: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?crop=entropy&fm=jpg&h=150&w=600",
        owner: userMap.user01,
        subscribers: 1000
      },
      {
        channelName: "Harshit Tech Talks",
        description: "Explaining tech simply and beautifully.",
        channelPic: "https://i.pravatar.cc/150?u=channel02",
        channelBanner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?crop=entropy&fm=jpg&h=150&w=600",
        owner: userMap.user02,
        subscribers: 800
      },
      {
        channelName: "Coding Wizard",
        description: "Magical tutorials on JS, React, and Node.",
        channelPic: "https://i.pravatar.cc/150?u=channel03",
        channelBanner: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&fm=jpg&h=150&w=600",
        owner: userMap.user03,
        subscribers: 620
      }
    ]);
    const channelMap = {
      channel01: channels[0]._id,
      channel02: channels[1]._id,
      channel03: channels[2]._id
    };

    // Update users with channel reference
    await Promise.all([
      UserModel.findByIdAndUpdate(userMap.user01, { channel: channelMap.channel01 }),
      UserModel.findByIdAndUpdate(userMap.user02, { channel: channelMap.channel02 }),
      UserModel.findByIdAndUpdate(userMap.user03, { channel: channelMap.channel03 })
    ]);

    // Prepare videos with correct channel ObjectId, remove comments for now
    const videoIdMap = {};
    const videosToInsert = predefinedVideos.map((v, idx) => {
      const video = { ...v };
      video.channel = channelMap[v.channel];
      video.comments = []; // will update after comments are inserted
      // Save a mapping from "video01" etc to index for later
      const videoKey = `video${(idx + 1).toString().padStart(2, "0")}`;
      videoIdMap[videoKey] = null; // will fill after insert
      return video;
    });

    // Insert videos
    const videoDocs = await VideoModel.insertMany(videosToInsert);
    videoDocs.forEach((doc, idx) => {
      const videoKey = `video${(idx + 1).toString().padStart(2, "0")}`;
      videoIdMap[videoKey] = doc._id;
    });

    // Prepare comments with correct user and video ObjectId
    const commentsToInsert = predefinedComments.map(c => ({
      user: userMap[c.user],
      video: videoIdMap[c.video],
      text: c.text,
      timestamp: c.timestamp
    }));

    // Insert comments
    const commentDocs = await CommentModel.insertMany(commentsToInsert);

    // Group comments by video
    const videoCommentsMap = {};
    commentDocs.forEach((c, idx) => {
      const videoId = c.video.toString();
      if (!videoCommentsMap[videoId]) videoCommentsMap[videoId] = [];
      videoCommentsMap[videoId].push(c._id);
    });

    // Update videos with their comments
    await Promise.all(
      Object.entries(videoCommentsMap).map(([vid, commentIds]) =>
        VideoModel.findByIdAndUpdate(vid, { comments: commentIds })
      )
    );

    // Update channels with their videos
    await Promise.all(
      Object.entries(channelMap).map(([chanKey, chanId]) => {
        const chanVideos = videoDocs.filter(v => v.channel.toString() === chanId.toString());
        return ChannelModel.findByIdAndUpdate(chanId, {
          videos: chanVideos.map(v => v._id)
        });
      })
    );

    console.log(" Database seeded with videos and comments!");
    process.exit();
  } catch (err) {
    console.error(" Error:", err);
    process.exit(1);
  }
};

seedData();