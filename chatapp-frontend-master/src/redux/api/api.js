import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config"; // Make sure this is correctly pointing to your backend

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api/v1/`,
    credentials: "include", // Ensures cookies are sent if using sessions
    prepareHeaders: (headers) => {
      // Optional: Add auth token if needed
      // const token = localStorage.getItem("token");
      // if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Chat", "User", "Message"],

  endpoints: (builder) => ({
    // ✅ Chats
    myChats: builder.query({
      query: () => ({ url: "chat/my" }),
      providesTags: ["Chat"],
    }),

    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => ({
        url: `chat/${chatId}${populate ? "?populate=true" : ""}`,
      }),
      providesTags: ["Chat"],
    }),

    myGroups: builder.query({
      query: () => ({ url: "chat/my/groups" }),
      providesTags: ["Chat"],
    }),

    newGroup: builder.mutation({
      query: ({ name, members }) => ({
        url: "chat/new",
        method: "POST",
        body: { name, members },
      }),
      invalidatesTags: ["Chat"],
    }),

    renameGroup: builder.mutation({
      query: ({ chatId, name }) => ({
        url: `chat/${chatId}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Chat"],
    }),

    addGroupMembers: builder.mutation({
      query: ({ members, chatId }) => ({
        url: `chat/addmembers`,
        method: "PUT",
        body: { members, chatId },
      }),
      invalidatesTags: ["Chat"],
    }),

    removeGroupMember: builder.mutation({
      query: ({ chatId, userId }) => ({
        url: `chat/removemember`,
        method: "PUT",
        body: { chatId, userId },
      }),
      invalidatesTags: ["Chat"],
    }),

    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    leaveGroup: builder.mutation({
      query: (chatId) => ({
        url: `chat/leave/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),

    // ✅ Messages
    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}?page=${page}`,
      }),
      keepUnusedDataFor: 0,
    }),

    sendAttachments: builder.mutation({
      query: (data) => ({
        url: "chat/message",
        method: "POST",
        body: data,
      }),
    }),

    // ✅ Users
    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
      }),
      providesTags: ["User"],
    }),

    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/sendrequest",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "user/acceptrequest",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    availableFriends: builder.query({
      query: (chatId) => ({
        url: chatId ? `user/friends?chatId=${chatId}` : "user/friends",
      }),
      providesTags: ["Chat"],
    }),

    getNotifications: builder.query({
      query: () => ({
        url: "user/notifications",
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export default api;

export const {
  useMyChatsQuery,
  useChatDetailsQuery,
  useMyGroupsQuery,
  useNewGroupMutation,
  useRenameGroupMutation,
  useAddGroupMembersMutation,
  useRemoveGroupMemberMutation,
  useDeleteChatMutation,
  useLeaveGroupMutation,
  useGetMessagesQuery,
  useSendAttachmentsMutation,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useAcceptFriendRequestMutation,
  useAvailableFriendsQuery,
  useGetNotificationsQuery,
} = api;
