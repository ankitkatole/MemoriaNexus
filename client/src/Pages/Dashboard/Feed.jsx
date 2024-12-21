import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Joke from '../../assets/Joke.svg';

function Feed() {
  const [joke, setJoke] = useState('');
  const [uselessFact, setUselessFact] = useState('');
  const [randomTrivia, setRandomTrivia] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFacts, setLoadingFacts] = useState(true);
  const [loadingTrivia, setLoadingTrivia] = useState(true);

  // Fetch Joke
  const fetchJoke = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://icanhazdadjoke.com/slack', {
        headers: { Accept: 'application/json' }
      });
      const text = response.data.attachments[0].fallback;
      setJoke(text);
    } catch (error) {
      setJoke('Oops! Couldn’t fetch a joke at the moment.');
    }
    setLoading(false);
  };

  // Fetch Useless Fact
  const fetchUselessFact = async () => {
    setLoadingFacts(true);
    try {
      const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      setUselessFact(response.data.text);
    } catch (error) {
      setUselessFact('Oops! Couldn’t fetch a useless fact at the moment.');
    }
    setLoadingFacts(false);
  };

  // Fetch Random Trivia
  const fetchRandomTrivia = async () => {
    setLoadingTrivia(true);
    try {
      const response = await axios.get('http://numbersapi.com/random/trivia');
      setRandomTrivia(response.data);
    } catch (error) {
      setRandomTrivia('Oops! Couldn’t fetch a random trivia at the moment.');
    }
    setLoadingTrivia(false);
  };

  useEffect(() => {
    fetchJoke();
    fetchUselessFact();
    fetchRandomTrivia();
  }, []);

  return (
    <>
      <main className="flex flex-col overflow-auto flex-1 p-4 space-y-4">
        <div className='flex flex-col items-start justify-between w-full mb-8'>
          <h3 className="relative z-10 mb-3 text-3xl font-semibold text-start">Feeds</h3>
          <span className='bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-border h-[2px] w-[100px]'></span>
        </div>

        <div className="p-4 transition-shadow duration-300 ease-in-out  bg-gray-800 border rounded-lg shadow-lg border-cyan-300 hover:shadow-2xl">
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
            </div>

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
        <div className="grid gap-4 md:grid-cols-2">
          {/* Joke Card */}
        

          {/* Useless Fact Card */}
          <div className="p-4 transition-shadow duration-300 ease-in-out bg-gray-800 border rounded-lg shadow-lg border-cyan-300 hover:shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 overflow-hidden text-white bg-blue-600 rounded-full">
                <img src={Joke} alt="fact" className='object-cover' />
              </div>
              <div>
                <p className="font-bold text-white">Random Fact</p>
                <p className="text-sm text-gray-400">{new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xl font-bold text-white">Here’s a useless fact for you:</p>
              {loadingFacts ? (
                <p className="mt-2 text-gray-300">Loading fact...</p>
              ) : (
                <p className="mt-2 text-yellow-300">{uselessFact}</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 text-white transition-colors duration-200 rounded-lg bg-cyan-500 hover:bg-cyan-600"
                onClick={fetchUselessFact}
                disabled={loadingFacts}
              >
                {loadingFacts ? 'Refreshing...' : 'Refresh Fact'}
              </button>
            </div>
          </div>

          {/* Random Trivia Card */}
          <div className="p-4 transition-shadow duration-300 ease-in-out bg-gray-800 border rounded-lg shadow-lg border-cyan-300 hover:shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 overflow-hidden text-white bg-blue-600 rounded-full">
                <img src={Joke} alt="trivia" className='object-cover' />
              </div>
              <div>
                <p className="font-bold text-white">Trivia</p>
                <p className="text-sm text-gray-400">{new Date().toLocaleDateString('en-GB')}</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xl font-bold text-white">Here’s a random trivia for you:</p>
              {loadingTrivia ? (
                <p className="mt-2 text-gray-300">Loading trivia...</p>
              ) : (
                <p className="mt-2 text-yellow-300">{randomTrivia}</p>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 text-white transition-colors duration-200 rounded-lg bg-cyan-500 hover:bg-cyan-600"
                onClick={fetchRandomTrivia}
                disabled={loadingTrivia}
              >
                {loadingTrivia ? 'Refreshing...' : 'Refresh Trivia'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Feed;
