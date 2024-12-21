import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Joke from '../../assets/joke.svg'

function Feed() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://icanhazdadjoke.com/', {
        headers: { Accept: 'application/json' }
      });
      setJoke(response.data.joke);
    } catch (error) {
      setJoke('Oops! Couldn’t fetch a joke at the moment.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <>
      <main className="flex-1 flex flex-col p-4 space-y-4">
        <div className='flex flex-col justify-between items-start w-full mb-8'>
          <h3 className="text-3xl font-semibold text-start relative z-10 mb-3">Feeds</h3>
          <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-border h-[2px] w-[100px]'></span>
        </div>

        <div className="flex-1 space-y-4">
          <div className="p-4 bg-gray-800 border border-cyan-300 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-600 rounded-full overflow-hidden flex items-center justify-center text-white">
                <img src={Joke} alt="joke" className='object-cover' />
              </div>
              <div>
                <p className="text-white font-bold">Random Joke</p>
                <p className="text-gray-400 text-sm">{new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-white font-bold text-xl">Here’s a dad joke for you:</p>
              {loading ? (
                <p className="text-gray-300 mt-2">Loading joke...</p>
              ) : (
                <p className="text-yellow-300 mt-2">{joke}</p>
              )}
              {/* <p className="text-gray-500 text-sm mt-2">Comments: 0</p> */}
            </div>

            {/* Refresh Button */}
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors duration-200"
                onClick={fetchJoke}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Joke'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Feed;
