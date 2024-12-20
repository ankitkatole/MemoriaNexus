import React,{useEffect} from "react";
import Sidebar from "../../Components/SharedComponents/Sidebar";
import Feed from "./Feed";
import ForumAdd from "./ForumAdd";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

const Dashboard = () => {
    const navigate = useNavigate();
  
      useEffect(() => {
        const loginTokenCookie = Cookies.get('LoginStatus');
        if (!loginTokenCookie) {
          navigate('/'); 
        }
      }, [navigate]);

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
