import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Menu } from "lucide-react";
import Sidebar from "../../Components/SharedComponents/Sidebar";
import { useNavigate, useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import SERVER_URL from "../../constant.mjs";
// Import the socket service
import socketService from "../../socketService";
import CurrentUserDatanav from "./currentUserDatanav";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const UserChat = () => {
  const { encodedEmail, username } = useParams();

  if(encodedEmail) {
    var decodedSelecteduserEmail = atob(encodedEmail);
  }
  
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inboxUsers, setInboxUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({email: decodedSelecteduserEmail, name: username});
  const [urluserName, setUrluserName] = useState(username);
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  
  // Ref to scroll to bottom of messages
  const messagesEndRef = useRef(null);

  // Initialize Socket.io
  useEffect(() => {
    // Initialize socket connection
    socketService.initializeSocket();
    
    // Set up socket event handlers
    socketService.setMessageHandler((message) => {
      if (selectedUser && message.senderEmail === selectedUser.email) {
        setMessages(prevMessages => [...prevMessages, {
          id: message.id,
          sender: selectedUser.name,
          text: message.text,
          time: message.time,
          timestamp: message.timestamp
        }]);
        scrollToBottom();
      }
    });
    
    socketService.setConfirmationHandler((message) => {
      setMessages(prevMessages => [...prevMessages, message]);
      setInput("");
      scrollToBottom();
    });
    
    socketService.setStatusChangeHandler((data) => {
      if (data.status === 'online') {
        setOnlineUsers(prev => new Set([...prev, data.email]));
      } else {
        setOnlineUsers(prev => {
          const updated = new Set([...prev]);
          updated.delete(data.email);
          return updated;
        });
      }
    });
    
    socketService.setOnlineUsersListHandler((usersList) => {
      setOnlineUsers(new Set(usersList));
    });
    
    socketService.setErrorHandler((error) => {
      toast.error(error.message || "Failed to send message");
    });
    
    // Clean up on unmount
    return () => {
      socketService.disconnect();
    };
  }, [selectedUser]);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const loginTokenCookie = Cookies.get('LoginStatus');
    const Curretmail = JSON.parse(Cookies.get('Email'));
    
    if (!loginTokenCookie) {
      navigate('/');
      return;
    }
    
    if (Curretmail) {
      setCurrentUserEmail(Curretmail);
      fetchInbox(Curretmail);
    }
    
    if (selectedUser && Curretmail) {
      fetchChat(selectedUser, Curretmail);
    }
  }, [navigate, selectedUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchInbox = async (email) => {
    try {
      setLoading(true);
      const response = await axios.post(`${SERVER_URL}/message/inbox`, { email });
      
      if (response.data === "inbox empty") {
        setInboxUsers([]);
      } else {
        setInboxUsers(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch inbox:", error);
      setInboxUsers([]);
      toast.error("Failed to load conversations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChat = async (otherUserEmail, currentUserEmail) => {
    try {
      setLoading(true);
      const response = await axios.post(`${SERVER_URL}/message/chats`, { 
        me: currentUserEmail, 
        other: otherUserEmail?.email 
      });
      
      // Combine and sort messages by timestamp
      const myMessages = response.data.myMessages.map(msg => ({
        id: `my-${msg.at}`,
        sender: "Me",
        text: msg.mes,
        time: formatTime(msg.at),
        timestamp: msg.at
      }));
      
      const otherMessages = response.data.senderMessages.map(msg => ({
        id: `other-${msg.at}`,
        sender: selectedUser?.name,
        text: msg.mes,
        time: formatTime(msg.at),
        timestamp: msg.at
      }));
      
      const allMessages = [...myMessages, ...otherMessages].sort((a, b) => a.timestamp - b.timestamp);
      setMessages(allMessages);
    } catch (error) {
      console.error("Failed to fetch chat:", error);
      setMessages([]);
      toast.error("Failed to load messages. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 12) return `${diffHours}h ago`;
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  const formatTimePlate = (timestamp) => {
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

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    fetchChat(user, currentUserEmail);
  };

  const handleSendMessage = () => {
    if (input.trim() && selectedUser) {
      // Send message via socket.io
      socketService.sendMessage(selectedUser.email, input);
      // The confirmation will come back via socket and update the UI
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
     <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Slide}
                closeButton={false}
                containerId="UserChat"
                />
          
   
    <div className="h-screen w-screen flex flex-col lg:flex-row">
      <Sidebar className='fixed inset-0 z-50' setonlineStatus={setOnlineStatus} onlineStatus={true} />
      <div className="flex-1 relative bg-gradient-to-b from-gray-950 via-blue-950 to-violet-950">
        
        {/* User list sidebar */}
        <div className="hidden border-l border-[#646cff] lg:block fixed right-0 top-0 bottom-0 w-64 bg-gray-900 p-4 overflow-y-auto">
          <div className="text-center text-xl font-semibold mb-6 text-white">Inbox</div>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : inboxUsers.length === 0 ? (
              <div className="text-center flex flex-col text-gray-400">No conversations yet
              <Link className="box p-2 mt-4" to='/SearchUsers'>Search Users</Link>
              </div>
              
            ) : (
              inboxUsers.map((user) => (
                <button
                  key={user.email}
                  className={`flex w-full items-center space-x-3 p-2 rounded-lg cursor-pointer ${
                    selectedUser?.email === user.email ? 'bg-blue-800' : 'bg-gray-800'
                  } hover:bg-gray-700`}
                  onClick={() => handleUserSelect(user)}
                >
                  {/* {user.image ? (
                    <img 
                      src={user.image} 
                      className="h-10 w-10 rounded-full object-cover" 
                      alt={user.name}
                    />
                  ) : ( */}
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      {user.name ? user.name[0] : '?'}
                    </div>
                  {/* )} */}
                  <div className="flex flex-col text-left">
                    <span className="text-white">{user.name}</span>
                    {/* Add online status indicator */}
                    <span className="text-xs flex items-center">
                      <span className={`inline-block h-2 w-2 rounded-full mr-1 ${
                        onlineUsers.has(user.email) ? 'bg-green-500' : 'bg-gray-500'
                      }`}></span>
                      <span className="text-gray-300">
                        {onlineUsers.has(user.email) ? 'Online' : 'Offline'}
                      </span>
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Mobile user list - simplified for brevity */}
        <div
          className={`slider ${
            onlineStatus ? 'translate-x-0' : 'translate-x-full'
          } block fixed right-0 z-50 top-0 bottom-0 w-64 bg-gray-900 p-4 overflow-y-auto`}
        >
          <button
            className="absolute top-2 right-2 p-2"
            onClick={() => setOnlineStatus(false)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="text-center mt-10 text-xl font-semibold mb-6 text-white">Inbox</div>
          {/* Similar content as desktop version */}
        </div>

        {/* Main chat area */}
        <div className="lg:mx-64 lg:max-w-[calc(100vw-506px)] h-screen flex flex-col">
          {/* Selected user header with online status */}
          <CurrentUserDatanav data={selectedUser} Status={onlineUsers} urlName={urluserName}  />
          
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="max-w-6xl mx-auto space-y-4">
              {!selectedUser ? (
                <div className="w-full flex flex-1 mt-[24vh] flex-col items-center justify-center p-16">
                  <div className="max-w-md text-center space-y-6">
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-bounce">
                          <MessageSquare className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold">Welcome to Memoria Nexus!</h2>
                    <p className="text-base-content/60">
                      Select a conversation from the sidebar to start chatting
                    </p>
                  </div>
                </div>
              ) : loading ? (
                <div className="text-center text-white p-8">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="w-full flex flex-1 mt-[24vh] flex-col items-center justify-center p-16">
                  <div className="max-w-md text-center space-y-6">
                    <div className="flex justify-center gap-4 mb-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center animate-bounce">
                          <MessageSquare className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold">Start a conversation with {selectedUser?.name || urluserName}</h2>
                    <p className="text-base-content/60">
                      No messages yet. Say hello!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg,index) => {
                  const isOwnMessage = msg.sender === "Me";
                  return (
                    <React.Fragment key={msg.id}>
                    {shouldShowDate(index) && (
                      <div className="text-center my-4">
                        <span className="bg-gray-800 text-teal-400 text-xs px-2 py-1 rounded-full">
                          {formatTimePlate(msg.timestamp)}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] md:max-w-[60%] rounded-lg p-3 ${
                          isOwnMessage
                            ? 'bg-gray-900 border border-green-500 text-white rounded-br-none'
                            : 'bg-black border border-cyan-300 text-gray-300 rounded-bl-none'
                        }`}
                      >
                        <div className="flex justify-between items-center gap-4">
                          <strong className="text-sm">{msg.sender}</strong>
                          <small className="text-xs opacity-75">{msg.time}</small>
                        </div>
                        <p className={`mt-1 !select-text break-words ${
                          isOwnMessage
                            ? 'text-[#5cff1c]'
                            : 'text-cyan-400'
                        }`}>{msg.text}</p>
                      </div>
                    </div>
                 </React.Fragment> 
                 );
                })
              )}
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message input area */}
          <div className="p-4 pb-6 bg-[#111826]">
            <div className="max-w-6xl mx-auto flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedUser ? `Message ${selectedUser?.name || urluserName}...` : "Select a user to chat with..."}
                className="flex-1 p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border-2 border-cyan-300 hover:border-[#646cff]"
                disabled={!selectedUser}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || !selectedUser}
                className={`box text-white px-4 py-2 rounded-lg transition-colors ${
                  !input.trim() || !selectedUser ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default UserChat;