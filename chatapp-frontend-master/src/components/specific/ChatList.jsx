import { Stack, Typography } from "@mui/material";
import React from "react";
import ChatItem from "../shared/ChatItem";
import { samepleChats as sampleGroups } from "../../constants/sampleData";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [],
  handleDeleteChat,
}) => {
  // Use fallback sample data if no chats available
  const dataToRender = chats.length > 0 ? chats : sampleGroups;

  console.log("✅ Rendering ChatList:", dataToRender);

  return (
    <Stack
      width={w}
      direction="column"
      overflow="auto"
      height="100%"
      p={1}
      spacing={1}
    >
      {dataToRender.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          No chats available
        </Typography>
      ) : (
        dataToRender.map((chat, index) => {
          const { avatar, _id, name, groupChat, members } = chat;

          const newMessageAlert = newMessagesAlert.find(
            (item) => item.chatId === _id
          );

          const isOnline = Array.isArray(members)
            ? members.some((member) =>
                typeof member === "string"
                  ? onlineUsers.includes(member)
                  : onlineUsers.includes(member._id)
              )
            : false;

          if (!_id || !name) {
            console.warn("⚠️ Skipping chat due to missing _id or name", chat);
            return null;
          }

          return (
            <ChatItem
              index={index}
              newMessageAlert={newMessageAlert}
              isOnline={isOnline}
              avatar={avatar}
              name={name}
              _id={_id}
              key={_id}
              groupChat={groupChat}
              sameSender={chatId === _id}
              handleDeleteChat={handleDeleteChat}
            />
          );
        })
      )}
    </Stack>
  );
};

export default ChatList;
