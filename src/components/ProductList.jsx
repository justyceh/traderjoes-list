import { useEffect, useState } from 'react';
import { fetchProducts, searchProducts } from '../api/api';
import GlowCard from './GlowCard';
import Loading from './Loading';

const ProductList = ({category, searchQuery, addToList, groceryList, removeFromList}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = searchQuery ? await searchProducts(searchQuery) : await fetchProducts(category); // Change category if needed
      console.log(data);
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, [category, searchQuery]);

  if (loading) return <Loading/>
  if (!loading && products.length === 0) return <div className='grid grid-cols-1 md:grid-cols-1 gap-4 p-4 mt-32 text-4xl'>
    <GlowCard>No Product Found 😔</GlowCard>
    </div> 

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 mt-32">
      {products.map((product) => {
          const itemInList = groceryList.find(p => p._id === product._id);
          return(
            <GlowCard key={product._id}>
          <img
            src={`http://localhost:5199${product.imagePath}`}
            alt={product.name}
            className="w-full h-40 object-cover mb-2"
          />
          <h3 className="font-semibold">{product.name}</h3>
          <p>{product.price}</p>
          <p className="text-sm text-gray-500">{product.category}</p>
          {itemInList ? (
        <div className="flex gap-2 items-center mt-2">
          <button onClick={() => removeFromList(product._id)} className="bg-red-500 px-2 py-1 rounded text-white">-</button>
          <span>{itemInList.quantity}</span>
          <button onClick={() => addToList(product)} className="bg-green-500 px-2 py-1 rounded text-white">+</button>
        </div>
      ) : (
        <button
          onClick={() => addToList(product)}
          className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
        >
          Add to List
        </button>
      )}
            </GlowCard>
            )
      })}
    </div>
  );
};

export default ProductList;
