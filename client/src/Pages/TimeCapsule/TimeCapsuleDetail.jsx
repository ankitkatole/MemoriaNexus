import React, { useEffect, useState } from 'react'; 
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SERVER_URL from '../../constant.mjs';
import Cookies from 'js-cookie';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
function TimeCapsuleDetail() {
   const navigate = useNavigate();
  const { id } = useParams(); 
  const [timeCapsule, setTimeCapsule] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = Cookies.get('Userid');
  const goBack = () => {
    navigate(-1); // This goes back to the previous page
  };
  useEffect(() => {
    const fetchTimeCapsuleDetail = async () => {
      try {
        console.log('Id', id);
        const response = await axios.post(`${SERVER_URL}/user/unlockTimeCapsule`, {
          userId: userId,
          timeCapsuleId: id
        });
        console.log('Time Capsule', response.data.timeCapsule);
        if (response.data.timeCapsule) {
            console.log('Time Capsule', response.data.timeCapsule);
          setTimeCapsule(response.data.timeCapsule); 
        } else {
          setError(response.data.message || 'Error fetching time capsule details');
        }
      } catch (error) {
        if (error.response) {
          // Display the message sent by the server
          setError(error.response.data.message || 'Error fetching time capsule details.');
        } else {
          setError('Error fetching time capsule details.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTimeCapsuleDetail();
  }, [id]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-200 text-red-700 w-screen text-center rounded-lg">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-800 p-6">
         <button className="box p-2 px-4 z-50 max-w-[100px] md:absolute my-5 md:my-0 top-2 left-2" onClick={goBack}><ArrowLeft /></button>
      {timeCapsule ? (
        <div className="bg-gray-700 w-full max-w-3xl rounded-lg p-6">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-3xl font-bold text-white">{timeCapsule.title}</h2>

            {timeCapsule.image && (
              <img 
                src={`data:image/jpeg;base64,${timeCapsule.image}`} 
                alt={timeCapsule.title} 
                className="w-full h-auto rounded-lg shadow-md"
              />
            )}

            <p className="text-lg text-white mt-4">{timeCapsule.description}</p>
            <p className="text-sm text-gray-400 mt-2">
              Unlock Date: {new Date(timeCapsule.unlock_date).toLocaleDateString()}
            </p>

            <div className="mt-4">
              <button
                className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition"
                onClick={() => alert('Unlocked!')} // Replace with real unlocking logic
              >
                Unlock Time Capsule
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-white text-lg">Time capsule details not available.</div>
      )}
    </div>
  );
}

export default TimeCapsuleDetail;
