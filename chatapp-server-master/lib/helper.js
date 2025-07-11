import { userSocketIDs } from "../app.js";

/**
 * Get the other member in a private chat.
 * @param {Array} members - List of users in the chat.
 * @param {String} userId - Logged-in user's ID.
 * @returns {Object} Other user object.
 */
export const getOtherMember = (members, userId) =>
  members.find((member) => member._id.toString() !== userId.toString());

/**
 * Map user IDs to their active socket IDs (for emitting real-time events).
 * @param {Array} users - List of user IDs.
 * @returns {Array} Array of socket IDs (some may be undefined).
 */
export const getSockets = (users = []) => {
  return users
    .map((user) => userSocketIDs.get(user.toString()))
    .filter(Boolean); // removes undefined socket IDs
};

/**
 * Convert a file to a Base64 string for sending inline (e.g., for avatars).
 * @param {Object} file - File object with mimetype and buffer.
 * @returns {String} Base64 encoded string.
 */
export const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
