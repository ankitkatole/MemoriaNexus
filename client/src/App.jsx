import React from 'react';
import Login from './Pages/Resgistration/Login';
import SignUp from './Pages/Resgistration/SignUp';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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

]);


  return <RouterProvider router={router} />;
}

export default App;
