import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'
import SERVER_URL from '../constant.mjs';


const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    const loginTokenCookie = Cookies.get('LoginStatus');
    if (!loginTokenCookie) {
      navigate('/'); 
    }
  }, [navigate]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {

    const response = await axios.post(
      `${SERVER_URL}/horizon`, 
      {
        userInput: message,
      },
      {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const raw = response.data.output;
    const text = raw.replace(/\*+\s?/g, '');
      setMessages(prev => [...prev, { role: 'assistant', content:text  }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error sending message.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen text-white bg-gray-900">
      <header className="p-4 text-center bg-gray-800">
        <h1 className="text-3xl font-bold">Horizon</h1>
      </header>
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 space-y-4 overflow-auto"
      >
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex justify-start"
          >
            <div className="max-w-md p-3 bg-gray-700 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Chat;

