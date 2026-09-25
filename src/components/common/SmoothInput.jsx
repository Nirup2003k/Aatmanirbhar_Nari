import React, { useRef, useState, useEffect, useLayoutEffect, useCallback, forwardRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const SmoothInput = forwardRef(({
  value = '',
  onChange,
  onFocus,
  onBlur,
  onSelect,
  placeholder,
  className = '',
  id,
  type = 'text',
  ariaLabel,
  containerClassName = 'relative flex items-center w-full',
  caretClassName = 'bg-brand-primary',
  style = {},
  ...props
}, ref) => {
  const internalRef = useRef(null);
  const canvasRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasSelectionRange, setHasSelectionRange] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Motion value for smooth horizontal position
  const xPos = useMotionValue(0);
  const springX = useSpring(xPos, { stiffness: 420, damping: 28, mass: 0.5 });

  // Handle both callback refs and object refs
  const setRef = useCallback(
    (node) => {
      internalRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref]
  );

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Measure text width up to caret position (selectionStart)
  const updateCaretPosition = useCallback(() => {
    const el = internalRef.current;
    if (!el) return;

    const strValue = typeof value === 'string' ? value : String(value || '');
    const selStart = el.selectionStart ?? strValue.length;
    const selEnd = el.selectionEnd ?? strValue.length;
    
    // Hide custom caret if user selected a range of characters
    setHasSelectionRange(selStart !== selEnd);

    let textBeforeCaret = strValue.substring(0, selStart);

    // If password input, measure bullet character length
    if (type === 'password' || el.type === 'password') {
      textBeforeCaret = '•'.repeat(textBeforeCaret.length);
    }

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      const computed = window.getComputedStyle(el);
      const fontWeight = computed.fontWeight || '400';
      const fontSize = computed.fontSize || '14px';
      const fontFamily = computed.fontFamily || 'sans-serif';
      const letterSpacing = computed.letterSpacing;
      
      ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
      if (letterSpacing && letterSpacing !== 'normal' && 'letterSpacing' in ctx) {
        ctx.letterSpacing = letterSpacing;
      }
      
      const textWidth = ctx.measureText(textBeforeCaret).width;
      const paddingLeft = parseFloat(computed.paddingLeft || '0');
      const scrollLeft = el.scrollLeft || 0;
      
      const targetX = paddingLeft + textWidth - scrollLeft;
      xPos.set(targetX);
    }
  }, [value, type, xPos]);

  useLayoutEffect(() => {
    updateCaretPosition();
  }, [updateCaretPosition]);

  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;

    const handleEvents = () => updateCaretPosition();

    el.addEventListener('scroll', handleEvents);
    el.addEventListener('keyup', handleEvents);
    el.addEventListener('keydown', handleEvents);
    el.addEventListener('click', handleEvents);
    el.addEventListener('input', handleEvents);

    return () => {
      el.removeEventListener('scroll', handleEvents);
      el.removeEventListener('keyup', handleEvents);
      el.removeEventListener('keydown', handleEvents);
      el.removeEventListener('click', handleEvents);
      el.removeEventListener('input', handleEvents);
    };
  }, [updateCaretPosition]);

  return (
    <div className={containerClassName}>
      <input
        ref={setRef}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={(e) => {
          setIsFocused(true);
          updateCaretPosition();
          if (onFocus) onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        onSelect={(e) => {
          updateCaretPosition();
          if (onSelect) onSelect(e);
        }}
        placeholder={placeholder}
        aria-label={ariaLabel}
        style={{ caretColor: 'transparent', ...style }}
        className={`caret-transparent ${className}`}
        {...props}
      />

      {/* Custom Smooth Spring Caret */}
      {isFocused && !hasSelectionRange && (
        <motion.span
          style={{ x: prefersReducedMotion ? xPos : springX }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[55%] rounded-full pointer-events-none z-10 shadow-xs ${caretClassName}`}
        />
      )}
    </div>
  );
});

SmoothInput.displayName = 'SmoothInput';

export default SmoothInput;
