# Redux Toolkit Shopping Cart - Simple Experiment

## Objective
Simple demonstration of Redux Toolkit for state management in React.

## What's Implemented

### Redux Toolkit Setup
- **Store**: Basic store configuration
- **Slice**: Cart slice with actions and reducers
- **Actions**: Add, remove, update quantity

### Components
- **ProductList**: Shows 3 products with "Add to Cart" buttons
- **ShoppingCart**: Displays cart items with quantity inputs
- **Header**: Shows total items and amount

### Key Features
- Add products to cart
- Update quantities
- Remove items
- Real-time state updates

## Files Structure
```
src/
├── store/
│   ├── store.js      # Redux store
│   └── cartSlice.js  # Cart slice
├── components/
│   ├── ProductList.jsx
│   ├── ShoppingCart.jsx
│   └── Header.jsx
└── App.jsx           # Main app
```

## How to Run
```bash
npm install
npm run dev
```

## Redux Toolkit Concepts Demonstrated
- **createSlice**: Modern Redux syntax
- **configureStore**: Store setup
- **useSelector**: Reading state
- **useDispatch**: Dispatching actions

Simple experiment to understand Redux Toolkit basics!