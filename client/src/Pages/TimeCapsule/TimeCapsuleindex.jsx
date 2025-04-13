import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { ArrowLeft } from 'lucide-react';
import SERVER_URL from '../../constant.mjs';
import { createPortal } from "react-dom";
import TimeCapsuleForm from './TimeCapsuleForm';

function TimeCapsuleindex() {
  const navigate = useNavigate();
  const [timeCapsules, setTimeCapsules] = useState([]);
  const [OpenStatus, setOpenStatus] = useState(false);
  const [error, setError] = useState('');

  // Fetch time capsules
  useEffect(() => {
    const fetchTimeCapsules = async () => {
      try {
        const userId = Cookies.get('Userid'); // Fetch userId from cookies
        if (!userId) {
          setError('User ID not found in cookies');
          return;
        }

        const response = await axios.post(`${SERVER_URL}/user/timeCapsules`, { userId });
        
        if (response.data.timeCapsules && response.data.timeCapsules.length > 0) {
          setTimeCapsules(response.data.timeCapsules); // Store the time capsules in state
        } else {
          setError(response.data.message || 'No time capsules found.');
        }
      } catch (error) {
      
        setError(error.response.data.message || 'Error fetching time capsules. Please try again.');
      }
    };

    fetchTimeCapsules();
  }, []);

  const goBack = () => {
    navigate(-1); // This goes back to the previous page
  };

  const viewTimeCapsuleDetail = (capsuleId) => {
    // Redirect to the detailed view page for the selected time capsule
    navigate(`/TimeCapsuleDetail/${capsuleId}`);
  };

  return (
    <>
      {OpenStatus && createPortal(
        <TimeCapsuleForm setopenStatus={setOpenStatus} />,
        document.body
      )}

      <div className="flex flex-col w-screen min-h-screen px-[2vw] gap-4">
        <button className="box p-2 px-4 z-50 max-w-[100px] md:absolute my-5 md:my-0 top-2 left-2" onClick={goBack}><ArrowLeft /></button>

        <div className="bg-gray-800 flex gap-4 relative justify-center mt-10 py-10 lg:rounded-lg w-screen md:w-auto">
          <button className="box2 w-[50%] py-3 h-fit" onClick={() => setOpenStatus(true)}>Create Time Capsule</button>
        </div>

        <div className="col-span-2 flex flex-col gap-4">
          <div className='flex flex-col items-center justify-between w-full mb-8'>
            <h3 className="relative z-0 mb-3 text-3xl font-semibold text-start">Time Capsules</h3>
            <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-border h-[2px] w-[280px]'></span>
          </div>

          {error ? (
            <div className="bg-red-200 text-red-700 p-4 rounded-lg">{error}</div>
          ) : timeCapsules.length > 0 ? (
            timeCapsules.map((capsule) => (
              <div 
                key={capsule._id} 
                className="bg-gray-800 box rounded-lg h-32 flex justify-start px-10 items-center p-4 cursor-pointer"
                onClick={() => viewTimeCapsuleDetail(capsule._id)} 
              >
                <div className="text-left">
                  <p className="font-bold text-2xl">{capsule.title}</p>
                  <p className="text-base timeCapsuleDiscription">{capsule.description}</p>
                  <p className="text-xs text-gray-500">Unlock Date: {new Date(capsule.unlock_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg">Loading time capsules...</div>
          )}
        </div>
      </div>
    </>
  );
}

export default TimeCapsuleindex;
