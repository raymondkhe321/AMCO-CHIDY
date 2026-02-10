import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { mockProducts } from '../../mocks/products';
import { useCurrency } from '../../contexts/CurrencyContext';

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-reveal');
        }
      });
    }, observerOptions);

    if (headerRef.current) observer.observe(headerRef.current);
    if (gridRef.current) observer.observe(gridRef.current);

    return () => observer.disconnect();
  }, []);

  const categories = [
    'All', 
    'Industrial Electrical Materials', 
    'Cables', 
    'Chandeliers', 
    'Outdoor Lights', 
    'Interior Decorative Lights', 
    'General Lighting'
  ];
  
  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div ref={headerRef} className="text-center mb-10 lg:mb-14 opacity-0 translate-y-8 transition-all duration-800 ease-out">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-5">Our Products</h1>
            <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Explore our comprehensive collection of premium electrical materials and luxury lighting
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-10 lg:mb-14 space-y-5 lg:space-y-7">
            <div className="relative max-w-xl mx-auto luxury-search-wrapper">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 lg:px-6 py-4 lg:py-5 pr-14 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm shadow-sm hover:shadow-md transition-all duration-300"
              />
              <i className="ri-search-line absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
            </div>

            <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
              {categories.map((category, index) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`luxury-filter-button px-5 lg:px-7 py-2.5 rounded-full text-xs lg:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    selectedCategory === category
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md hover:scale-105'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div ref={gridRef} className="opacity-0 translate-y-8 transition-all duration-800 ease-out">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8" data-product-shop>
              {filteredProducts.map((product, index) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="luxury-product-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.03]"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden bg-gray-50">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    {product.featured && (
                      <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-5 lg:p-6">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-medium">{product.category}</p>
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-300 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xl lg:text-2xl font-bold text-amber-600">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 lg:py-24">
              <i className="ri-search-line text-6xl lg:text-7xl text-gray-300 mb-5"></i>
              <p className="text-lg lg:text-xl text-gray-500 font-medium">No products found</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
