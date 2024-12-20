import React from 'react';
import { motion } from 'framer-motion';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`max-w-md p-3 rounded-lg ${
          isUser ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        <p className="text-white">{message.content}</p>
      </div>
    </motion.div>
  );
};

export default ChatMessage;

