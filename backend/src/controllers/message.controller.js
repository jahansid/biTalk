import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersSidebar = async (req, res) => {
  try {
    const loggedinUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedinUserId },
    }).select("-password -email"); // Exclude sensitive fields
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error(`Error fetching users for sidebar: ${error.message}`, error);

    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessagesBetweenUsers = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    if (!userToChatId) {
      return res.status(400).json({ error: "Recipient ID is required." });
    }

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error(`Error fetching messages: ${error.message}`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessages = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessages.save();
    // realtime will be done further with socket.io
  } catch (error) {
    console.error(`Error sending messages: ${error.message}`, error);
    res.status(500).json({ error: "Internal server error" });
  }
};
