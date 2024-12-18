import React from 'react';
import Login from './Pages/Resgistration/Login';
import SignUp from './Pages/Resgistration/SignUp';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './Components/SharedComponents/Navbar';

function App() {
 

const router = createBrowserRouter([
    {
      path: '/',
      element: <Login/>,
      errorElement: '404 Page not found',
    },
    {
      path: '/SignUp',
      element: <SignUp/>,
     
    },
    {
      path: '/Navbar',
      element: <Navbar/>,
     
    },

]);


  return <RouterProvider router={router} />;
}

export default App;
