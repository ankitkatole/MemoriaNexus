import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ChatInput = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    onSendMessage(message);
    setMessage('');
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-800"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 text-white bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <motion.button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Send
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ChatInput;

