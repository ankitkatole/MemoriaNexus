import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import SERVER_URL from '../../constant.mjs';
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TimeCapsuleForm = ({setopenStatus}) => {
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    unlockDate: ''
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validImageTypes.includes(selectedFile.type)) {
        setFileError('Only image files (JPG, PNG, WEBP) are allowed.');
        setFileName('');
        setFile(null);
        return;
      }

      if (selectedFile.size > 1 * 1024 * 1024) {
        setFileError('File size must be less than 1MB');
        setFileName('');
        setFile(null);
      } else {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setFileError('');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const userId = Cookies.get('Userid');
    if (!userId) {
      toast.error('User not logged in', { containerId: "Timecapsule" });
      return;
    }

    const { title, description, unlockDate } = formData;
    if (!title || !description || !unlockDate || !file) {
      toast.warn('Please fill out all fields and select an image.', { containerId: "Timecapsule" });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Adding text data to formData
      formDataToSend.append('user_id', userId);
      formDataToSend.append('title', title);
      formDataToSend.append('description', description);
      formDataToSend.append('unlock_date', unlockDate);
      
      // Adding image file
      formDataToSend.append('image', file);

      const response = await axios.post(`${SERVER_URL}/user/uploadTimeCapsule`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Time capsule created successfully');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        unlockDate: ''
      });
      setFile(null);
      setFileName('');
      setLoading(false);
      console.log(response.data);
    } catch (error) {
        setLoading(false);
      console.error('Error uploading time capsule:', error);
      toast.error('Error creating time capsule');
    } 
  };


  const closeModal = () => setopenStatus(false);

  return (
    <>

      <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Slide}
            closeButton={false}
            containerId="Timecapsule"
            />
      

      {/* Button to trigger modal */}
      {/* <button
        onClick={openModal}
        className="mt-6 w-full py-2 font-semibold box text-white hover:bg-cyan-700 border-2 border-cyan-600 rounded-md"
      >
        Open Time Capsule Form
      </button> */}

      {/* Modal */}
     
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-[#131822] shadow-lg p-6 rounded-lg w-full max-w-3xl border-cyan-300 border-2 animate-breathe">
            <h2 className="text-2xl font-semibold mb-6 text-cyan-400">Upload Time Capsule</h2>

            <form onSubmit={handleSubmit}>
              <div className="flex space-x-6 mb-6">
                <div className="w-1/2 border-dashed border-2 border-cyan-300 p-6 rounded-lg">
                  <label htmlFor="CoverFile" className="block w-full h-full text-center cursor-pointer">
                    <div className="text-gray-500 text-sm flex flex-col items-center justify-center w-full h-full">
                      <span>
                        <svg width="64" height="64" viewBox="0 0 155 155" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M77.5 122.709V77.5004M77.5 77.5004L62.9688 92.5696M77.5 77.5004L92.0313 92.5696M42.625 115.174C29.7844 115.174 19.375 104.572 19.375 91.4936C19.375 80.7166 26.4429 71.6213 36.1149 68.7538C36.5259 68.6318 36.8125 68.2488 36.8125 67.8128C36.8125 48.1952 52.4266 32.292 71.6875 32.292C90.9482 32.292 106.563 48.1952 106.563 67.8128C106.563 68.1887 106.909 68.4677 107.269 68.3857C108.912 68.0105 110.621 67.8128 112.375 67.8128C125.215 67.8128 135.625 78.4149 135.625 91.4936C135.625 104.572 125.215 115.174 112.375 115.174" stroke="#464455" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <span className="block mb-2 text-cyan-400">Upload Cover Photo:</span>
                      <span className="block mb-2 text-cyan-300">
                        Upload files from device{' '}
                        <span className="text-blue-500 underline">browse</span>
                      </span>
                      <input
                        type="file"
                        id="CoverFile"
                        name="CoverFile"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {fileName && (
                        <p className="mt-2 text-cyan-300">{`Selected File: ${fileName}`}</p>
                      )}
                      {fileError && (
                        <p className="mt-2 text-red-500">{fileError}</p>
                      )}
                    </div>
                  </label>
                </div>

                <div className="w-1/2">
                  <div className="mb-4">
                    <input
                      type="text"
                      name="title"
                      className="mt-1 px-3 py-2 text-cyan-300 border-b border-cyan-300 bg-transparent w-full"
                      placeholder="Title"
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-4">
                    <input
                      type="text"
                      name="description"
                      className="mt-1 px-3 py-2 text-cyan-300 border-b border-cyan-300 bg-transparent w-full"
                      placeholder="Description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="unlockDate" className="text-cyan-300 ml-2">Unlock date:</label>
                    <input
                      type="date"
                      name="unlockDate"
                      className="mt-1 px-3 py-2 text-cyan-300 border-b border-cyan-300 bg-transparent w-full"
                      value={formData.unlockDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-6 w-full py-2 font-semibold bg-gray-700 text-white hover:bg-gray-800 border-2 border-gray-700 rounded-md"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="mt-6 w-full py-2 font-semibold box text-white hover:bg-cyan-700 border-2 border-cyan-600 rounded-md"
                >
                  {loading ? 'Creating...' : 'Create Time Capsule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      
    </>
  );
};

export default TimeCapsuleForm;
