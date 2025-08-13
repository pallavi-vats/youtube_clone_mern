import express from 'express';
import {
  createChannel,
  getChannelById,
  getChannelByUser,
  updateChannel,
  deleteChannel
} from '../controller/channel.controller.js'; // import controllers
import { protect } from '../middleware/authMiddleware.js'; // import auth middleware

function channelRoutes(app) {
    app.post('/api/channel', protect, createChannel); // create a channel (protected with JWT)
    app.get('/api/channel/:id', getChannelById);       // fetch channel detals based on id
    app.get('/api/userChannel/:userId', getChannelByUser); // fetch channel details based on userId
    app.put('/api/updateChannel/:id', protect, updateChannel); // update channel details (protected with JWT)
    app.delete('/api/deleteChannel/:id', protect, deleteChannel); // delete channel (protected with JWT)
}

export default channelRoutes; // export routes
