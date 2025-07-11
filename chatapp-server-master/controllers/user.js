import { compare } from "bcrypt";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import {
  cookieOptions,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";

// Create a new user with avatar
const newUser = TryCatch(async (req, res, next) => {
  const { name, username, password, bio } = req.body;
  const file = req.file;

  if (!file) return next(new ErrorHandler("Please upload an avatar", 400));

  const result = await uploadFilesToCloudinary([file]);
  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  const existingUser = await User.findOne({ username });
  if (existingUser) return next(new ErrorHandler("Username already exists", 400));

  const user = await User.create({ name, bio, username, password, avatar });

  sendToken(res, user, 201, "User created successfully");
});

// Login user
const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid username or password", 404));

  const isMatch = await compare(password, user.password);
  if (!isMatch) return next(new ErrorHandler("Invalid username or password", 404));

  sendToken(res, user, 200, `Welcome back, ${user.name}`);
});

// Get logged-in user's profile
const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);
  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

// Logout user
const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("chattu-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

// Search for users not already in your chats
const searchUser = TryCatch(async (req, res) => {
  const { name = "" } = req.query;

  const myChats = await Chat.find({ groupChat: false, members: req.user });
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members.map(String));

  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: [...allUsersFromMyChats, req.user.toString()] },
    name: { $regex: name, $options: "i" },
  });

  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  return res.status(200).json({ success: true, users });
});

// Send friend request
const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  if (userId === req.user.toString())
    return next(new ErrorHandler("Cannot send request to yourself", 400));

  const existingRequest = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (existingRequest)
    return next(new ErrorHandler("Request already sent or received", 400));

  await Request.create({ sender: req.user, receiver: userId });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    success: true,
    message: "Friend request sent",
  });
});

// Accept or reject friend request
const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(new ErrorHandler("Not authorized to handle this request", 401));

  if (!accept) {
    await request.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Friend request rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  const existingChat = await Chat.findOne({
    members: { $all: members, $size: 2 },
    groupChat: false,
  });

  if (!existingChat) {
    await Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    });
  }

  await request.deleteOne();
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend request accepted",
    senderId: request.sender._id,
  });
});

// Get incoming friend requests
const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(({ _id, sender }) => ({
    _id,
    sender: {
      _id: sender._id,
      name: sender.name,
      avatar: sender.avatar.url,
    },
  }));

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

// Get friends (one-to-one chats) excluding group members
const getMyFriends = TryCatch(async (req, res) => {
  const chatId = req.query.chatId;

  const chats = await Chat.find({
    members: req.user,
    groupChat: false,
  }).populate("members", "name avatar");

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMember(members, req.user);
    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.some((m) => m.equals(friend._id))
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  }

  return res.status(200).json({
    success: true,
    friends,
  });
});

export {
  newUser,
  login,
  logout,
  getMyProfile,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getMyNotifications,
  getMyFriends,
};
