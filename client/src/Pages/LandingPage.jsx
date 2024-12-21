import React, { useState,useEffect } from 'react';
// import { Button } from '@mui/material';
// import { Card, CardContent } from "@mui/material";
import { BookHeart, History, Share2, Users2, } from 'lucide-react';
import SignUp from './Resgistration/SignUp';
import Login from './Resgistration/Login';
import StepCard from '../Components/SharedComponents/StepCard'
import FeatureCard from '../Components/SharedComponents/FeatureCard'
import { createPortal } from "react-dom";
import Navbar from '../Components/SharedComponents/Navbar';
import Heroimg from '../assets/heroimage.svg'
import Footer from '../Components/SharedComponents/Footer';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'

function LandingPage() {
  const navigate = useNavigate();

    useEffect(() => {
      const loginTokenCookie = Cookies.get('LoginStatus');
      if (loginTokenCookie) {
        navigate('/Dashboard'); 
      }
    }, [navigate]);

  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  return (
    <> {isSignInOpen && createPortal(
                
      <Login onClose={setIsSignInOpen} SignUpOpen={setIsSignUpOpen} />,
      document.body
  
    )}
    {isSignUpOpen && createPortal(
                
      <SignUp onClose={setIsSignUpOpen} LoginOpen={setIsSignInOpen} />,
      document.body
  
    )}
    <div className="min-h-screen w-screen bg-gradient-to-b from-gray-950 via-blue-950 to-violet-950 text-gray-100 ">
      
      {/* Header */}
     <Navbar LoginOpen={setIsSignInOpen} SignupOpen={setIsSignUpOpen} />
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative justify-center flex flex-col lg:flex-row gap-20 ">

      <div className=" relative">
          <img 
            src={Heroimg} 
            alt="MemoriaNexus App Interface" 
            className="rounded-lg shadow-2xl mx-auto box object-cover h-[400px] md:h-full  transform transition-transform hover:scale-105 hover:rotate-1"
            style={{ width: '600px'}}
          />
        </div>

        <div className=' xl:w-[42%] flex items-center lg:items-start justify-start flex-col'>
          <div className="absolute  inset-0 flex items-center justify-center opacity-10">
          <div className="w-96 h-96 bg-violet-500 rounded-full filter blur-3xl animate-pulse"></div>
        </div>
        <h2 style={{ fontSize: "clamp(30px, 4vw, 60px)" }} className=" text-center font-bold  lg:text-left   mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent relative z-10">
          Preserving memories, Connecting lives
        </h2>
        <p className="text-xl text-center md:w-[80vw] lg:w-[90%] xl:w-auto text-gray-100 max-w-2xl lg:text-left 2xl:mx-auto mb-8 relative z-10">
          Your digital sanctuary for preserving memories and sharing stories across generations
        </p>
        <button className="box text-white px-8 max-w-[250px] py-2 text-lg relative z-10 transform transition-transform duration-500 hover:scale-105">
          Start Your Journey
        </button>
        </div>
        
      </section>

      {/* About Section */}
      <section id="about" className="container w-[90vw] rounded-xl  mx-auto px-4 py-20 relative">
        <div className="bg-gray-900/50 bg-[#262d3c]  border-gray-800 overflow-hidden">
          <div className="p-8 relative box !border-none bg-[#262d3c]">
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00f6ff] rounded-full  filter blur-xl   animate-blob"></div>
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-violet-500 rounded-full  blur-xl  filter animate-blob animation-delay-2000"></div>
            <h3 className="text-3xl text-white font-semibold mb-6 text-center relative z-10" style={{ fontSize: "clamp(20px, 2.4vw, 35px)" }}>About Memoria Nexus</h3>
            <p className="text-white text-lg text-center max-w-3xl mx-auto relative z-10" style={{ fontSize: "clamp(14px, 1.5vw, 16px)" }}>
              Memoria Nexus is your all-in-one platform for logging diary entries, preserving personal memories, 
              and sharing life stories across generations. We bridge generational gaps and foster deeper connections 
              through shared experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 xl:px-20 py-20">

      <div className='flex flex-col justify-center items-center w-full mb-12'>
        <h3 className="text-3xl md:text-4xl font-semibold  text-center relative z-10 mb-3  ">Features of Website</h3>
        <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-border h-[2px] w-[80vw] md:w-[390px]'></span>
        </div>

        <div className="grid md:grid-cols-2  lg:grid-cols-4 gap-8">
          <FeatureCard 
            icon={<BookHeart className="w-12 h-12 mb-4 text-violet-400" />}
            title="Diary Logging"
            description="Record your daily thoughts and experiences in a secure digital space"
          />
          <FeatureCard 
            icon={<History className="w-12 h-12 mb-4 text-violet-400" />}
            title="Memory Storage"
            description="Preserve your precious memories with our advanced storage system"
          />
          <FeatureCard 
            icon={<Users2 className="w-12 h-12 mb-4 text-violet-400" />}
            title="Empathy Exchange"
            description="Connect with others through shared experiences and stories"
          />
          <FeatureCard 
            icon={<Share2 className="w-12 h-12 mb-4 text-violet-400" />}
            title="Story Sharing"
            description="Share your life stories with family and future generations"
          />
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 relative">
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        </div>
        <div className='flex flex-col justify-center items-center w-full mb-12'>
        <h3 className="text-3xl font-semibold  text-center relative z-10 mb-3  ">How It Works</h3>
        <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-border h-[2px]  w-[250px]'></span>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative z-10">
          <StepCard number={1} title="Create Your Space" description="Sign up and personalize your digital memory vault" />
          <StepCard number={2} title="Record Memories" description="Log your stories, upload photos, and preserve moments" />
          <StepCard number={3} title="Connect & Share" description="Share your stories with family and loved ones" />
        </div>
      </section>

      {/* Footer */}
     
      <Footer/>
     
      {/* <Login isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      <SignUp isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} /> */}
    </div>
    </>
  );
}

export default LandingPage;

