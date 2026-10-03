import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './useAuth';
import ToastContainer from '../components/common/ToastContainer';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const RealtimeContext = createContext({
  toasts: [],
  dismissToast: () => {},
  subscribeToEvents: () => () => {},
});

export const RealtimeProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [toasts, setToasts] = useState([]);
  const listenersRef = useRef(new Set());
  const eventSourceRef = useRef(null);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toastData) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 4);
    const newToast = { id, ...toastData };

    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Auto-dismiss after 6 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 6000);
  }, [dismissToast]);

  const subscribeToEvents = useCallback((callback) => {
    if (typeof callback === 'function') {
      listenersRef.current.add(callback);
    }
    return () => {
      listenersRef.current.delete(callback);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const streamUrl = `${API_BASE_URL}/realtime/stream`;

    try {
      const es = new EventSource(streamUrl, { withCredentials: true });
      eventSourceRef.current = es;

      const handleEvent = (e) => {
        try {
          const payload = JSON.parse(e.data);
          const { event, data } = payload;

          // Notify subscribed components (e.g., dashboard, my orders)
          listenersRef.current.forEach((cb) => {
            try {
              cb(payload);
            } catch (err) {
              console.error('Realtime listener error:', err);
            }
          });

          // Show Toast notification based on event type
          if (event === 'NEW_ORDER') {
            const amountStr = data.totalAmount ? ` (₹${data.totalAmount})` : '';
            addToast({
              event,
              title: '🛍️ New Order Received!',
              message: `Order #${data.orderId} placed by ${data.customerName || 'Customer'}${amountStr}.`,
            });
          } else if (event === 'ORDER_STATUS_UPDATED') {
            const bizName = data.businessName ? ` (${data.businessName})` : '';
            addToast({
              event,
              title: '📦 Order Status Updated',
              message: `Order #${data.orderId}${bizName} is now: ${data.status}`,
            });
          }
        } catch (err) {
          console.error('Failed to parse SSE event data:', err);
        }
      };

      es.addEventListener('NEW_ORDER', handleEvent);
      es.addEventListener('ORDER_STATUS_UPDATED', handleEvent);

      es.onerror = () => {
        // EventSource automatically handles reconnection. Silent handling.
      };

      return () => {
        es.removeEventListener('NEW_ORDER', handleEvent);
        es.removeEventListener('ORDER_STATUS_UPDATED', handleEvent);
        es.close();
        eventSourceRef.current = null;
      };
    } catch (err) {
      console.error('Failed to initialize Realtime EventSource stream:', err);
    }
  }, [isAuthenticated, user, addToast]);

  return (
    <RealtimeContext.Provider value={{ toasts, dismissToast, subscribeToEvents }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => useContext(RealtimeContext);
