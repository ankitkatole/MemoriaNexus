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
  disconnect
};