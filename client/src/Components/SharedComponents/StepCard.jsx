import React from 'react';

function StepCard({ number, title, description }) {
  return (
    <div className="text-center flex flex-col justify-center items-center group ">
      <div className="w-16 h-16 !rounded-full box bg-violet-600 flex items-center justify-center mx-auto mb-4 transform transition-transform group-hover:scale-110 ">
        <span className="text-2xl font-semibold ">{number}</span>
      </div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-300 max-w-[300px]">{description}</p>
    </div>
  );
}

export default StepCard;

