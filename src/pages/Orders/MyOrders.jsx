import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Store, ChevronRight, AlertCircle } from 'lucide-react';
import { getCustomerOrders } from '../../services/api';
import Button from '../../components/common/Button';

export const renderStatusBadge = (status) => {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full">
          Pending Acceptance
        </span>
      );
    case 'ACCEPTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-blue-800 bg-blue-100 border border-blue-300 px-2.5 py-1 rounded-full">
          Order Accepted
        </span>
      );
    case 'PREPARING':
      return (
        <span className="inline-flex items-center text-xs font-bold text-purple-800 bg-purple-100 border border-purple-300 px-2.5 py-1 rounded-full">
          Preparing Order
        </span>
      );
    case 'READY':
      return (
        <span className="inline-flex items-center text-xs font-bold text-teal-800 bg-teal-100 border border-teal-300 px-2.5 py-1 rounded-full">
          Ready for Delivery / Pickup
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
          Completed
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-red-800 bg-red-100 border border-red-300 px-2.5 py-1 rounded-full">
          Declined by Entrepreneur
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="inline-flex items-center text-xs font-bold text-gray-700 bg-gray-100 border border-gray-300 px-2.5 py-1 rounded-full">
          Cancelled
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-xs font-bold text-gray-700 bg-gray-100 border border-gray-300 px-2.5 py-1 rounded-full">
          {status}
        </span>
      );
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCustomerOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching customer orders:', err);
      setError(err.message || 'Failed to load your orders.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-brand-background min-h-screen py-16 flex flex-col items-center justify-center">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-brand-secondary mb-1">Loading your orders...</h3>
          <p className="text-sm text-brand-muted">Fetching latest order updates from database.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-brand-background min-h-screen py-16 flex flex-col items-center justify-center px-4">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-brand-secondary mb-2">Unable to load orders</h2>
          <p className="text-sm text-brand-muted mb-6">{error}</p>
          <Button variant="primary" onClick={fetchOrders}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-background min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-brand-secondary tracking-tight">My Orders</h1>
            <p className="text-xs text-brand-muted mt-1">Track and manage your orders placed with home-based women entrepreneurs.</p>
          </div>
          <Link to="/businesses">
            <Button variant="outline" size="sm" className="inline-flex items-center text-xs">
              <Store className="w-3.5 h-3.5 mr-1.5 text-brand-primary" />
              Browse More Businesses
            </Button>
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-brand-surface border border-brand-border rounded-xl p-12 text-center shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-brand-background border border-brand-border flex items-center justify-center text-brand-muted mx-auto mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-brand-secondary mb-2">No orders placed yet</h3>
            <p className="text-sm text-brand-muted mb-6">
              When you place an order with a local entrepreneur, it will appear here.
            </p>
            <Link to="/businesses">
              <Button variant="primary" className="inline-flex items-center">
                Explore Verified Businesses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const totalItemsCount = order.items
                ? order.items.reduce((sum, item) => sum + item.quantity, 0)
                : 0;

              return (
                <div
                  key={order.id}
                  className="bg-brand-surface border border-brand-border rounded-xl p-5 shadow-sm hover:border-brand-primary/40 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border/60">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-extrabold text-brand-secondary">Order #{order.id}</span>
                        {renderStatusBadge(order.status)}
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-brand-muted">
                        <span className="flex items-center">
                          <Store className="w-3.5 h-3.5 mr-1 text-brand-primary" />
                          {order.business?.businessName || 'Business'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-brand-muted" />
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-brand-muted block">Total Amount</span>
                      <span className="text-lg font-extrabold text-brand-primary">
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Items summary and CTA */}
                  <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs text-brand-text">
                      <span className="font-semibold text-brand-secondary">Items ({totalItemsCount}): </span>
                      {order.items?.map((item) => `${item.service?.name || 'Service'} × ${item.quantity}`).join(', ')}
                    </div>

                    <Link to={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto justify-center text-xs">
                        <span>View Order Details</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
