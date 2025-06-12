import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SERVER_URL from '../../constant.mjs';
import Cookies from 'js-cookie';
import { useNavigate,Link } from 'react-router-dom';
import { Search, ArrowLeft } from "lucide-react";
import green from '../../assets/green.webp'
import tom from '../../assets/tom.webp'
import tom2 from '../../assets/tom2.webp'
import tom3 from '../../assets/tom3.webp'
import pinkpanther from '../../assets/pinkpanther.webp'
import spondgebox from '../../assets/spondgebox.webp'

function SearchUsers() {

  const [users, setUsers] = useState([]); 
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true); 
  
const navigate = useNavigate();
  useEffect(() => {
    const userIdFromCookie = Cookies.get('Userid');
    if (userIdFromCookie) {
      
      fetchUsers();
    }
    else{
      navigate('/');
    }
  }, []);

  const fetchUsers = async (search) => {
    try {
      const response = await axios.post(`${SERVER_URL}/user/findUsers`,{search});
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching all users:', error);
      setUsers([]);
      setLoading(false);
    }
  };



 

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const goBack = () => {
    navigate(-1);
  };


  return (
    <>
    <div className="min-h-screen w-screen bg-black flex-col flex">

     
      <header className="sticky top-0 w-full z-10 backdrop-blur-md bg-black/50 border-b border-gray-800 mb-3">
                <div className="container md:ml-4 ml-2 py-4 flex items-start">
                  <button
                   
                    size="icon"
                    onClick={goBack}
                    className="md:mr-4 mr-2 text-gray-400 box hover:text-white hover:bg-gray-800"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  
                  {/* <h1 className="text-lg font-medium text-white">Search Users</h1> */}

                  <div className="flex   border-b border-cyan-300">
                 <input
                   type="text"
                   placeholder="Search Users..."
                 className="  md:w-full md:p-3 w-fit py-2 text-cyan-300 "
                  value={searchQuery}
                 onChange={handleSearch}
                />
                <button onClick={() => fetchUsers(searchQuery)} className='bg-transparent p-2  border-none text-gray-400 hover:text-cyan-300'><Search/></button>
                 </div>


                </div>
              </header>

        <div className="flex  pl-[4vw] flex-col items-start  relative justify-between w-fit mb-8">
          <h3 className="relative z-10 mb-3 text-3xl font-semibold text-start">
            Explore Users
          </h3>
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-border h-[2px] w-full"></span>
        </div>

        {loading ? (
           <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-cyan-300">Loading Users...</p>
          </div>
        </div>
        ) : users.length > 0 ? (
          <div className="space-y-2 flex flex-col items-center w-full">
            {users.map(user => {
                const encodedEmail = btoa(user.email)
           return  ( <Link to={`/UserChat/${encodedEmail}/${user.username}`} key={user.id} className=" w-[90%] p-4 rounded-lg backdrop-blur-lg  bg-gradient-to-br  from-black via-black to-cyan-400/25 border-2 border-gray-700/50 hover:border-cyan-300 transition-all duration-500 ">
                <div className="flex justify-start gap-5 items-center">
                <img src={user.profileImage} alt="User Profile" className='h-16 w-16 bg-[#131822] border-2 border-cyan-300 rounded-full object-cover  left-1/2' />
                <div>
                    <h2 className="text-xl text-cyan-300 font-bold">{user.firstName + user.lastName}</h2>
                    <p className="text-gray-400">@{user.username}</p>
                  </div>
                 
                </div>
              </Link>)
            })}
          </div>
        ) : (
          <p className="text-gray-400 ml-[4vw]">No users found.</p>
        )}
      </div>
  
    </>
  );
}

export default SearchUsers;

