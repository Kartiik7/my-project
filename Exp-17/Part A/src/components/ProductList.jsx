import React from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../store/cartSlice';
import './ProductList.css';

const ProductList = () => {
  const dispatch = useDispatch();

  // Simple product data for experiment
  const products = [
    { id: 1, name: 'Laptop', price: 1200 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 45 }
  ];

  const handleBuyNow = (product) => {
    dispatch(addItemToCart(product));
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div className="product-list">
      <h2>Product List</h2>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <p>Price: ${product.price}</p>
            <button onClick={() => handleBuyNow(product)}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;