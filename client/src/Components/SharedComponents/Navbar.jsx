import React,{useState} from 'react'
import Logo from '../../assets/LogoTransparent.svg'
import { Menu,LogOut } from 'lucide-react'
import { Link,useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'


function Navbar({LoginOpen, SignupOpen}) {
  const navigate = useNavigate();  

  const [isMenuClicked,setisMenuClicked] = useState(false);

  const navLinks =[
    { link:'Features',
      href:'#',
    },
    { link:'About',
      href:'#',
    },
    { link:'How It Works',
      href:'#',
    },
    { link:'Diary',
      href:'/Diary',
    },
    { link:'User Chat',
      href:'/UserChat',
    },
 
  ]
//   function Logout(){
//     Cookies.remove('LoginStatus');
//     navigate('/');
//  }


  return (
    <>
    {/* <div className='flex justify-between items-center px-4 border w-screen top-0 relative border-white '>
        <img src={Logo} alt="" className='w-8 h-8' /> */}
{/* <button className='bg-gradient-to-b from-[#18203E] to-[#13203a] sm:py-2 p-1.5 text-[#11111] px-6 rounded-full font-semibold font-sans sm:min-w-28 relative ctaBtn' style={{boxShadow: "inset 0 0 12px 0 rgba(191,151,255,0.24)", border:"2px solid rgba(224, 224, 224, 0.18)"}}>login</button> */}
{/* <div className="box p-2 bg-black px-4 rounded-md m-2 ">
       <Menu color={'white'} size={'24px'} />
      </div>
    </div> */}

    <header className="border-b  w-full border-gray-800  bg-[#070a1a] sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className='flex  items-center gap-10'>
           
          <div className='flex gap-4'> <img src={Logo} alt="" className='w-7 h-7' />
           
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            MemoriaNexus
            </h1>

          </div> 


          <div className="hidden lg:flex space-x-6">
          {navLinks.map((navLink, index) => (
            <a key={index} href={navLink.href} className="hover:text-violet-400 transition-colors hover:underline underline-offset-4 ">{navLink.link}</a>
          ))}
          </div>

          </div>
          <div className=" hidden lg:flex items-center space-x-4 mx-4">
            <button  className="border-violet-500  p-[6px] px-5 hover:bg-violet-950 " onClick={() => LoginOpen(true)}>
              Sign In
            </button>

            <button className="border-cyan-300  p-[6px] px-5 hover:bg-violet-950 transition-all duration-500 " onClick={() => SignupOpen(true)}>
              Sign Up
            </button>

            {/* <a href="" className='flex items-center gap-1' onClick={Logout}><LogOut/>Logout</a> */}
          </div>

          <button  className=" lg:hidden p-2" onClick={()=>{setisMenuClicked(true)}} >
            <Menu className="h-6 w-6 " />
          </button>
          
        </nav>
      </header>

      
      <div
        className={`slider ${
          isMenuClicked ? "translate-x-0" : " translate-x-full"
        } w-full bg-black fixed z-[7777] inset-0 h-screen transition-transform duration-500 text-white text-5xl flex flex-col gap-4 justify-center items-center`}
      >
        <button  className=" absolute top-5 right-5 lg:hidden p-2" onClick={()=>{setisMenuClicked(false)}} >
            <Menu className="h-6 w-6 " />
          </button>

        {navLinks.map((navLink, index) => (
          <div
            className="navLink border-b-2 text-4xl  border-cyan-300 py-2 rounded-sm "
            key={index}
            // onClick={() => {
            //   swiperObj.slideTo(index);
            //   toggleMenu();
            // }}
          >
          <Link to={navLink.href}> {navLink.link}</Link> 
          </div>
        ))}
        <div className=" flex flex-col  items-center space-y-4 mx-4">
            <a  className="navLink border-b-2 text-4xl  border-cyan-300 py-2  rounded-sm  " onClick={() => LoginOpen(true)}>
              Sign In
            </a>

            <a className="navLink border-b-2 text-4xl  border-cyan-300 py-2 rounded-sm " onClick={() => SignupOpen(true)}>
              Sign Up
            </a>
          </div>
      </div>
     

    </>
  )
}

export default Navbar
