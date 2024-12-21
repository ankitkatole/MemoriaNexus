import React, { useState } from 'react';
import './TimeCapsuleCard.css';
import SERVER_URL from '../../constant.mjs';


export default function TimeCapsuleCard({ capsule }) {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/user/timecapsule/${capsule.id}`);
      const data = await response.json();
      if (response.status === 200) {
        setDetails(data.timeCapsule);
      } else if (response.status === 400) {
        setDetails({ locked: true, message: data.message });
      }
    } catch (error) {
      console.error('Error fetching capsule details:', error);
      setDetails({ error: 'Failed to fetch capsule details' });
    }
    setIsLoading(false);
  };

  return (
    <div className="capsule-card" onClick={fetchDetails}>
      <h3>{capsule.title}</h3>
      <p>Unlock Date: {new Date(capsule.unlockDate).toLocaleDateString()}</p>
      {isLoading && <p>Loading...</p>}
      {details && !isLoading && (
        <div className="capsule-details">
          {details.locked ? (
            <p>{details.message}</p>
          ) : (
            <>
              <img src={details.imageUrl} alt={details.title} />
              <p>{details.description}</p>
              <p>Location: {details.geolocation}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

