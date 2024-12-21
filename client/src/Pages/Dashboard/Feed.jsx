import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Joke from '../../assets/Joke.svg'

function Feed() {
  const [joke, setJoke] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchJoke = async () => {
    setLoading(true);
    try {
      console.log("i am here")
      const response = await axios.get('https://icanhazdadjoke.com/slack', {
        headers: { Accept: 'application/json' }
      });
      console.log(response.data.attachments[0].fallback);
      const fallback = response.data.attachments[0].fallback;
      const text = response.data.attachments[0].fallback;
      const joke = `${text}`;
      setJoke(joke);
    } catch (error) {
      console.log(error)
      setJoke('Oops! Couldn’t fetch a joke at the moment.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <>
      <main className="flex flex-col flex-1 p-4 space-y-4">
        <div className='flex flex-col items-start justify-between w-full mb-8'>
          <h3 className="relative z-10 mb-3 text-3xl font-semibold text-start">Feeds</h3>
          <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-border h-[2px] w-[100px]'></span>
        </div>

        <div className="flex-1 space-y-4">
          <div className="p-4 transition-shadow duration-300 ease-in-out bg-gray-800 border rounded-lg shadow-lg border-cyan-300 hover:shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 overflow-hidden text-white bg-blue-600 rounded-full">
                <img src={Joke} alt="joke" className='object-cover' />
              </div>
              <div>
                <p className="font-bold text-white">Beluga</p>
                <p className="text-sm text-gray-400">{new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xl font-bold text-white">Here’s a dad joke for you:</p>
              {loading ? (
                <p className="mt-2 text-gray-300">Loading joke...</p>
              ) : (
                <p className="mt-2 text-yellow-300">{joke}</p>
              )}
              {/* <p className="mt-2 text-sm text-gray-500">Comments: 0</p> */}
            </div>

            {/* Refresh Button */}
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 text-white transition-colors duration-200 rounded-lg bg-cyan-500 hover:bg-cyan-600"
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
