import React, { useState, useEffect } from 'react';
import { Menu, Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import SERVER_URL from '../../constant.mjs';
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';

function ForumAdd() {
    useEffect(() => {
          
            var userIdFromCookie = Cookies.get('Userid');
            
            if (userIdFromCookie) {
              setUsername(JSON.parse(userIdFromCookie)); 
            }
          
         
          }, []);
  const [Username, setUsername] = useState('');
  const [isForumMenuClicked, setisForumMenuClicked] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [forumName, setForumName] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const handleCreateForum = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 
    try {
      const response = await axios.post(`${SERVER_URL}/forum/createForum`, {
        name: forumName,
        category: category,
        members: Username,
      });
      
  toast.success('Forum created successfully:', { containerId: "Forum" });
      
      console.log('Forum created successfully:', response.data);
      setLoading(false);
      setForumName('');
      setCategory('');
      // setIsPopupOpen(false);
    } catch (error) {
      setLoading(false);
      setError('Error creating forum. Please try again.'); 
      console.error('Error creating forum:', error);
    }
  };

  return (
    <>
 

      <div className='flex fixed w-fit top-0 p-2 z-50 lg:hidden right-0 justify-end bg-black '>
        <button className="rounded-md p-2" onClick={() => setisForumMenuClicked(true)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <aside className="hidden lg:flex flex-col p-4 w-48 border-l border-[#646cff] bg-gray-900 space-y-4">
        <Link to='/Diary' className="box mt-3  hover:!text-white hover:border-[#646cff] flex items-center gap-2 justify-center bg-gray-700 hover:bg-gray-800 py-2 px-4 rounded-lg">
          Memory Diary
        </Link>
       

        <button className="box text-white bg-gray-700 flex items-center gap-2 justify-center hover:bg-gray-800 py-2 px-4 rounded-lg"
          onClick={() => setIsPopupOpen(true)}
        >
          <Plus size={20} /> New Forum
        </button>

        <Link to='/ForumPage' className="box mt-3  hover:!text-white hover:border-[#646cff] flex items-center gap-2 justify-center bg-gray-700 hover:bg-gray-800 py-2 px-4 rounded-lg">
          See Forums
        </Link>
        <Link to='/TimeCapsuleindex' className="box mt-3  hover:!text-white hover:border-[#646cff] flex items-center gap-2 justify-center bg-gray-700 hover:bg-gray-800 py-2 px-4 rounded-lg">
           Time Capsule
        </Link>
      </aside>

      {/* Mobile forum menu slider */}
      <div
        className={`slider ${isForumMenuClicked ? 'translate-x-0' : 'translate-x-full'}   pl-2 fixed lg:hidden z-[9999]  inset-0 h-screen transition-transform duration-500 text-white text-5xl flex flex-col gap-4 justify-center items-end`}
      >
       <div className='flex flex-col items-center justify-center gap-4 h-screen border-l border-cyan-300 bg-gray-900 w-64'> 
        <button className="absolute top-5 right-5 lg:hidden p-2" onClick={() => setisForumMenuClicked(false)}>
          <Menu className="h-6 w-6" />
        </button>

        <Link to='/Diary' className="navLink flex items-center gap-2 border-b-2 text-4xl border-cyan-300 py-2 rounded-sm">
          Memory Diary
        </Link>

      

        <a className="navLink flex items-center gap-2 border-b-2 text-4xl border-cyan-300 py-2 rounded-sm" onClick={() => setIsPopupOpen(true)}>
          <Plus size={26} /> New Forum
        </a>

        <Link to='/ForumPage' className="navLink flex items-center gap-2 border-b-2 text-4xl border-cyan-300 py-2 rounded-sm">
           See Forums
        </Link>
        <Link to='/TimeCapsuleindex' className="navLink flex items-center gap-2 border-b-2 text-4xl border-cyan-300 py-2 rounded-sm">
           Time Capsule
        </Link>

      </div>
      </div>

      {isPopupOpen && (
        <>
        
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-[9999]">
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
         containerId="Forum"
       />
          <div className="bg-[#131822] border-cyan-300 border-2 animate-breathe p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl mb-4 font-semibold text-cyan-400">Create New Forum</h2>

            {/* Display error message */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleCreateForum}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder='Forum Name'
                  className="w-full p-3 text-cyan-300 border-b border-cyan-300"
                  value={forumName}
                  onChange={(e) => setForumName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <select
                  className="w-full p-3 text-cyan-300 border-b border-cyan-300 bg-transparent"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Life Stories & Memories">Life Stories & Memories</option>
                  <option value="Creative Corner">Creative Corner</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Relationships & Advice">Relationships & Advice</option>
                  <option value="Inspirational & Motivational">Inspirational & Motivational</option>
                  <option value="Hobbies & Interests">Hobbies & Interests</option>
                  <option value="Time Capsule">Time Capsule</option>
                  <option value="General Discussion">General Discussion</option>
                  <option value="Memoria Nexus News & Updates">Memoria Nexus News & Updates</option>
                </select>
              </div>
              

              <div className="flex justify-end">
                <button type="button" className="mr-2 py-2 px-4 bg-gray-700 text-white rounded-lg" onClick={() => setIsPopupOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="py-2 px-4 box text-white rounded-lg">{ loading ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
        </>
      )}
    </>
  );
}

export default ForumAdd;
