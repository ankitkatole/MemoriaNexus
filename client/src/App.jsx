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
      path: '/UserChat',
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
