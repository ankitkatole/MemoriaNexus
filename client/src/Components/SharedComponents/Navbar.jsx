import React from 'react'
import Logo from '../../assets/LogoTransparent.svg'

function Navbar() {
  return (
    <>
    <div className='flex justify-between border w-screen top-0 relative border-white '>
        <img src={Logo} alt="" className='w-8 h-8' />
{/* <button className='bg-gradient-to-b from-[#18203E] to-[#13203a] sm:py-2 p-1.5 text-[#11111] px-6 rounded-full font-semibold font-sans sm:min-w-28 relative ctaBtn' style={{boxShadow: "inset 0 0 12px 0 rgba(191,151,255,0.24)", border:"2px solid rgba(224, 224, 224, 0.18)"}}>login</button> */}
<div className="box">
        content inside
      </div>
    </div>
    </>
  )
}

export default Navbar
