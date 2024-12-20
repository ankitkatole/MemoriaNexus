import React from "react";
import Sidebar from "../../Components/SharedComponents/Sidebar";
import Feed from "./Feed";
import ForumAdd from "./ForumAdd";
const Dashboard = () => {
  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-b from-gray-950 via-blue-950 to-violet-950">

      <div className="flex flex-col md:flex-row flex-1">
       
        <Sidebar/>

        {/* Main Freed Component */}
        <Feed/>

        {/* Forum Right Sidebar for diary and forum add */}
        <ForumAdd/>
     
      </div>
    </div>
  );
};

export default Dashboard;
