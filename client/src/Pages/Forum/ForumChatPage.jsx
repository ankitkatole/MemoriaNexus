// ForumChatPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import SERVER_URL from '../../constant.mjs';
import Sidebar from '../../Components/SharedComponents/Sidebar';
import ForumChat from './ForumChat';
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForumChatPage = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const [forum, setForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  
  useEffect(() => {
    const userIdFromCookie = Cookies.get('Userid');
    
    if (!userIdFromCookie) {
      navigate('/');
      return;
    }
    
    setUserId(userIdFromCookie);
    fetchForumDetails();
  }, [forumId, navigate]);
  
  const fetchForumDetails = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/forum/${forumId}`);
      setForum(response.data);
      
      // Check if user is a member of this forum
      const userIdFromCookie = Cookies.get('Userid');
      if (!response.data.members.includes(userIdFromCookie)) {
        setError('You are not a member of this forum');
      }else {
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching forum details:', error);
      setError('Failed to load forum details');
    } finally {
      setLoading(false);
    }
  };
  
  //join the forum
  const handleJoinForum = async () => {
    try {
      await axios.post(`${SERVER_URL}/forum/join/${forumId}`, { userId });
      toast.success('You have joined the forum', { containerId: "ForumChatPage" });
      
      fetchForumDetails(); 
    } catch (error) {
      console.error('Error joining forum:', error);
      setError('Failed to join forum');
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
      containerId="ForumChatPage"
      />

    <div className="h-screen w-screen flex flex-col lg:flex-row">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-white">Loading forum...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-full">
            <p className="text-red-500 mb-4">{error}</p>
            {error === 'You are not a member of this forum' && (
              <button 
                onClick={handleJoinForum}
                className="box p-2 rounded-lg"
              >
                Join Forum
              </button>
            )}
          </div>
        ) : (
          <>
            {/* <div className="bg-gray-900 p-4 border-b border-cyan-300">
              <h1 className="text-2xl font-bold text-white">{forum.name}</h1>
              <p className="text-gray-400">Category: {forum.category}</p>
            </div> */}
            <div className="flex-1 overflow-hidden">
              <ForumChat forumId={forumId} forumName={forum.name}  />
            </div>
          </>
        )}
      </div>
    </div>
  </>
  );
};

export default ForumChatPage;