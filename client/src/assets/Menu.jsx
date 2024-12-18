import React from 'react'

function Menu({color ,size }) {
  return (
  <>
  <svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g strokeWidth="0"></g>
  <g strokeLinecap="round" strokeLinejoin="round"></g>
  <g>
    <path
      d="M4 6H20M4 12H20M4 18H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </g>
</svg>

  </>
  )
}

export default Menu
