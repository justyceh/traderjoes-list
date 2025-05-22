const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchProducts = async (category = '') => {
  try {
    const url = category
      ? `${BASE_URL}/api/products?category=${encodeURIComponent(category)}`
      : `${BASE_URL}/api/products`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (err) {
    console.error('fetchProducts error:', err);
    return [];
  }
};

export const searchProducts = async (query, category = '') => {
  try {
    let url = `${BASE_URL}/api/products/search?query=${encodeURIComponent(query)}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  } catch (err) {
    console.error('searchProducts error:', err);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/products/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
  } catch (err) {
    console.error('fetchCategories error:', err);
    return [];
  }
};
