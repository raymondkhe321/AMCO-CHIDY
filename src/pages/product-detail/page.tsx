import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { mockProducts } from '../../mocks/products';
import { useCart } from '../../contexts/CartContext';
import { useCurrency } from '../../contexts/CurrencyContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  const product = mockProducts.find(p => p.id === id);

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

    if (contentRef.current) observer.observe(contentRef.current);
    if (imagesRef.current) observer.observe(imagesRef.current);

    return () => observer.disconnect();
  }, []);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="luxury-button bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/products')}
            className="luxury-back-button flex items-center text-gray-600 hover:text-amber-600 mb-6 lg:mb-8 transition-all duration-300 group"
          >
            <i className="ri-arrow-left-line mr-2 transform group-hover:-translate-x-1 transition-transform duration-300"></i>
            <span className="font-medium">Back to Products</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            {/* Images */}
            <div ref={imagesRef} className="opacity-0 translate-y-8 transition-all duration-800 ease-out">
              <div className="luxury-image-container relative w-full h-64 sm:h-80 lg:h-[500px] bg-white rounded-2xl overflow-hidden shadow-lg mb-4 group">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`luxury-thumbnail relative w-full h-16 sm:h-20 lg:h-24 bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                      selectedImage === index 
                        ? 'ring-4 ring-amber-600 shadow-lg scale-105' 
                        : 'hover:ring-2 ring-gray-300 hover:scale-105 shadow-md'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div ref={contentRef} className="opacity-0 translate-y-8 transition-all duration-800 ease-out" style={{ animationDelay: '200ms' }}>
              <div className="luxury-detail-card bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500">
                <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-2 font-medium">{product.category}</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
                <p className="text-3xl sm:text-4xl font-bold text-amber-600 mb-6">{formatPrice(product.price)}</p>

                <div className="mb-6 lg:mb-8">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Description</h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {product.specifications && (
                  <div className="mb-6 lg:mb-8 bg-gray-50 rounded-xl p-4 lg:p-5">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Specifications</h2>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{product.specifications}</p>
                  </div>
                )}

                <div className="flex items-center space-x-4 mb-6">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${product.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <i className={`${product.available ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'} text-lg sm:text-xl`}></i>
                    <span className="text-sm sm:text-base font-semibold">{product.available ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  className={`luxury-add-to-cart w-full py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 whitespace-nowrap ${
                    product.available
                      ? 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg hover:shadow-xl hover:shadow-amber-600/30 hover:scale-[1.02]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <i className="ri-shopping-cart-line mr-2"></i>
                  Add to Cart
                </button>

                {showSuccess && (
                  <div className="luxury-success-message mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center text-sm sm:text-base animate-reveal shadow-md">
                    <i className="ri-check-line text-xl mr-2"></i>
                    <span className="font-medium">Added to cart successfully!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
