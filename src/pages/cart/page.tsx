import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { useCart } from '../../contexts/CartContext';
import { useCurrency } from '../../contexts/CurrencyContext';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { formatPrice } = useCurrency();
  const itemsRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-reveal');
        }
      });
    }, observerOptions);

    if (itemsRef.current) observer.observe(itemsRef.current);
    if (summaryRef.current) observer.observe(summaryRef.current);

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="luxury-empty-state animate-reveal">
              <i className="ri-shopping-cart-line text-6xl sm:text-7xl lg:text-8xl text-gray-300 mb-4 sm:mb-6"></i>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Your cart is empty</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Start shopping to add items to your cart</p>
              <button
                onClick={() => navigate('/products')}
                className="luxury-button bg-amber-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-600/30 hover:scale-105 whitespace-nowrap"
              >
                Browse Products
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div ref={itemsRef} className="lg:col-span-2 space-y-4 opacity-0 translate-y-8 transition-all duration-800 ease-out">
              {items.map((item, index) => (
                <div 
                  key={item.product.id} 
                  className="luxury-cart-item bg-white rounded-2xl p-4 sm:p-6 shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex gap-4 sm:gap-6">
                    <div className="luxury-cart-image relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 group">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 pr-2">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 hover:text-amber-600 transition-colors duration-300">{item.product.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 uppercase tracking-wide">{item.product.category}</p>
                          <p className="text-lg sm:text-xl font-bold text-amber-600">{formatPrice(item.product.price)}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="luxury-delete-button text-gray-400 hover:text-red-600 transition-all duration-300 p-2 hover:scale-110 hover:bg-red-50 rounded-lg"
                        >
                          <i className="ri-delete-bin-line text-lg sm:text-xl"></i>
                        </button>
                      </div>

                      <div className="luxury-quantity-control flex items-center space-x-2 sm:space-x-3 bg-gray-100 rounded-lg px-2 sm:px-3 py-2 w-fit hover:bg-gray-200 transition-colors duration-300">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 hover:text-amber-600 transition-all duration-300 hover:scale-110"
                        >
                          <i className="ri-subtract-line text-sm sm:text-base"></i>
                        </button>
                        <span className="text-base sm:text-lg font-semibold text-gray-900 w-6 sm:w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-600 hover:text-amber-600 transition-all duration-300 hover:scale-110"
                        >
                          <i className="ri-add-line text-sm sm:text-base"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div ref={summaryRef} className="luxury-summary-card bg-white rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 lg:sticky lg:top-24 opacity-0 translate-y-8" style={{ animationDelay: '200ms' }}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Items</span>
                    <span className="font-semibold">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4 sm:mb-6">
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-amber-600">{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="luxury-checkout-button w-full bg-amber-600 text-white py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-amber-600/30 hover:scale-[1.02] whitespace-nowrap"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate('/products')}
                  className="luxury-continue-button w-full mt-3 bg-gray-100 text-gray-700 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-[1.02] whitespace-nowrap"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
