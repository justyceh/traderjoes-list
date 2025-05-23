import React, { useEffect, useState } from 'react';
import GlowCard from '../components/GlowCard';
import { fetchProducts } from '../api/api';
import { categoryEmojis } from '../constants';
import Loading from '../components/Loading';



const CategoriesSection = ({handleCategoryClick}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const loadCategories = async () => {
      const cached = localStorage.getItem('products-all');
      let products;

      if(cached){
        products = JSON.parse(cached);
      } else {
        products = await fetchProducts(); // get all products
        localStorage.setItem('products-all', JSON.stringify(products));
      }

      const uniqueCategories = [
        ...new Set(products.map((p) => p.category).filter(Boolean))
      ];

      setCategories(uniqueCategories);
      setLoading(false);
    };

    loadCategories();

  }, []);

    if (loading) return <Loading/>;

  return (
    <div>

    <div className="lg:columns-3 md:columns-2 columns-1 gap-4 space-y-4 px-4 mt-32">
      {categories.map((category) => {
        const emoji = categoryEmojis[category] || categoryEmojis.default;
        return (
            <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className="w-full text-left"
          >
        <GlowCard classname={'cursor-pointer'} key={category}>
          <div className="text-lg font-semibold text-center py-6">
            <span className="text-2xl mr-2">{emoji}</span>
            {category}
          </div>
        </GlowCard>
        </button>
        )
})}
    </div>
    </div>
  );
};

export default CategoriesSection;
