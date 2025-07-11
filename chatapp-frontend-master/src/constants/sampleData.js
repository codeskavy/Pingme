export const samepleChats = [
  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Ayush Ranjan",
    _id: "64b45f9e8c1f0a0d88a7c4a1",
    groupChat: false,
    members: ["1", "2"],
  },

  {
    avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
    name: "Sneha Sarohi",
    _id: "64b45f9e8c1f0a0d88a7c4a2",
    groupChat: true,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    name: "Ayush Ranjan",
    _id: "64b45f9e8c1f0a0d88a7c4a1",
  },
  {
    avatar: "https://www.w3schools.com/howto/img_avatar.png",
    name: "Sneha Sarohi",
    _id: "64b45f9e8c1f0a0d88a7c4a2",
  },
];

export const sampleNotifications = [
  {
    sender: {
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      name: "Ayush Ranjan",
    },
    _id: "64b45f9e8c1f0a0d88a7c4a1",
  },
  {
    sender: {
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      name: "Sneha sarohi ",
    },
    _id: "64b45f9e8c1f0a0d88a7c4a2",
  },
];

export const sampleMessage = [
  {
    attachments: [],
    content: "Can i call you?",
    _id: "sfnsdjkfsdnfkjsbnd",
    sender: {
      _id: "user._id",
      name: "Neha",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z",
  },

  {
    attachments: [
      {
        public_id: "asdsad 2",
        url: "https://www.w3schools.com/howto/img_avatar.png",
      },
    ],
    content: "",
    _id: "sfnsdjkfsdnfkdddjsbnd",
    sender: {
      _id: "sdfsdfsdf",
      name: "Chaman  2",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z",
  },
];

export const dashboardData = {
  users: [
    {
      name: "Ayush Ranjan",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "64b45f9e8c1f0a0d88a7c4a1",
      username: "john_doe",
      friends: 20,
      groups: 5,
    },
    {
      name: "Sneha Sarohi",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      _id: "64b45f9e8c1f0a0d88a7c4a2",
      username: "john_boi",
      friends: 20,
      groups: 25,
    },
  ],

  chats: [
    {
      name: "Slayy queen",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "64b45f9e8c1f0a0d88a7c4a1",
      groupChat: false,
      members: [
        { _id: "64b45f9e8c1f0a0d88a7c4a1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "64b45f9e8c1f0a0d88a7c4a2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalMembers: 2,
      totalMessages: 20,
      creator: {
        name: "Ayush Ranjan",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
    {
      name: "Friends Forever",
      avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
      _id: "2",
      groupChat: true,
      members: [
        { _id: "64b45f9e8c1f0a0d88a7c4a1", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
        { _id: "64b45f9e8c1f0a0d88a7c4a2", avatar: "https://www.w3schools.com/howto/img_avatar.png" },
      ],
      totalMembers: 2,
      totalMessages: 20,
      creator: {
        name: "Sneha sarohi",
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
      },
    },
  ],

  messages: [
    {
      attachments: [],
      content: "Why didnt you pick uo my call",
      _id: "sfnsdjkfsdnfkjsbnd",
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Chaman ",
      },
      chat: "chatId",
      groupChat: false,
      createdAt: "2024-02-12T10:41:30.630Z",
    },

    {
      attachments: [
        {
          public_id: "asdsad 2",
          url: "https://www.w3schools.com/howto/img_avatar.png",
        },
      ],
      content: "",
      _id: "sfnsdjkfsdnfkdddjsbnd",
      sender: {
        avatar: "https://www.w3schools.com/howto/img_avatar.png",
        name: "Chaman  2",
      },
      chat: "chatId",
      groupChat: true,
      createdAt: "2024-02-12T10:41:30.630Z",
    },
  ],
};
