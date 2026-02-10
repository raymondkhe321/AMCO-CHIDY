import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import Navbar from '../../components/feature/Navbar';
import Footer from '../../components/feature/Footer';
import { mockProducts } from '../../mocks/products';
import { useCurrency } from '../../contexts/CurrencyContext';

export default function Home() {
  const featuredSectionRef = useRef<HTMLDivElement>(null);
  const categoriesSectionRef = useRef<HTMLDivElement>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-reveal');
        }
      });
    }, observerOptions);

    if (featuredSectionRef.current) {
      observer.observe(featuredSectionRef.current);
    }
    if (categoriesSectionRef.current) {
      observer.observe(categoriesSectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const featuredProducts = mockProducts.filter(p => p.featured).slice(0, 8);

  const categories = [
    {
      name: 'Chandeliers',
      image: 'https://readdy.ai/api/search-image?query=luxury%20crystal%20chandelier%20hanging%20in%20elegant%20minimalist%20white%20room%20with%20soft%20ambient%20lighting%20and%20clean%20architectural%20details%20premium%20interior%20design%20photography%20style%20sophisticated%20atmosphere&width=600&height=400&seq=cat1&orientation=landscape',
      link: '/products'
    },
    {
      name: 'Outdoor Lights',
      image: 'https://readdy.ai/api/search-image?query=modern%20outdoor%20wall%20mounted%20light%20fixture%20on%20clean%20white%20exterior%20wall%20with%20warm%20glow%20minimalist%20architectural%20photography%20evening%20ambiance%20premium%20quality&width=600&height=400&seq=cat2&orientation=landscape',
      link: '/products'
    },
    {
      name: 'Interior Decorative Lights',
      image: 'https://readdy.ai/api/search-image?query=elegant%20wall%20sconce%20and%20pendant%20lights%20in%20sophisticated%20modern%20interior%20with%20clean%20white%20walls%20warm%20ambient%20lighting%20luxury%20home%20decor%20photography%20style&width=600&height=400&seq=cat3&orientation=landscape',
      link: '/products'
    },
    {
      name: 'Industrial Materials',
      image: 'https://readdy.ai/api/search-image?query=professional%20electrical%20circuit%20breakers%20and%20industrial%20components%20arranged%20on%20clean%20white%20surface%20technical%20product%20photography%20high%20quality%20precision%20equipment&width=600&height=400&seq=cat4&orientation=landscape',
      link: '/products'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section - LOCKED, NO CHANGES */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://readdy.ai/api/search-image?query=sophisticated%20modern%20luxury%20interior%20space%20with%20elegant%20chandelier%20and%20premium%20lighting%20fixtures%20in%20minimalist%20white%20room%20with%20warm%20ambient%20glow%20high%20end%20architectural%20photography%20style%20clean%20lines%20and%20refined%20atmosphere&width=1920&height=1080&seq=hero1&orientation=landscape"
            alt="Luxury Lighting"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Premium Electrical Solutions
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/95 mb-6 sm:mb-8 lg:mb-10 max-w-3xl mx-auto leading-relaxed">
            Discover our curated collection of luxury chandeliers, industrial materials, and premium lighting solutions
          </p>
          <Link
            to="/products"
            className="inline-block bg-amber-600 text-white px-8 sm:px-10 lg:px-12 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-amber-700 transition-all duration-300 shadow-2xl hover:shadow-amber-600/50 hover:scale-105 whitespace-nowrap"
          >
            Explore Collection
          </Link>
        </div>
      </section>

      {/* Featured Products Section - UPGRADED */}
      <section ref={featuredSectionRef} className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 opacity-0 translate-y-12 transition-all duration-1000 ease-out">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Featured Collection</h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked premium products that define excellence
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8" data-product-shop>
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="luxury-product-card group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.03]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-full h-64 sm:h-72 lg:h-80 overflow-hidden bg-gray-50">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Featured
                  </div>
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

          <div className="text-center mt-12 lg:mt-16">
            <Link
              to="/products"
              className="luxury-button inline-block bg-gray-900 text-white px-10 py-4 rounded-lg text-base font-semibold hover:bg-amber-600 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section - UPGRADED */}
      <section ref={categoriesSectionRef} className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gray-50 opacity-0 translate-y-12 transition-all duration-1000 ease-out">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Explore Categories</h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive range of premium electrical solutions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link
                key={category.name}
                to={category.link}
                className="luxury-category-card group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.03]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative w-full h-72 sm:h-80 lg:h-96">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute inset-0 bg-amber-600/0 group-hover:bg-amber-600/10 transition-colors duration-500"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-amber-300 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <div className="flex items-center text-white/90 group-hover:text-amber-300 transition-colors duration-300">
                    <span className="text-sm font-medium mr-2">Explore</span>
                    <i className="ri-arrow-right-line text-lg transform group-hover:translate-x-2 transition-transform duration-300"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
