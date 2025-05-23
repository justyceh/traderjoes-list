import React, { useEffect, useState } from 'react'
import NavBar from './components/NavBar'
import GroceryList from './components/GroceryList';
import ProductList from './components/ProductList';
import CategoriesSection from './sections/CategoriesSection';
import SearchBar from './components/SearchBar';


const App = () => {
  const [view, setView] = useState('categories');
  const [category, setCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [groceryList, setGroceryList] = useState(() => {
    const saved = localStorage.getItem('groceryList');
    return saved ? JSON.parse(saved) : [];
  })

  const addToList = (product) => {
    setGroceryList(prev => {
      const existing = prev.find(p => p._id === product._id);
      if(existing){
        return prev.map(p => p._id === product._id ? {...p, quantity: p.quantity + 1} : p);
      }
      return [...prev, {...product, quantity: 1}];
    });
  };

  const removeFromList = (productId) => {
  setGroceryList(prev =>
    prev
      .map(p => (p._id === productId ? { ...p, quantity: p.quantity - 1 } : p))
      .filter(p => p.quantity > 0)
  );
};


  const handleCategorySelect = (category) => {
    setCategory(category);
    setSearchQuery('');
    setView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleAisleClick = () => {
    setView('categories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchQuery('');
    setCategory(null);
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    setView('browse');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log("Search query is", query);
  }

  const handleCartClick = () => {
    setView('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchQuery('');
    setCategory(null);
  }



  useEffect(() => {
    localStorage.setItem('groceryList', JSON.stringify(groceryList));
  }, [groceryList])

  return (
    <>
    <NavBar handleAisleClick={handleAisleClick} handleCartClick={handleCartClick}/>
    <SearchBar value={searchQuery} onSearch={handleSearch}/>
    {view === 'list' && <GroceryList handleButtonClick={() => {handleSearch()}} removeFromList={removeFromList} addToList={addToList} groceryList={groceryList}/>}
    {view === 'browse' && <ProductList removeFromList={removeFromList} groceryList={groceryList} addToList={addToList} searchQuery={searchQuery} category={category}/>}
    {view === 'categories' && <CategoriesSection handleCategoryClick={handleCategorySelect}/>}
    </>
  )
}

export default App

