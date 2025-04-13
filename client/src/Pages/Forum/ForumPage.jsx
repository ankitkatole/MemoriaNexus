import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SERVER_URL from '../../constant.mjs';
import Cookies from 'js-cookie';
import { useNavigate,Link } from 'react-router-dom';
import { Menu, Plus } from "lucide-react";


function ForumPage() {
  const [forums, setForums] = useState([]); 
  const [filteredForums, setFilteredForums] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [joinedForums, setJoinedForums] = useState([]);
  const [showJoinedForumsOnly, setShowJoinedForumsOnly] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
const navigate = useNavigate();
  useEffect(() => {
    const userIdFromCookie = Cookies.get('Userid');
    if (userIdFromCookie) {
      const parsedUserId = userIdFromCookie;
      setUserId(parsedUserId);
      // First fetch joined forums
      fetchUserJoinedForums(parsedUserId);
      // Then fetch all forums
      fetchAllForums();
    }
    else{
      navigate('/');
    }
  }, []);

  const fetchAllForums = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/forum/getAllForumNames`);
      setForums(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all forums:', error);
      setLoading(false);
    }
  };

  const fetchUserJoinedForums = async (userId) => {
    try {
      const response = await axios.get(`${SERVER_URL}/forum/getForumUsingUserId/${userId}`);
      setJoinedForums(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user joined forums:', error);
      setLoading(false);
    }
  };

  // Apply filtering in useEffect when data or filters change
  useEffect(() => {
    if (!loading) {
      filterForums(searchQuery, categoryFilter, showJoinedForumsOnly, forums, joinedForums);
    }
  }, [forums, joinedForums, searchQuery, categoryFilter, showJoinedForumsOnly, loading]);

  useEffect(() => {
    if (forums.length > 0 && joinedForums.length >= 0) {
      setLoading(false); // Set loading to false when both forums and joinedForums are fetched
    }
  }, [forums, joinedForums]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setCategoryFilter(category);
  };

  const handleJoinedForumsToggle = (e) => {
    const showJoined = e.target.checked;
    setShowJoinedForumsOnly(showJoined);
  };

  const filterForums = (query, category, showJoined, currentForums, currentJoinedForums) => {
    // If showing joined forums only, start with joined forums
    let filtered = showJoined ? currentJoinedForums : currentForums;

    // Apply search query filter if exists
    if (query) {
      filtered = filtered.filter(forum => 
        forum.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply category filter if exists
    if (category) {
      filtered = filtered.filter(forum => forum.category === category);
    }

    setFilteredForums(filtered);
  };

  return (
    <>
    <div className="min-h-screen w-screen flex-col  lg:flex-row flex">
      <div className="p-6 bg-gray-900 hidden lg:block text-white">
        <h1 className="text-3xl font-bold mb-4">Search Forums</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Forums..."
            className="w-full p-3 text-cyan-300 bg-gray-700 border-b border-cyan-300"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="mb-4">
          <select
            className="w-full p-3 text-cyan-300 bg-gray-700 border-b border-cyan-300"
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
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

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={showJoinedForumsOnly}
              onChange={handleJoinedForumsToggle}
            />
            <span className="ml-2">Show Joined Forums Only</span>
          </label>
        </div>
      </div>

<div className='flex sticky w-screen z-50 top-0 p-2 lg:hidden right-5 justify-between bg-black '> 
        <button
          className="rounded-md  p-2"
          onClick={() => setIsMenuOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
       
      </div>

{/* Mobile navbar */}

<div
        className={`slider ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-72 bg-gray-900 border-r border-cyan-300 fixed lg:hidden z-[7777] inset-0 h-screen transition-transform duration-500 text-white text-5xl flex flex-col gap-4 justify-center items-center`}
      >
        <button
          className="absolute top-5 left-5  p-2"
          onClick={() => setIsMenuOpen(false)}
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="p-6 bg-gray-900  text-white">
        <h1 className="text-xl font-bold mb-4">Search Forums</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Forums..."
            className="w-full p-3 text-cyan-300 bg-gray-700 border-b text-base border-cyan-300"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="mb-4">
          <select
            className="w-full p-3  text-cyan-300 bg-gray-700 border-b text-base border-cyan-300"
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
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

        <div className="mb-4 text-base">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              checked={showJoinedForumsOnly}
              onChange={handleJoinedForumsToggle}
            />
            <span className="ml-2">Show Joined Forums Only</span>
          </label>
        </div>
      </div>

       
      </div>
{/* Mobile navbar end */}



      <div className="w-full  my-4">
        <div className="flex  ml-[4vw] flex-col items-start justify-between w-full mb-8">
          <h3 className="relative z-10 mb-3 text-3xl font-semibold text-start">
            {showJoinedForumsOnly ? 'Joined Forums' : 'All Forums'}
          </h3>
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-border h-[2px] w-[100px]"></span>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading forums...</p>
        ) : filteredForums.length > 0 ? (
          <ul className="space-y-2 flex flex-col items-center w-full">
            {filteredForums.map(forum => (
              <li key={forum.id} className="bg-gray-800 w-[90%] p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">{forum.name}</h2>
                    <p className="text-gray-400">Category: {forum.category}</p>
                  </div>
                  {forum.members && forum.members.includes(userId) && (
                    <span className="px-3 py-1 bg-cyan-500 text-white rounded-full text-sm">
                      Joined
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No forums found.</p>
        )}
      </div>
    </div>
    </>
  );
}

export default ForumPage;
