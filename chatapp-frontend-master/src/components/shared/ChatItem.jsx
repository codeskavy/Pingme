import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  // Safety check for required props
  if (!_id) {
    console.warn('ChatItem received undefined _id');
    return null;
  }

  return (
    <Link
      sx={{
        padding: "0",
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat && handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
          padding: "1rem",
        }}
      >
        <AvatarCard avatar={avatar} />

        <Stack>
          <Typography>{name || 'Unknown Chat'}</Typography>
          {newMessageAlert && newMessageAlert.count > 0 && (
            <Typography variant="caption" color={sameSender ? "inherit" : "primary"}>
              {newMessageAlert.count} New Message{newMessageAlert.count > 1 ? 's' : ''}
            </Typography>
          )}
        </Stack>

        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);