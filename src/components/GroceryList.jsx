import React from 'react'
import Button from './Button';
import Loading from './Loading';

const GroceryList = ({ groceryList, addToList, removeFromList, handleButtonClick }) => {
  if (groceryList.length === 0) {
    return <div className='mt-64 w-full h-full flex items-center justify-center'> <Button handleButtonClick={handleButtonClick} text={"Add A Product to Get Started"}/> </div>
  }

  let total = 0;

  groceryList.forEach((item) => {
    console.log(item);
    const stringPrice = item.price;
    if(stringPrice === 'Unknown'){
      return;
    }
    const newPrice = stringPrice.slice(1);
    console.log(stringPrice);
    console.log(newPrice);
    const priceNumber = Number(newPrice) * item.quantity;
    total += priceNumber;
  })

  

  return (
    <div className="p-4 mt-34 mb-10">
      <h2 className="lg:text-3xl text-2xl font-bold mb-4">🛒 Your Cart</h2>
      {groceryList.map(item => { return (
        
        <div key={item._id} className="flex items-center justify-evenly mb-4 border-b pb-2">
          <span className='max-w-40 min-w-40 md:max-w-40 lg:text-lg'>{item.name}</span>
          <img className='md:w-15 lg:w-20' width={40} height={40} src={`${import.meta.env.VITE_API_URL}${item.imagePath}`}/>
          <div className="flex items-center gap-3">
            <button onClick={() => removeFromList(item._id)} className="bg-red-500 px-2 py-1 text-white rounded">-</button>
            <span>{item.quantity}</span>
            <button onClick={() => addToList(item)} className="bg-green-500 px-2 py-1 text-white rounded">+</button>
          </div>
          <span className='text-base w-10'>{item.price === 'Unknown' ? 'N/A' : item.price}</span>
        </div>
      )})}
      <div className="lg:text-3xl text-right font-semibold mt-4 text-xl">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
};


export default GroceryList
