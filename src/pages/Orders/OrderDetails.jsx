import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Store, MapPin, CheckCircle2, AlertCircle, XCircle, Ban, Loader2 } from 'lucide-react';
import { getCustomerOrderById, cancelOrder } from '../../services/api';
import { renderStatusBadge } from './MyOrders';
import Button from '../../components/common/Button';

const STATUS_STEPS = ['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'COMPLETED'];

const OrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(location.state?.successMessage || null);

  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelError, setCancelError] = useState(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCustomerOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error(`Error fetching order ${id}:`, err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleCancelOrder = async () => {
    if (!id) return;
    setIsCancelling(true);
    setCancelError(null);
    try {
      const updated = await cancelOrder(id);
      setOrder(updated);
      setShowCancelConfirm(false);
      setSuccessMsg('Order cancelled successfully.');
    } catch (err) {
      console.error(`Error cancelling order ${id}:`, err);
      setCancelError(err.message || 'Failed to cancel order.');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-brand-background min-h-screen py-16 flex flex-col items-center justify-center">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-brand-secondary mb-1">Loading order details...</h3>
          <p className="text-sm text-brand-muted">Fetching latest status from database.</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isForbidden = error.status === 403;
    const isNotFound = error.status === 404;

    return (
      <div className="bg-brand-background min-h-screen py-16 flex flex-col items-center justify-center px-4">
        <div className="bg-brand-surface border border-brand-border rounded-xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-brand-secondary mb-2">
            {isForbidden
              ? 'Access Denied'
              : isNotFound
              ? 'Order Not Found'
              : 'Unable to Load Order'}
          </h2>
          <p className="text-sm text-brand-muted mb-6">
            {error.message || 'An error occurred while loading order details.'}
          </p>
          <Link to="/orders">
            <Button variant="primary" className="inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to My Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isTerminalState = ['REJECTED', 'CANCELLED'].includes(order.status);
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);
  const canCancel = ['PENDING', 'ACCEPTED'].includes(order.status);

  return (
    <div className="bg-brand-background min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation */}
        <div>
          <Link to="/orders" className="inline-flex items-center text-xs font-bold text-brand-primary hover:underline mb-2">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to My Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-extrabold text-brand-secondary tracking-tight">Order #{order.id}</h1>
                {renderStatusBadge(order.status)}
              </div>
              <p className="text-xs text-brand-muted mt-1">Placed on {formattedDate}</p>
            </div>

            {/* Cancel Button */}
            {canCancel && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelConfirm(true)}
                className="text-xs text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
              >
                <Ban className="w-3.5 h-3.5 mr-1" />
                Cancel Order
              </Button>
            )}
          </div>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800 text-xs font-bold">
              Dismiss
            </button>
          </div>
        )}

        {/* Cancel Error */}
        {cancelError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{cancelError}</span>
          </div>
        )}

        {/* Status Progression Timeline */}
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-brand-secondary mb-6">Order Status Progress</h2>

          {isTerminalState ? (
            <div className="bg-brand-background border border-brand-border rounded-xl p-4 flex items-center space-x-3">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-brand-secondary">
                  Order {order.status === 'CANCELLED' ? 'Cancelled' : 'Declined'}
                </h4>
                <p className="text-xs text-brand-muted">
                  {order.status === 'CANCELLED'
                    ? 'You cancelled this order.'
                    : 'The entrepreneur was unable to accept this order at this time.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="relative flex items-center justify-between">
              {/* Progress Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-brand-border -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-brand-primary -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
                }}
              />

              {STATUS_STEPS.map((step, index) => {
                const isPassed = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-brand-primary text-white shadow-sm'
                          : 'bg-brand-surface border-2 border-brand-border text-brand-muted'
                      } ${isCurrent ? 'ring-4 ring-brand-primary/20 scale-110' : ''}`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-2 text-center max-w-[70px] ${
                        isCurrent
                          ? 'text-brand-primary'
                          : isPassed
                          ? 'text-brand-secondary'
                          : 'text-brand-muted'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Business & Delivery Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Info */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-brand-secondary flex items-center mb-4 pb-3 border-b border-brand-border">
              <Store className="w-4 h-4 text-brand-primary mr-2" />
              Business Information
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-brand-muted block font-medium">Business Name</span>
                <span className="text-sm font-bold text-brand-secondary">{order.business?.businessName}</span>
              </div>
              <div>
                <span className="text-brand-muted block font-medium">Category & Location</span>
                <span className="text-brand-secondary font-medium">{order.business?.category} • {order.business?.location}</span>
              </div>
              {order.business?.ownerName && (
                <div>
                  <span className="text-brand-muted block font-medium">Entrepreneur</span>
                  <span className="text-brand-secondary font-medium">{order.business?.ownerName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm">
            <h2 className="text-sm font-bold text-brand-secondary flex items-center mb-4 pb-3 border-b border-brand-border">
              <MapPin className="w-4 h-4 text-brand-primary mr-2" />
              Delivery Details
            </h2>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-brand-muted block font-medium">Customer Name & Contact</span>
                <span className="text-sm font-bold text-brand-secondary">{order.customerName} ({order.customerPhone})</span>
              </div>
              <div>
                <span className="text-brand-muted block font-medium">Delivery Address</span>
                <span className="text-brand-secondary font-medium leading-relaxed block mt-0.5">{order.deliveryAddress}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items Table */}
        <div className="bg-brand-surface border border-brand-border rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-brand-secondary mb-4 pb-3 border-b border-brand-border">
            Ordered Items
          </h2>

          <div className="divide-y divide-brand-border/60">
            {order.items?.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-brand-secondary text-sm">{item.service?.name}</h4>
                  <p className="text-brand-muted">
                    Unit Price: ₹{Number(item.unitPrice).toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-brand-muted text-[10px] block">Subtotal</span>
                  <span className="font-bold text-brand-secondary text-sm">
                    ₹{Number(item.subtotal).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-brand-border flex items-center justify-between mt-2">
            <span className="text-sm font-bold text-brand-secondary">Total Amount</span>
            <span className="text-xl font-extrabold text-brand-primary">
              ₹{Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-brand-surface border border-brand-border rounded-xl p-6 max-w-md w-full shadow-lg">
            <h3 className="text-lg font-bold text-brand-secondary mb-2">Cancel Order #{order.id}?</h3>
            <p className="text-sm text-brand-muted mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCancelConfirm(false)}
                disabled={isCancelling}
              >
                Keep Order
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isCancelling ? (
                  <span className="flex items-center">
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Cancelling...
                  </span>
                ) : (
                  'Yes, Cancel Order'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
