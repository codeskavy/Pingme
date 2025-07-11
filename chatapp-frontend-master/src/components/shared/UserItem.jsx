import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React, { memo } from "react";
import { transformImage } from "../../lib/features";

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  // Safety check for user object
  if (!user) {
    console.warn('UserItem received undefined user');
    return null;
  }

  const { name, _id, avatar } = user;

  // Safety check for required fields
  if (!_id) {
    console.warn('UserItem received user without _id:', user);
    return null;
  }

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
      >
        <Avatar 
          src={avatar ? transformImage(avatar) : undefined}
          alt={name || 'User'}
          onError={(e) => {
            // Fallback to default avatar on error
            e.target.src = 'https://www.w3schools.com/howto/img_avatar.png';
          }}
        />

        <Typography
          variant="body1"
          sx={{
            flexGrow: 1, // Fixed typo: was "flexGlow"
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {name || 'Unknown User'}
        </Typography>

        <IconButton
          size="small"
          sx={{
            bgcolor: isAdded ? "error.main" : "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: isAdded ? "error.dark" : "primary.dark",
            },
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {isAdded ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);