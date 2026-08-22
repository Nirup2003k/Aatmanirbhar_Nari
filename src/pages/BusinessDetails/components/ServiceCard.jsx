import React, { useState } from 'react';
import { Clock, ShoppingCart, Plus, Minus, Check } from 'lucide-react';
import Button from '../../../components/common/Button';
import { useCart } from '../../../context/CartContext';

const ServiceCard = ({ service, businessId, businessName, onInquire }) => {
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const { addToCart } = useCart();

  const handleQuantityDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleQuantityIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
    if (!businessId || !service) return;
    addToCart(businessId, businessName, service, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1500);
  };

  return (
    <div className="bg-brand-background border border-brand-border rounded-xl p-5 shadow-sm flex flex-col justify-between h-full hover:border-brand-primary/40 transition-all duration-200">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-brand-secondary">
            {service.name}
          </h3>
          <span className="inline-flex items-center text-xs font-bold text-brand-primary bg-brand-surface border border-brand-border px-2.5 py-1 rounded-md whitespace-nowrap">
            {service.price}
          </span>
        </div>

        <p className="text-sm text-brand-text mb-4 leading-relaxed">
          {service.description}
        </p>

        {service.availability && (
          <div className="flex items-center text-xs text-brand-muted mb-4">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-brand-primary/70 flex-shrink-0" />
            <span>{service.availability}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-brand-border/50 space-y-3">
        {/* Quantity selection & Add to Cart */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-brand-surface border border-brand-border rounded-lg p-1">
            <button
              onClick={handleQuantityDecrease}
              className="p-1 rounded text-brand-secondary hover:bg-brand-background transition-colors"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold w-7 text-center text-brand-secondary">
              {quantity}
            </span>
            <button
              onClick={handleQuantityIncrease}
              className="p-1 rounded text-brand-secondary hover:bg-brand-background transition-colors"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            className="flex-1 justify-center text-xs py-2"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-white" />
                Added!
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 mr-1" />
                Add to Cart
              </>
            )}
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onInquire(service)}
          className="w-full justify-center bg-white text-xs"
        >
          Inquire About This Service
        </Button>
      </div>
    </div>
  );
};

export default ServiceCard;
