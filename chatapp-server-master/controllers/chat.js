import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import {
  emitEvent,
  uploadFilesToCloudinary,
  deletFilesFromCloudinary,
} from "../utils/features.js";
import {
  ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";

// 1. Create a new group chat
const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  res.status(201).json({ success: true, message: "Group Created" });
});

// 2. Get all chats of logged-in user
const getMyChats = TryCatch(async (req, res) => {
  const chats = await Chat.find({ members: req.user }).populate("members", "name avatar");

  const transformed = chats.map(({ _id, name, members, groupChat }) => {
    const other = getOtherMember(members, req.user);

    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [other.avatar.url],
      name: groupChat ? name : other.name,
      members: members.filter(m => m._id.toString() !== req.user.toString()).map(m => m._id),
    };
  });

  res.status(200).json({ success: true, chats: transformed });
});

// 3. Get groups created by user
const getMyGroups = TryCatch(async (req, res) => {
  const chats = await Chat.find({ members: req.user, groupChat: true, creator: req.user }).populate("members", "name avatar");

  const groups = chats.map(({ _id, name, members }) => ({
    _id,
    groupChat: true,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  res.status(200).json({ success: true, groups });
});

// 4. Add members to group
const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat) return next(new ErrorHandler("Not a group chat", 400));
  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Unauthorized to add members", 403));

  const newMembers = await Promise.all(members.map(id => User.findById(id, "name")));

  const unique = newMembers
    .filter(user => !chat.members.includes(user._id))
    .map(user => user._id);

  chat.members.push(...unique);

  if (chat.members.length > 100)
    return next(new ErrorHandler("Group member limit exceeded", 400));

  await chat.save();

  emitEvent(req, ALERT, chat.members, `${newMembers.map(u => u.name).join(", ")} added to group`);
  emitEvent(req, REFETCH_CHATS, chat.members);

  res.status(200).json({ success: true, message: "Members added successfully" });
});

// 5. Remove member from group
const removeMember = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;

  const [chat, removedUser] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat) return next(new ErrorHandler("Not a group chat", 400));
  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Unauthorized", 403));

  if (chat.members.length <= 3)
    return next(new ErrorHandler("Group must have at least 3 members", 400));

  chat.members = chat.members.filter(m => m.toString() !== userId);
  await chat.save();

  emitEvent(req, ALERT, chat.members, {
    chatId,
    message: `${removedUser.name} has been removed`,
  });

  emitEvent(req, REFETCH_CHATS, chat.members);

  res.status(200).json({ success: true, message: "Member removed" });
});

// 6. Leave group
const leaveGroup = TryCatch(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat) return next(new ErrorHandler("Not a group chat", 400));

  const updatedMembers = chat.members.filter(m => m.toString() !== req.user.toString());
  if (updatedMembers.length < 3)
    return next(new ErrorHandler("Group must have at least 3 members", 400));

  if (chat.creator.toString() === req.user.toString()) {
    const randomNewCreator = updatedMembers[Math.floor(Math.random() * updatedMembers.length)];
    chat.creator = randomNewCreator;
  }

  chat.members = updatedMembers;
  await chat.save();

  const user = await User.findById(req.user, "name");

  emitEvent(req, ALERT, chat.members, {
    chatId: chat._id,
    message: `${user.name} has left the group`,
  });

  res.status(200).json({ success: true, message: "Left group successfully" });
});

// 7. Send message with attachments
const sendAttachments = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;
  const files = req.files || [];

  if (!files.length) return next(new ErrorHandler("Please upload attachments", 400));
  if (files.length > 5) return next(new ErrorHandler("Max 5 files allowed", 400));

  const [chat, sender] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const attachments = await uploadFilesToCloudinary(files);

  const dbMessage = {
    content: "",
    attachments,
    sender: sender._id,
    chat: chatId,
  };

  const message = await Message.create(dbMessage);

  emitEvent(req, NEW_MESSAGE, chat.members, {
    message: { ...dbMessage, sender: { _id: sender._id, name: sender.name } },
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

  res.status(200).json({ success: true, message });
});

// 8. Get chat details
const getChatDetails = TryCatch(async (req, res, next) => {
  const populate = req.query.populate === "true";

  const chat = populate
    ? await Chat.findById(req.params.id).populate("members", "name avatar").lean()
    : await Chat.findById(req.params.id);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (populate) {
    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));
  }

  res.status(200).json({ success: true, chat });
});

// 9. Rename group
const renameGroup = TryCatch(async (req, res, next) => {
  const { id: chatId } = req.params;
  const { name } = req.body;

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat) return next(new ErrorHandler("Not a group chat", 400));
  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Unauthorized", 403));

  chat.name = name;
  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);
  res.status(200).json({ success: true, message: "Group renamed" });
});

// 10. Delete chat
const deleteChat = TryCatch(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Unauthorized to delete group", 403));

  if (!chat.groupChat && !chat.members.includes(req.user.toString()))
    return next(new ErrorHandler("Unauthorized to delete chat", 403));

  const messages = await Message.find({ chat: chat._id, attachments: { $exists: true, $ne: [] } });

  const publicIds = messages.flatMap(msg => msg.attachments.map(a => a.public_id));

  await Promise.all([
    deletFilesFromCloudinary(publicIds),
    chat.deleteOne(),
    Message.deleteMany({ chat: chat._id }),
  ]);

  emitEvent(req, REFETCH_CHATS, members);
  res.status(200).json({ success: true, message: "Chat deleted successfully" });
});

// 11. Get paginated messages
const getMessages = TryCatch(async (req, res, next) => {
  const { id: chatId } = req.params;
  const { page = 1 } = req.query;

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.members.includes(req.user.toString()))
    return next(new ErrorHandler("Access denied", 403));

  const perPage = 20;
  const skip = (page - 1) * perPage;

  const [messages, total] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .populate("sender", "name")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages: Math.ceil(total / perPage),
  });
});

export {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
};
