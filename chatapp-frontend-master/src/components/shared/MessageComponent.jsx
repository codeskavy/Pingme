import { Box, Typography } from "@mui/material";
import React, { memo } from "react";
import { lightBlue } from "../../constants/color";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  // Safety checks for message and user objects
  if (!message) {
    console.warn('MessageComponent received undefined message');
    return null;
  }

  if (!user) {
    console.warn('MessageComponent received undefined user');
    return null;
  }

  const { sender, content, attachments = [], createdAt } = message;

  // Additional safety check for sender
  if (!sender) {
    console.warn('MessageComponent received message without sender:', message);
    return null;
  }

  const sameSender = sender?._id === user?._id;

  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant="caption">
          {sender?.name || 'Unknown User'}
        </Typography>
      )}

      {content && <Typography>{content}</Typography>}

      {attachments && attachments.length > 0 &&
        attachments.map((attachment, index) => {
          // Safety check for attachment object
          if (!attachment || !attachment.url) {
            console.warn('Invalid attachment:', attachment);
            return null;
          }

          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={index}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer" // Added for security
                download
                style={{
                  color: "black",
                }}
              >
                <RenderAttachment file={file} url={url} />
              </a>
            </Box>
          );
        })}

      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);