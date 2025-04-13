import React from 'react'

function CurrentUserDatanav({data, Status,urlName}) {
  return (
    <>
    {data.name && data.email && (
                <div className="bg-gray-900 p-3 flex items-center border-b border-gray-800">
                 {/* { data.image ?
                    (<img 
                      src={data.image} 
                      className="h-10 w-10 rounded-full object-cover mr-3" 
                      alt={data.name}
                    />)
                  :( */}
                    <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white mr-3">
                      {data.name ? data.name[0] : '?'}
                    </div>
                    {/* )
                  } */}
                  <div>
                    <div className="text-white font-medium">{data.name || urlName}</div>
                    <div className="text-sm flex items-center">
                      <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                        Status.has(data.email) ? 'bg-green-500' : 'bg-gray-500'
                      }`}></span>
                      <span className="text-gray-300">
                        {Status.has(data.email) ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
    </>
  )
}

export default CurrentUserDatanav
