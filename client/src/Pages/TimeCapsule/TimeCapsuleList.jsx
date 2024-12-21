import React, { useState, useEffect } from 'react';
import TimeCapsuleCard from './TimeCapsuleCard';
import './TimeCapsuleList.css';
import SERVER_URL from '../../constant.mjs';

export default function TimeCapsuleList() {
  const [capsules, setCapsules] = useState([]);

  useEffect(() => {
    fetchCapsules();
  }, []);

  const fetchCapsules = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/user/showall`);
      if (response.ok) {
        const data = await response.json();
        setCapsules(data);
      } else {
        console.error('Failed to fetch time capsules');
      }
    } catch (error) {
      console.error('Error fetching time capsules:', error);
    }
  };

  return (
    <div className="capsule-list">
      {capsules.map(capsule => (
        <TimeCapsuleCard key={capsule.id} capsule={capsule} />
      ))}
    </div>
  );
}

