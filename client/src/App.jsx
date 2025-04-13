import React from 'react';
// import Login from './Pages/Resgistration/Login';
// import SignUp from './Pages/Resgistration/SignUp';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import Navbar from './Components/SharedComponents/Navbar';
import LandingPage from './Pages/LandingPage';
import Diary from './Pages/Diary/Diary';
import UserChat from './Pages/UserChat/UserChat';
import Dashboard from './Pages/Dashboard/Dashboard';
import Chat from './Components/Chat';
import ResetPassword from './Pages/Resgistration/ResetPassword';
import ForumPage from './Pages/Forum/ForumPage';
import TimeCapsuleForm from './Pages/TimeCapsule/TimeCapsuleForm';
import TimeCapsuleindex from './Pages/TimeCapsule/TimeCapsuleindex';
import TimeCapsuleDetail from './Pages/TimeCapsule/TimeCapsuleDetail';  
import ChatNexus from './Components/ChatNexus';
import SearchUsers from './Pages/UserChat/SearchUsers';
function App() {
 

const router = createBrowserRouter([
    {
      path: '/',
      element: <LandingPage/>,
      errorElement: '404 Page not found',
    },
    {
      path: '/Diary',
      element: <Diary/>,
     
    },
    {
      path: '/UserChat/:encodedEmail',
      element: <UserChat/>,
     
    },
   
    {
      path: '/Dashboard',
      element: <Dashboard/>,
     
    },
    {
      path: '/Chat',
      element: <Chat/>,
     
    },
    {
      path: '/ResetPassword',
      element: <ResetPassword/>,
     
    },
    {
      path: '/ForumPage',
      element: <ForumPage/>,
     
    },
    {
      path: '/TimeCapsuleForm',
      element: <TimeCapsuleForm/>,
     
    },
    {
      path: '/TimeCapsuleindex',
      element: <TimeCapsuleindex/>,
     
    },
    {
      path: '/TimeCapsuleDetail/:id',
      element: <TimeCapsuleDetail/>,
     
    },
    {
      path: '/ChatNexus',
      element: <ChatNexus/>,
     
    },
    {
      path: '/SearchUsers',
      element: <SearchUsers/>,
    }
    // {
    //   path: '/SignUp',
    //   element: <SignUp/>,
     
    // },
    // {
    //   path: '/Navbar',
    //   element: <Navbar/>,
     
    // },
    // {
    //   path: '/Login',
    //   element: <LandingPage/>,
     
    // },

]);


  return <RouterProvider router={router} />;
}

export default App;
