// ForumChat.js
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Users, Send } from 'lucide-react';
import Cookies from 'js-cookie';
import axios from 'axios';
import SERVER_URL from '../../constant.mjs';
import socketService from '../../socketService';

const ForumChat = ({ forumId, forumName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [usersTyping, setUsersTyping] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  useEffect(() => {
    const userIdFromCookie = Cookies.get('Userid');
    const userEmailFromCookie = JSON.parse(Cookies.get('Email') || '""');
    const userFirstName = Cookies.get('firstName');
    const userLastName = Cookies.get('lastName');
    
    if (userIdFromCookie) {
      setUserId(userIdFromCookie);
      setUsername(`${userFirstName} ${userLastName}`);
      
      // Initialize socket connection
      socketService.initializeSocket();
      
      // Setup socket event handlers for forum chat
      setupSocketHandlers();
      
      // Join the forum
      socketService.joinForum(forumId, userIdFromCookie, `${userFirstName} ${userLastName}`);
      
      // Fetch forum data as a backup if socket fails
      fetchForumData();
    }
    
    // Cleanup on unmount
    return () => {
      if (userId) {
        socketService.leaveForum(forumId, userId);
      }
      clearSocketHandlers();
    };
  }, [forumId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const setupSocketHandlers = () => {
    socketService.setForumMessageHandler((message) => {
      setMessages(prev => [...prev, message]);
    });
    
    socketService.setForumChatHistoryHandler((chatHistory) => {
      setMessages(chatHistory);
     
      setLoading(false);
    });
    
    socketService.setForumOnlineUsersHandler((users) => {
      setOnlineUsers(users);
    });
    
    socketService.setForumErrorHandler((error) => {
      setError(error.message);
      setLoading(false);
    });
    
    socketService.setUserForumTypingHandler(({ userId, username }) => {
      setUsersTyping(prev => {
        if (!prev.find(user => user.userId === userId)) {
          return [...prev, { userId, username }];
        }
        return prev;
      });
    });
    
    socketService.setUserForumStoppedTypingHandler(({ userId }) => {
      setUsersTyping(prev => prev.filter(user => user.userId !== userId));
    });
  };
  
  const clearSocketHandlers = () => {
    socketService.setForumMessageHandler(() => {});
    socketService.setForumChatHistoryHandler(() => {});
    socketService.setForumOnlineUsersHandler(() => {});
    socketService.setForumErrorHandler(() => {});
    socketService.setUserForumTypingHandler(() => {});
    socketService.setUserForumStoppedTypingHandler(() => {});
  };
  
  const fetchForumData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/forum/${forumId}/chats`);
      setMessages(response.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forum data:', error);
      setError('Failed to load forum messages');
      setLoading(false);
    }
  };
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleInputChange = (e) => {
    setInput(e.target.value);
    
    // Handle typing indicator
    if (e.target.value) {
      socketService.forumTyping(forumId, userId, username);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout for stopped typing
      typingTimeoutRef.current = setTimeout(() => {
        socketService.forumStopTyping(forumId, userId);
      }, 2000);
    } else {
      socketService.forumStopTyping(forumId, userId);
    }
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Send message via socket
    socketService.sendForumMessage(forumId, userId, input.trim());
    
    // Clear input
    setInput('');
    
    // Clear typing indicator
    socketService.forumStopTyping(forumId, userId);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatDate = (timestamp) => {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    const isToday = messageDate.toDateString() === today.toDateString();
    const isYesterday = messageDate.toDateString() === yesterday.toDateString();
  
    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
  
    return messageDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  
  const shouldShowDate = (index) => {
    if (index === 0) return true;
    
    const currentDate = new Date(messages[index].timestamp).toDateString();
    const prevDate = new Date(messages[index - 1].timestamp).toDateString();
    
    return currentDate !== prevDate;
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Forum chat header */}
      <div className="bg-gray-900 p-4 flex justify-between items-center border-b border-cyan-300">
        <div className="flex items-center">
          <h2 className="text-xl font-bold text-white">{forumName}</h2>
          <span className="ml-2 bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">
            {onlineUsers.length} online
          </span>
        </div>
        <button 
          className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
          onClick={() => setShowOnlineUsers(!showOnlineUsers)}
        >
          <Users size={20} />
        </button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-950 via-blue-950 to-violet-950">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-400">Loading messages...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-full">
                <p className="text-red-500">{error}</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <MessageSquare size={48} className="text-gray-400 mb-4" />
                <p className="text-gray-400">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <React.Fragment key={index}>
                    {shouldShowDate(index) && (
                      <div className="text-center my-4">
                        <span className="bg-gray-800 text-teal-400 text-xs px-2 py-1 rounded-full">
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${msg.userId === userId ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.userId === userId 
                          ? 'bg-gray-900 border border-green-500 text-white rounded-br-none' 
                          : 'bg-black border border-cyan-300 text-gray-300 rounded-bl-none'
                      }`}>
                        <div className="flex justify-between items-center gap-4">
                          <span className="font-bold text-sm">
                            {msg.userId === userId ? 'You' : msg.userId}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <p className={`mt-1 break-words ${
                          msg.userId === userId
                            ? 'text-[#5cff1c]'
                            : 'text-cyan-400'
                        }`}>{msg.message}</p>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Typing indicator */}
          {usersTyping.length > 0 && (
            <div className="bg-gray-800 px-4 py-2 text-sm text-gray-400">
              {usersTyping.length === 1 
                ? `${usersTyping[0].userId} is typing...` 
                : `${usersTyping.length} people are typing...`}
            </div>
          )}
          
          {/* Message input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-[#111826] flex">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border-2 border-cyan-300 hover:border-[#646cff]"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className={`ml-2 box p-2 rounded-lg ${
                !input.trim() ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
        
        {/* Online users sidebar */}
        {showOnlineUsers && (
          <div className="w-64 bg-gray-900 border-l border-cyan-300 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-4">Online Users</h3>
              {onlineUsers.length === 0 ? (
                <p className="text-gray-400">No users online</p>
              ) : (
                <ul className="space-y-2">
                  {onlineUsers.map((user) => (
                    <li key={user.userId} className="flex items-center gap-2">
                     {user.userId && (
                      <>
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-white">{ user.userId}</span>
                      </>)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumChat;