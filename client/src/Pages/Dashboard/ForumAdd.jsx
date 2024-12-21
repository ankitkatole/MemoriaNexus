import React, { useState } from 'react';
import { Menu, Plus } from "lucide-react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import SERVER_URL from '../../constant.mjs';
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForumAdd() {
  const [isForumMenuClicked, setisForumMenuClicked] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [forumName, setForumName] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  // State to store error messages

  const handleCreateForum = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);  // Reset error before new submission
    try {
      const response = await axios.post(`${SERVER_URL}/forum/createForum`, {
        name: forumName,
        category: category,
      });
  toast.success(response.data || 'Forum created successfully:', { containerId: "Forum" });
      
      console.log('Forum created successfully:', response.data);
      setLoading(false);
      setForumName('');
      setCategory('');
      // setIsPopupOpen(false);
    } catch (error) {
      setLoading(false);
      setError('Error creating forum. Please try again.');  // Set error message
      console.error('Error creating forum:', error);
    }
  };

  return (
    <>
 

      <div className='flex fixed w-fit top-0 p-2 lg:hidden right-0 justify-end bg-black '>
        <button className="rounded-md p-2" onClick={() => setisForumMenuClicked(true)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      <aside className="hidden lg:flex flex-col p-4 w-48 border-l border-[#646cff] bg-gray-900 space-y-4">
        <Link to='/Diary' className="box mt-3 text-white flex items-center gap-2 justify-center bg-gray-700 hover:bg-gray-800 py-2 px-4 rounded-lg">
          <Plus size={20} /> New Diary
        </Link>

        <button className="box text-white bg-gray-700 flex items-center gap-2 justify-center hover:bg-gray-800 py-2 px-4 rounded-lg"
          onClick={() => setIsPopupOpen(true)}
        >
          <Plus size={20} /> New Forum
        </button>
      </aside>

      {/* Mobile forum menu slider */}
      <div
        className={`slider ${isForumMenuClicked ? 'translate-x-0' : 'translate-x-full'} w-full bg-black fixed md:hidden z-[7777] inset-0 h-screen transition-transform duration-500 text-white text-5xl flex flex-col gap-4 justify-center items-center`}
      >
        <button className="absolute top-5 right-5 lg:hidden p-2" onClick={() => setisForumMenuClicked(false)}>
          <Menu className="h-6 w-6" />
        </button>

        <Link to='/Diary' className="navLink flex items-center gap-2 border-b-2 text-4xl border-cyan-300 py-2 rounded-sm">
          <Plus size={26} /> New Diary
        </Link>

        <a className="navLink flex items-center gap-2 border-b-2 text-4xl border-cyan-300 py-2 rounded-sm" onClick={() => setIsPopupOpen(true)}>
          <Plus size={26} /> New Forum
        </a>
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
                  <option value="kids">Kids</option>
                  <option value="sports">Sports</option>
                  <option value="music">Music</option>
                  <option value="education">Education</option>
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
