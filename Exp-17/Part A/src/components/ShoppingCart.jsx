import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeItemFromCart, updateItemQuantity } from '../store/cartSlice';
import './ShoppingCart.css';

const ShoppingCart = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector(state => state.cart);

  const handleRemoveItem = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity >= 0) {
      dispatch(updateItemQuantity({ id, quantity: parseInt(quantity) }));
    }
  };

  return (
    <div className="shopping-cart">
      <h2>Shopping Cart</h2>
      <p>Total Items: {totalQuantity}</p>
      <p>Total Amount: ${totalAmount}</p>
      
      {items.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        items.map(item => (
          <div key={item.id} className="cart-item">
            <span>{item.name} (${item.price})</span>
            <input 
              type="number" 
              value={item.quantity} 
              onChange={(e) => handleUpdateQuantity(item.id, e.target.value)}
              min="1"
            />
            <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
          </div>
        ))
      )}
    </div>
  );
};

export default ShoppingCart;