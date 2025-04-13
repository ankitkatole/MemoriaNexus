import React from 'react'

function currentUserDatanav({ProfileImage,Name,userName}) {
  return (
    <>
      <header className="sticky top-0 w-full z-10 backdrop-blur-md bg-black/50 border-b border-gray-800 mb-3">
                <div className="container md:ml-4 ml-2 py-4 flex items-start">

                  <div className="flex gap-3  border-b border-cyan-300">
                <img src={ProfileImage} alt="UserName" />
               <h4 className='text-lg font-bold text-white'>{UserName}</h4>
               <p className='text-gray-500'>{userName}</p>
                 </div>


                </div>
              </header>
    </>
  )
}

export default currentUserDatanav
