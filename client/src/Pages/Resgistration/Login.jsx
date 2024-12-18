import React from 'react'

function Login() {
  return (
  <>
      <div className="flex justify-center w-screen items-center h-screen ">
    <div className="relative p-10 w-[90vw] sm:w-[80vw] md:w-auto  rounded-lg  border-[#8400ff] border-2 animate-breathe">
      <h2 className="text-2xl font-semibold text-cyan-400 mb-6">LOGIN</h2>
      <form className='w-full md:min-w-96  '>
        <div className="mb-6">
          {/* <label className="block text-cyan-300 mb-2" htmlFor="email">Email</label> */}
          <input
            className="w-full p-3 text-cyan-300 border-b border-cyan-300   "
            type="email"
            id="email"
            placeholder="Enter your email"
          />
        </div>
        <div className="mb-6">
          {/* <label className="block text-cyan-300 mb-2" htmlFor="password">Password</label> */}
          <input
            className="w-full p-3 text-cyan-300 border-b border-cyan-300  "
            type="password"
            id="password"
            placeholder="Enter your password"
          />
          
        </div>
        <label className="block text-cyan-300 mb-6 text-base" htmlFor="password">new here ? <a href="/SignUp" className='hover:underline'> Sign Up</a></label>
        <button
          className="w-full py-2 px-4 text-base font-bold text-cyan-300 border border-cyan-300 rounded-md  transition duration-300"
          type="submit"
        >
          LOGIN
        </button>
      </form>
    </div>
  </div>
  </>
  )
}

export default Login
