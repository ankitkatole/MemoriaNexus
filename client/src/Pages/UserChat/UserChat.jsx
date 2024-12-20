import React, { useState,useEffect } from "react";
// import Navbar from "../../Components/SharedComponents/Navbar";
import { MessageSquare, Menu } from "lucide-react";
import Sidebar from "../../Components/SharedComponents/Sidebar";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

const UserChat = () => {

 const navigate = useNavigate();
  
      useEffect(() => {
        const loginTokenCookie = Cookies.get('LoginStatus');
        console.log('LoginStatus Cookie:', loginTokenCookie);
        if (!loginTokenCookie) {
          navigate('/'); 
        }
      }, [navigate]);

  const [input, setInput] = useState("");
  const [onlineStatus, setonlineStatus] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "Alex", text: "Hey, how's the auction going?", time: "12m ago" },
    { id: 2, sender: "Haley", text: "It's been great! Just waiting for more bids.", time: "10m ago" },
    { id: 3, sender: "Raj", text: "sxaaaaaaaaaaaaaaaaaaaasxaaaaaaaaaaaaaaaaaaaasxaaaaaaaaaaaaaaaaaaaasxaaaaaaaaaaaaaaaaaaaasxaaaaaaaaaaaaaaaaaaaasxaaaaaaaaaaaaaaaaaaaasxaaaaaaaaaaaaaaaaaaaasxaaaaaaaaaaaaaaaaaaaa sxaaaaaaaaaaaaaaaaaaaasxaaaaaaaaaaaaaaaaaaaa", time: "5m ago" },
  ]);

  const [onlineUsers, setOnlineUsers] = useState([
    { id: 1, name: "Alex" },
    { id: 2, name: "Haley" },
    { id: 3, name: "Raj" },
    { id: 4, name: "Amanda" },
  ]);

  const handleSendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "Me",
        text: input,
        time: "Just now",
      };
      setMessages([...messages, newMessage]);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row ">
      <Sidebar className='fixed inset-0 z-50' setonlineStatus={setonlineStatus} onlineStatus={true} />
      <div className="flex-1 relative bg-gradient-to-b from-gray-950 via-blue-950 to-violet-950">
        
        {/* Sidebar */}
        <div className="hidden border-l border-[#646cff] lg:block fixed right-0 top-0 bottom-0 w-64 bg-gray-900 p-4 overflow-y-auto">
          <div className="text-center text-xl font-semibold mb-6 text-white">Online Users</div>
          <div className="space-y-4">
            {onlineUsers.length === 0 ? (
              <div className="text-center text-gray-400">No users online</div>
            ) : (
              onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg"
                >
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {user.name[0]}
                  </div>
                  <span className="text-white">{user.name}</span>
                </div>
              ))
            )}
          </div>
        </div>


        <div
        className={`slider ${
          onlineStatus ? 'translate-x-0' : 'translate-x-full'
        } block fixed right-0 z-50 top-0 bottom-0 w-64 bg-gray-900 p-4 overflow-y-auto`}
      >
      
        <div className="block fixed right-0 top-0 bottom-0 w-64 bg-gray-900 p-4 overflow-y-auto">
        <button
          className="absolute top-2 right-2  p-2"
          onClick={() => setonlineStatus(false)}
        >
          <Menu className="h-6 w-6" />
        </button>
          <div className="text-center mt-10 text-xl font-semibold mb-6 text-white">Online Users</div>
          <div className="space-y-4">
            {onlineUsers.length === 0 ? (
              <div className="text-center text-gray-400">No users online</div>
            ) : (
              onlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-3 p-2 bg-gray-800 rounded-lg"
                >
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {user.name[0]}
                  </div>
                  <span className="text-white">{user.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
       
      </div>




        {/* Main chat area */}
        <div className="lg:mx-64 lg:max-w-[calc(100vw-506px)]  h-screen flex flex-col" >
        
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="max-w-6xl  mx-auto space-y-4">
              {messages.length === 0 ? (
                 
              //  no msg yet notification shuru
               <div className="w-full flex flex-1 mt-[24vh] flex-col items-center justify-center p-16 ">
                   <div className="max-w-md text-center space-y-6">
                    
                     <div className="flex justify-center gap-4 mb-4">
                       <div className="relative">
                         <div
                           className="w-16 h-16 rounded-2xl flex items-center
                          justify-center animate-bounce"
                         >
                           <MessageSquare className="w-8 h-8 text-primary " />
                         </div>
                       </div>
                     </div>
             
                    
                     <h2 className="text-2xl font-bold">Welcome to Memoria Nexus!</h2>
                     <p className="text-base-content/60">
                       Messages will appear here
                     </p>
                   </div>
                 </div>
        //  no msg yet notification Khatam

              ) : (
                messages.map((msg) => {
                  const isOwnMessage = msg.sender === "Me";
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] md:max-w-[60%] rounded-lg p-3 ${
                          isOwnMessage
                            ? 'box2 text-white rounded-br-none'
                            : 'bg-gray-800 text-gray-300 rounded-bl-none'
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
                  );
                })
              )}
            </div>
          </div>

          {/* msg input area */}
          <div className="p-4 pb-6 bg-[#111826]">
            <div className="max-w-6xl mx-auto flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border-2 border-cyan-300 hover:border-[#646cff]"
              />
              <button
                onClick={handleSendMessage}
                className="box text-white  px-4 py-2 rounded-lg transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserChat;
