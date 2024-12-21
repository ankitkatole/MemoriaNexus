import React,{useState} from 'react'
import { Menu,Plus } from "lucide-react";
import { Link } from 'react-router-dom';


function ForumAdd() {
  const [isForumMenuClicked, setisForumMenuClicked] = useState(false);

  return (
    <>
     <div className='flex fixed w-fit top-0 p-2 lg:hidden right-0 justify-end bg-black '>  <button
          className=" rounded-md  p-2"
          onClick={() => setisForumMenuClicked(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
       </div>
               <aside className="hidden lg:flex flex-col p-4 w-48 border-l border-[#646cff] bg-gray-900 space-y-4">
          
          <Link to='/Diary' className="box mt-3 text-white flex items-center gap-2 justify-center bg-gray-700 hover:bg-gray-800 py-2 px-4 rounded-lg">
          <Plus size={20} /> New Diary
              </Link>
  
            <button className="box text-white bg-gray-700 flex items-center gap-2 justify-center hover:bg-gray-800 py-2 px-4 rounded-lg">
             <Plus size={20} /> New Forum
            </button>
          </aside>


           {/* Mobile forum menu slider */}
      <div
        className={`slider ${
            isForumMenuClicked ? 'translate-x-0' : 'translate-x-full'
        } w-full bg-black fixed md:hidden z-[7777] inset-0 h-screen transition-transform duration-500 text-white text-5xl flex flex-col gap-4 justify-center items-center`}
      >
        <button
          className="absolute top-5 right-5 lg:hidden p-2"
          onClick={() => setisForumMenuClicked(false)}
        >
          <Menu className="h-6 w-6" />
        </button>

       
        <Link to='/Diary' className="navLink flex items-center gap-2 border-b-2 text-4xl border-cyan-300 py-2 rounded-sm">
          <Plus size={26} /> New Diary
              </Link>
  
            <a className="navLink flex items-center gap-2 border-b-2 text-4xl border-cyan-300 py-2 rounded-sm">
             <Plus size={26} /> New Forum
            </a>
       

        
      </div>
    </>
  )
}

export default ForumAdd
