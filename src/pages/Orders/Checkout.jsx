import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, User, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/api';
import Button from '../../components/common/Button';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="bg-brand-background min-h-screen py-16 flex flex-col items-center justify-center px-4">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-brand-background border border-brand-border flex items-center justify-center text-brand-muted mx-auto mb-4">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-secondary mb-2">Your cart is empty</h2>
          <p className="text-sm text-brand-muted mb-6">
            There are no items in your cart to checkout.
          </p>
          <Link to="/businesses">
            <Button variant="primary" className="inline-flex items-center">
              Browse Businesses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.trim()) {
      setError('Please provide a complete delivery address.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        businessId: cart.businessId,
        deliveryAddress: deliveryAddress.trim(),
        items: cart.items.map((item) => ({
          serviceId: item.serviceId,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(orderPayload);
      const createdOrder = response.data;

      // Clear local cart
      clearCart();

      // Redirect to newly created order details page
      navigate(`/orders/${createdOrder.id}`, {
        state: { successMessage: 'Order placed successfully!' },
      });
    } catch (err) {
      console.error('Failed to create order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-background min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation / Header */}
        <div className="mb-6">
          <Link to="/businesses" className="inline-flex items-center text-xs font-bold text-brand-primary hover:underline mb-3">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Continue Browsing
          </Link>
          <h1 className="text-2xl font-extrabold text-brand-secondary tracking-tight">Checkout</h1>
          <p className="text-xs text-brand-muted mt-1">Review your order details and delivery information.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Profile Info (Read-only from authenticated session) */}
            <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-brand-secondary flex items-center mb-4 pb-3 border-b border-brand-border">
                <User className="w-4 h-4 text-brand-primary mr-2" />
                Customer Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-brand-muted block font-medium">Full Name</span>
                  <span className="font-bold text-brand-secondary">{user?.name || 'Customer'}</span>
                </div>
                <div>
                  <span className="text-xs text-brand-muted block font-medium">Phone Number</span>
                  <span className="font-bold text-brand-secondary">{user?.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-xs text-brand-muted block font-medium">Email Address</span>
                  <span className="font-bold text-brand-secondary">{user?.email}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address Field */}
            <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-brand-secondary flex items-center mb-4 pb-3 border-b border-brand-border">
                <MapPin className="w-4 h-4 text-brand-primary mr-2" />
                Delivery Address <span className="text-red-500 ml-1">*</span>
              </h2>
              <div>
                <label htmlFor="deliveryAddress" className="block text-xs font-semibold text-brand-text mb-2">
                  Enter complete delivery address or instructions
                </label>
                <textarea
                  id="deliveryAddress"
                  rows={4}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. House No. 42, 2nd Main Road, Vidya Nagar, Hubli - 580021"
                  required
                  disabled={isSubmitting}
                  className="w-full text-sm border border-brand-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary bg-brand-background transition-all"
                />
                <p className="text-[11px] text-brand-muted mt-1.5">
                  The entrepreneur will deliver directly to this address or organize pickup as requested.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Action */}
          <div className="lg:col-span-1">
            <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm sticky top-24 space-y-6">
              <h2 className="text-base font-bold text-brand-secondary pb-3 border-b border-brand-border">
                Order Summary
              </h2>

              <div className="text-xs">
                <span className="text-brand-muted block font-medium">Business</span>
                <span className="font-bold text-brand-secondary text-sm">{cart.businessName}</span>
              </div>

              {/* Items Table */}
              <div className="space-y-3 pt-2">
                {cart.items.map((item) => (
                  <div key={item.serviceId} className="flex justify-between items-start text-xs border-b border-brand-border/40 pb-2.5">
                    <div>
                      <span className="font-bold text-brand-secondary block">{item.name}</span>
                      <span className="text-brand-muted">Qty: {item.quantity} × {item.priceStr}</span>
                    </div>
                    <span className="font-bold text-brand-secondary">
                      ₹{(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Calculation */}
              <div className="pt-3 border-t border-brand-border flex items-center justify-between">
                <span className="text-sm font-bold text-brand-secondary">Estimated Total</span>
                <span className="text-xl font-extrabold text-brand-primary">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center py-3 text-sm font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
