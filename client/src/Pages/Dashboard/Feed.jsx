import React from 'react'

function Feed() {
  return (
    <>
     <main className="flex-1 flex flex-col p-4 space-y-4">
        
        {/* <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">Feeds</h1>
         
        </div> */}
        <div className='flex flex-col justify-between items-start w-full mb-8'>
        <h3 className="text-3xl font-semibold  text-start relative z-10 mb-3  ">Feeds</h3>
        <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-border h-[2px]  w-[100px]'></span>
        </div>

      
        <div className="flex-1 space-y-4">
         
          <div className="p-4 bg-gray-800 border border-cyan-300 rounded-lg">
            <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-blue-600 rounded-full  flex items-center justify-center text-white">
                   G
                  </div>
              <div>
                <p className="text-white font-bold">Jitesh Valvarde</p>
                <p className="text-gray-400 text-sm">22/3/2024</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-white font-bold">Title</p>
              <p className="text-gray-300">Content of the diary feed goes here...</p>
              <p className="text-gray-500 text-sm">Comments: 3</p>
            </div>
          </div>

         
        </div>
      </main>
    </>
  )
}

export default Feed
