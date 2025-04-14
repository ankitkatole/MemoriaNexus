import React from 'react'
import Logo from '../../assets/LogoTransparent.svg'

function Footer() {
  return (
    <>
         <footer className="border-t border-gray-500 bg-[#131822] box2 !rounded-none mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
             <div className="flex gap-2 my-3 items-center justify-center">
                      <img src={Logo} alt="" className="w-9 h-9" />
                      <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text">
                        MemoriaNexus
                      </h1>
                    </div>
              <p className="text-gray-400">Preserving memories, connecting lives</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className=" hover:underline underline-offset-4  ">Features</a></li>
                <li><a href="#about" className=" hover:underline underline-offset-4  ">About</a></li>
                <li><a href="#how-it-works" className=" hover:underline underline-offset-4  ">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Contact</h5>
              <p className="text-gray-400">memorianexusofficial@gmail.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AceGrid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
