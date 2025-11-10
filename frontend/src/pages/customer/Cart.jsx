import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Cart.css';

const Cart = () => {
  // Using state to simulate cart (in real app, this would come from backend/context)
  const [cartItems, setCartItems] = useState([
    // Sample cart item structure - empty for now
    // You can connect this to backend later
  ]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handleRemove = (id) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-hero">
        <div className="container">
          <h1>Your Property Cart</h1>
          <p>Review your selected properties</p>
        </div>
      </div>

      <div className="cart-container">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Start adding properties you're interested in!</p>
              <Link to="/properties" className="btn-shop">
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              {/* Cart Items */}
              <div className="cart-items">
                <h2>Cart Items ({cartItems.length})</h2>
                
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item-card">
                    <img src={item.image} alt={item.title} />
                    <div className="item-info">
                      <h3>{item.title}</h3>
                      <p className="location">📍 {item.location}</p>
                      <p className="price">{formatPrice(item.price)}</p>
                    </div>
                    <button 
                      className="btn-remove"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <h3>Summary</h3>
                <div className="summary-details">
                  <div className="summary-item">
                    <span>Subtotal:</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  <div className="summary-item">
                    <span>Processing Fee:</span>
                    <span>$0</span>
                  </div>
                  <div className="summary-total">
                    <span>Total:</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
                <button className="btn-checkout">
                  Proceed to Inquiry
                </button>
                <p className="disclaimer">
                  *Properties in cart are saved for inquiry purposes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;