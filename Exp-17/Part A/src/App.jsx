import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import ProductList from './components/ProductList';

function App() {
  return (
    <Provider store={store}>
      <div style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 0 }}>
        <ProductList />
      </div>
    </Provider>
  );
}

export default App;