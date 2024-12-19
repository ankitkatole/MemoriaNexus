import React from 'react';

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-gray-900/50 border-gray-800 overflow-hidden hover:scale-105 h-full  transition-all duration-500 delay-200 group hover:bg-gray-800/50 ">
      <div className="p-6 text-center  h-full box2">
        <div className="mb-4 flex  justify-center">
          {icon}
        </div>
        <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
}

export default FeatureCard;

