import { faker, simpleFaker } from "@faker-js/faker";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";

/**
 * Create 1-on-1 chats between every possible pair of users
 */
const createSingleChats = async () => {
  try {
    const users = await User.find().select("_id");

    const chatsPromise = [];

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        chatsPromise.push(
          Chat.create({
            name: faker.lorem.words(2),
            members: [users[i]._id, users[j]._id],
            groupChat: false,
          })
        );
      }
    }

    await Promise.all(chatsPromise);
    console.log("Single (1-on-1) chats created successfully");
    process.exit();
  } catch (error) {
    console.error("Error creating single chats:", error);
    process.exit(1);
  }
};

/**
 * Create random group chats with 3–N users
 */
const createGroupChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");

    const chatsPromise = [];

    for (let i = 0; i < numChats; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });

      const members = [];
      while (members.length < numMembers) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!members.some((m) => m._id.equals(randomUser._id))) {
          members.push(randomUser);
        }
      }

      const chat = Chat.create({
        groupChat: true,
        name: faker.lorem.words(1),
        members: members.map((m) => m._id),
        creator: members[0]._id,
      });

      chatsPromise.push(chat);
    }

    await Promise.all(chatsPromise);
    console.log("Group chats created successfully");
    process.exit();
  } catch (error) {
    console.error("Error creating group chats:", error);
    process.exit(1);
  }
};

/**
 * Create random messages across all chats
 */
const createMessages = async (numMessages) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");

    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagesPromise.push(
        Message.create({
          chat: randomChat._id,
          sender: randomUser._id,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise);
    console.log("Messages created successfully");
    process.exit();
  } catch (error) {
    console.error("Error creating messages:", error);
    process.exit(1);
  }
};

/**
 * Create messages inside a specific chat
 */
const createMessagesInAChat = async (chatId, numMessages) => {
  try {
    const users = await User.find().select("_id");

    const messagesPromise = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      messagesPromise.push(
        Message.create({
          chat: chatId,
          sender: randomUser._id,
          content: faker.lorem.sentence(),
        })
      );
    }

    await Promise.all(messagesPromise);
    console.log(`Messages created in chat ${chatId}`);
    process.exit();
  } catch (error) {
    console.error("Error creating messages in a specific chat:", error);
    process.exit(1);
  }
};

export {
  createGroupChats,
  createMessages,
  createMessagesInAChat,
  createSingleChats,
};
