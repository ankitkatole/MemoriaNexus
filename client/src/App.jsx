import React from 'react';
// import Login from './Pages/Resgistration/Login';
// import SignUp from './Pages/Resgistration/SignUp';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import Navbar from './Components/SharedComponents/Navbar';
import LandingPage from './Pages/LandingPage';
import Diary from './Pages/Diary/Diary';

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
