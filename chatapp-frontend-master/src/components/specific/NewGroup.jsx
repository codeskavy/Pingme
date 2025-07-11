import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Debug: Log the API response
  console.log("API Response:", { isError, isLoading, error, data });

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  // Function to get the friends data regardless of API response structure
  const getFriendsData = () => {
    // If API fails or returns no data, use sample data for testing
    if (!data || isError) {
      console.log('Using sample data as fallback');
      return sampleUsers; // Use your sample data as fallback
    }
    
    console.log('Using real API data:', data);
    // Try different possible data structures
    return data.friends || data.data || data.users || data || [];
  };

  const friendsData = getFriendsData();

  return (
    <Dialog onClose={closeHandler} open={isNewGroup}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>

        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />

        <Typography variant="body1">Members</Typography>

        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : isError ? (
            <Typography color="error">
              Failed to load friends. Please try again.
            </Typography>
          ) : friendsData.length > 0 ? (
            friendsData.map((friend) => {
              // Add safety checks for the friend object
              if (!friend || !friend._id) {
                console.warn('Invalid friend object:', friend);
                return null;
              }
              
              return (
                <UserItem
                  user={{
                    ...friend,
                    // Handle both string and array avatar formats
                    avatar: Array.isArray(friend.avatar) 
                      ? friend.avatar[0] || '' 
                      : friend.avatar || '',
                    name: friend.name || 'Unknown User'
                  }}
                  key={friend._id}
                  handler={selectMemberHandler}
                  isAdded={selectedMembers.includes(friend._id)}
                />
              );
            })
          ) : (
            <Typography>
              No friends available. Add some friends first to create a group.
            </Typography>
          )}
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="text"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;