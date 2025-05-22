import React from 'react'

const NavBar = ({handleCartClick, handleAisleClick}) => {
  return (
    <nav className='text-xl fixed w-full z-40 p-5 flex flex-row items-center justify-evenly top-0 bg-white'>
        <button onClick={handleCartClick} className='bg-rose-400 rounded-xl py-2 px-3 cursor-pointer'>Your Cart</button>
        <button onClick={handleAisleClick} className='bg-rose-400 rounded-xl py-2 px-3 cursor-pointer'>The Aisle</button>
    </nav>
  )
}

export default NavBar
