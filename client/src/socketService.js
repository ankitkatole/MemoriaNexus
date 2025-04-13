// socketService.js
import { io } from 'socket.io-client';
import Cookies from 'js-cookie';
import SERVER_URL from "./constant.mjs";

let socket;
let onMessageCallback = () => {};
let onConfirmationCallback = () => {};
let onStatusChangeCallback = () => {};
let onErrorCallback = () => {};
let onlineUsersListCallback = () => {};
let onForumMessageCallback = () => {};
let onForumChatHistoryCallback = () => {};
let onForumOnlineUsersCallback = () => {};
let onForumErrorCallback = () => {};
let onUserForumTypingCallback = () => {};
let onUserForumStoppedTypingCallback = () => {};



// Add these functions to your socketService export

// Join a forum chat
export const joinForum = (forumId, userId, username) => {
  if (!socket) return false;
  
  socket.emit('joinForum', { forumId, userId, username });
  return true;
};

// Leave a forum chat
export const leaveForum = (forumId, userId) => {
  if (!socket) return false;
  
  socket.emit('leaveForum', { forumId, userId });
  return true;
};

// Send a message to a forum
export const sendForumMessage = (forumId, userId, message) => {
  if (!socket) return false;
  
  socket.emit('sendForumMessage', { forumId, userId, message });
  return true;
};

// Notify users that you're typing in a forum
export const forumTyping = (forumId, userId, username) => {
  if (!socket) return false;
  
  socket.emit('forumTyping', { forumId, userId, username });
  return true;
};

// Notify users that you stopped typing in a forum
export const forumStopTyping = (forumId, userId) => {
  if (!socket) return false;
  
  socket.emit('forumStopTyping', { forumId, userId });
  return true;
};

// Add these callback setters
export const setForumMessageHandler = (callback) => {
  onForumMessageCallback = callback;
};

export const setForumChatHistoryHandler = (callback) => {
  onForumChatHistoryCallback = callback;
};

export const setForumOnlineUsersHandler = (callback) => {
  onForumOnlineUsersCallback = callback;
};

export const setForumErrorHandler = (callback) => {
  onForumErrorCallback = callback;
};

export const setUserForumTypingHandler = (callback) => {
  onUserForumTypingCallback = callback;
};

export const setUserForumStoppedTypingHandler = (callback) => {
  onUserForumStoppedTypingCallback = callback;
};




export const initializeSocket = () => {
  if (!socket) {
    // Connect to the server
    socket = io(SERVER_URL);
    
    // Get user email from cookie
    const email = JSON.parse(Cookies.get('Email') || '""');
    
    // Handle connection
    socket.on('connect', () => {
      console.log('Connected to Socket.io server');
      
      // Authenticate with email
      if (email) {
        socket.emit('authenticate', email);
      }
    });

    // Add these event listeners to the initializeSocket function
socket.on('forumMessage', (message) => {
  onForumMessageCallback(message);
});

socket.on('forumChatHistory', (chatHistory) => {
  onForumChatHistoryCallback(chatHistory);
});

socket.on('forumOnlineUsers', (onlineUsers) => {
  onForumOnlineUsersCallback(onlineUsers);
});

socket.on('forumError', (error) => {
  onForumErrorCallback(error);
});

socket.on('userForumTyping', (data) => {
  onUserForumTypingCallback(data);
});

socket.on('userForumStoppedTyping', (data) => {
  onUserForumStoppedTypingCallback(data);
});
    
    // Set up event listeners
    socket.on('newPrivateMessage', (message) => {
      onMessageCallback(message);
    });
    
    socket.on('messageConfirmation', (message) => {
      onConfirmationCallback(message);
    });
    
    socket.on('userStatus', (statusData) => {
      onStatusChangeCallback(statusData);
    });
    
    socket.on('onlineUsersList', (usersList) => {
      onlineUsersListCallback(usersList);
    });
    
    socket.on('messageError', (errorData) => {
      onErrorCallback(errorData);
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });
  }
  
  return socket;
};

export const sendMessage = (to, message) => {
  if (!socket) return false;
  
  const email = JSON.parse(Cookies.get('Email') || '""');
  if (!email) return false;
  
  socket.emit('sendPrivateMessage', {
    from: email,
    to: to,
    message: message
  });
  
  return true;
};

export const setMessageHandler = (callback) => {
  onMessageCallback = callback;
};

export const setConfirmationHandler = (callback) => {
  onConfirmationCallback = callback;
};

export const setStatusChangeHandler = (callback) => {
  onStatusChangeCallback = callback;
};

export const setOnlineUsersListHandler = (callback) => {
  onlineUsersListCallback = callback;
};

export const setErrorHandler = (callback) => {
  onErrorCallback = callback;
};

export const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  sendMessage,
  setMessageHandler,
  setConfirmationHandler,
  setStatusChangeHandler,
  setOnlineUsersListHandler,
  setErrorHandler,
  disconnect,

  
  // New forum methods
  joinForum,
  leaveForum,
  sendForumMessage,
  forumTyping,
  forumStopTyping,
  setForumMessageHandler,
  setForumChatHistoryHandler,
  setForumOnlineUsersHandler,
  setForumErrorHandler,
  setUserForumTypingHandler,
  setUserForumStoppedTypingHandler
};