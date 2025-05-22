import React from 'react'

const Button = ({text, handleButtonClick}) => {
  return (
    <button onClick={handleButtonClick} className='flex items-center  bg-rose-400 rounded-xl py-2 px-3 cursor-pointer animate-bounce'>
        {text}
    </button>
  )
}

export default Button
