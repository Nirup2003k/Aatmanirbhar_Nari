import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';

const CartDrawer = () => {
  const { cart, cartCount, cartTotal, isCartOpen, closeCartDrawer, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={closeCartDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-brand-surface border-l border-brand-border shadow-xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-brand-border flex items-center justify-between bg-brand-background/50">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-brand-primary" />
              <h2 className="text-lg font-bold text-brand-secondary">Your Cart</h2>
              {cartCount > 0 && (
                <span className="text-xs font-bold bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full border border-brand-primary/20">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1.5 rounded-lg text-brand-muted hover:text-brand-secondary hover:bg-brand-background transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {!cart || !cart.items || cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-brand-background border border-brand-border flex items-center justify-center text-brand-muted mb-4">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-brand-secondary mb-1">Your cart is empty</h3>
                <p className="text-xs text-brand-muted mb-6 max-w-xs">
                  Explore verified home-based women entrepreneurs and add services to your cart.
                </p>
                <Link to="/businesses" onClick={closeCartDrawer}>
                  <Button variant="primary" size="sm">
                    Browse Businesses
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Business Info Header */}
                <div className="bg-brand-background border border-brand-border rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-brand-muted tracking-wider block">Ordering From</span>
                    <h4 className="text-sm font-bold text-brand-secondary">{cart.businessName}</h4>
                  </div>
                  <Link
                    to={`/businesses/${cart.businessId}`}
                    onClick={closeCartDrawer}
                    className="text-xs font-semibold text-brand-primary hover:underline"
                  >
                    View Profile
                  </Link>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {cart.items.map((item) => {
                    const subtotal = item.unitPrice * item.quantity;
                    return (
                      <div
                        key={item.serviceId}
                        className="bg-brand-surface border border-brand-border rounded-xl p-3.5 flex flex-col justify-between space-y-3 hover:border-brand-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-brand-secondary">{item.name}</h4>
                            <p className="text-xs text-brand-muted">{item.priceStr}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.serviceId)}
                            className="text-brand-muted hover:text-red-600 p-1 rounded transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-brand-border/40">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2 bg-brand-background border border-brand-border rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                              className="p-1 rounded text-brand-secondary hover:bg-brand-surface transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold w-6 text-center text-brand-secondary">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                              className="p-1 rounded text-brand-secondary hover:bg-brand-surface transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Subtotal */}
                          <div className="text-right">
                            <span className="text-xs text-brand-muted block">Subtotal</span>
                            <span className="text-sm font-bold text-brand-secondary">
                              ₹{subtotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {cart && cart.items && cart.items.length > 0 && (
            <div className="p-5 border-t border-brand-border bg-brand-background/50 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-brand-text">Estimated Total</span>
                <span className="text-lg font-extrabold text-brand-primary">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-brand-muted leading-tight">
                Final total and service availability will be confirmed by backend during checkout.
              </p>
              <Button
                variant="primary"
                className="w-full justify-center py-2.5"
                onClick={handleCheckoutClick}
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
