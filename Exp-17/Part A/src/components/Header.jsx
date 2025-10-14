import React from 'react';
import { useSelector } from 'react-redux';

const Header = () => {
  const { totalQuantity, totalAmount } = useSelector(state => state.cart);

  return (
    <header style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ccc' }}>
      <h1>My Shop</h1>
      <p>Cart: {totalQuantity} items - ${totalAmount}</p>
    </header>
  );
};

export default Header;