import React from 'react';
import { Card, CardContent } from "@mui/material";

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="bg-gray-900/50 border-gray-800 overflow-hidden hover:scale-105 h-full  transition-all duration-500  group hover:bg-gray-800/50 ">
      <CardContent className="p-6 text-center  h-full box2">
        <div className="mb-4 flex  justify-center">
          {icon}
        </div>
        <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
}

export default FeatureCard;

