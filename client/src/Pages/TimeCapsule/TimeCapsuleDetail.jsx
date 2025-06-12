"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"

import SERVER_URL from "../../constant.mjs"

export default function TimeCapsuleDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [timeCapsule, setTimeCapsule] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const userId = Cookies.get("Userid")

  const goBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    const fetchTimeCapsuleDetail = async () => {
      try {
        const response = await axios.post(`${SERVER_URL}/user/unlockTimeCapsule`, {
          userId: userId,
          timeCapsuleId: id,
        })

        if (response.data.timeCapsule) {
          setTimeCapsule(response.data.timeCapsule)
        } else {
          setError(response.data.message || "Error fetching time capsule details")
        }
      } catch (error) {
        if (error.response) {
          setError(error.response.data.message || "Error fetching time capsule details.")
        } else {
          setError("Error fetching time capsule details.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTimeCapsuleDetail()
  }, [id, userId])

  if (loading) {
    return (
       <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-cyan-300">Loading your time capsule...</p>
          </div>
        </div>
         
    )
  }

  if (error) {
    return (
      <div className="flex flex-col w-screen items-center justify-center min-h-screen bg-black p-6">
        <div className="w-full  border-red-500/20 bg-black/50 backdrop-blur-sm">
          <div>
            <div className="text-red-400">Unable to unlock time capsule</div>
            <div className="text-gray-400">
              We encountered a problem while retrieving your time capsule
            </div>
          </div>
          <div>
            <p className="text-white">{error}</p>
          </div>
          <div>
            <button onClick={goBack} className="w-full box">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gradient-to-b from-black to-gray-900">
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/50 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <button
           
            size="icon"
            onClick={goBack}
            className="mr-4 text-gray-400 box hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-medium text-white">Time Capsule</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 ">
        {timeCapsule ? (
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{timeCapsule.title}</h2>
              <div className="flex items-center text-gray-400 text-sm">
              <div className="flex items-center text-gray-400 mr-2 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Created   {new Date(timeCapsule.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}</span>
                </div>
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  Unlocked on{" "}
                  {new Date(timeCapsule.unlock_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              
            </div>

            {timeCapsule.image && (
              <div className="relative rounded-lg overflow-hidden shadow-xl border border-gray-800">
                <img
                  src={`data:image/jpeg;base64,${timeCapsule.image}`}
                  alt={timeCapsule.title}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              </div>
            )}

            <div className="backdrop-blur-sm">
              <div className="pt-6">
                <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap">{timeCapsule.description}</p>
              </div>
              <div className="border-t border-gray-800 mt-6 flex justify-between items-center">
               
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white">Time capsule not found</h3>
              <p className="text-gray-400 max-w-md">
                This time capsule may have been deleted or is not available for viewing.
              </p>
              <div onClick={goBack}  className="box mt-4">
                Go Back
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
