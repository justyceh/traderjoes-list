import { useEffect, useState } from 'react';
import { fetchProducts, searchProducts } from '../api/api';
import GlowCard from './GlowCard';
import Loading from './Loading';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ProductList = ({category, searchQuery, addToList, groceryList, removeFromList}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const loadProducts = async () => {
    setLoading(true);

    const cached = localStorage.getItem('products-all');
    if (!cached) {
      console.log("Loaded from database");
      const data = await fetchProducts();
      localStorage.setItem('products-all', JSON.stringify(data));
    } else {
      console.log("Loaded from local storage");
    }

    const allProducts = JSON.parse(localStorage.getItem('products-all'));

    let filteredProducts = category ? allProducts.filter(p => p.category === category) : allProducts;


    if (searchQuery) {
      filteredProducts = allProducts
      filteredProducts = filteredProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
      setProducts(filteredProducts);
      setLoading(false);
    };

    loadProducts();
  }, [category, searchQuery]);


  useGSAP(() => {
    gsap.utils.toArray('.product-card').forEach((product, index) => {
      gsap.fromTo(
        product,
         {
          y: 50,
          opacity: 0
         },
          {
            y: 0,
            opacity: 1,
            duration: .5,
            delay: 0 * (index + 1),
            scrollTrigger: {
              trigger: product,
              start: 'top 90%'
            }
          }
        )
    })
  }, [products])

  if (loading) return <Loading/>
  if (!loading && products.length === 0) return <div className='grid grid-cols-1 md:grid-cols-1 gap-4 p-4 mt-32 text-4xl'>
    <GlowCard>No Product Found 😔</GlowCard>
    </div> 

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 mt-32">
      {products.map((product) => {
          const itemInList = groceryList.find(p => p._id === product._id);
          return(
            <GlowCard classname='product-card' key={product._id}>
          <img
            src={`${import.meta.env.VITE_API_URL}${product.imagePath}`}
            alt={"Image Unavailable"}
            className="w-full h-40 object-cover mb-2"
            loading='lazy'
          />
          <h3 className="font-semibold">{product.name}</h3>
          <p>{product.price}</p>
          <p className="text-sm text-gray-500">{product.category}</p>
          {itemInList ? (
        <div className="flex gap-2 items-center mt-2">
          <button onClick={() => removeFromList(product._id)} className="bg-red-500 px-2 py-1 rounded text-white cursor-pointer">-</button>
          <span>{itemInList.quantity}</span>
          <button onClick={() => addToList(product)} className="bg-green-500 px-2 py-1 rounded text-white cursor-pointer">+</button>
        </div>
      ) : (
        <button
          onClick={() => addToList(product)}
          className="mt-2 bg-green-600 text-white px-3 py-1 rounded cursor-pointer"
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
