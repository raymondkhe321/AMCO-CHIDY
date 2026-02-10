
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import CurrencySelector from './CurrencySelector';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [currentUser, setCurrentUser] = useState(user);

  // Update current user when auth changes
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  // Listen for auth changes
  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const storedUser = localStorage.getItem('amco_user');
        setCurrentUser(storedUser ? JSON.parse(storedUser) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHome 
        ? 'bg-white/95 backdrop-blur-md shadow-md' 
        : 'bg-transparent'
    }`}>
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center space-x-2 lg:space-x-3 flex-shrink-0">
            <img 
              src="https://static.readdy.ai/image/a4e157aaaac222b76662ac0a94f2add0/92f5c613d29f43e3fe672a20b23e905d.jpeg" 
              alt="Amco Chidy Electricals" 
              className="h-8 sm:h-10 lg:h-12 w-auto"
            />
            <span className={`text-xs sm:text-sm lg:text-lg xl:text-xl font-semibold transition-colors whitespace-nowrap ${
              scrolled || !isHome ? 'text-gray-900' : 'text-white'
            }`}>
              Amco Chidy Electricals
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-5 xl:space-x-8 2xl:space-x-10">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors whitespace-nowrap ${
                scrolled || !isHome ? 'text-gray-700 hover:text-amber-600' : 'text-white hover:text-amber-300'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`text-sm font-medium transition-colors whitespace-nowrap ${
                scrolled || !isHome ? 'text-gray-700 hover:text-amber-600' : 'text-white hover:text-amber-300'
              }`}
            >
              Products
            </Link>
            
            {currentUser?.role === 'admin' && (
              <Link 
                to="/admin" 
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  scrolled || !isHome ? 'text-gray-700 hover:text-amber-600' : 'text-white hover:text-amber-300'
                }`}
              >
                Dashboard
              </Link>
            )}

            <CurrencySelector scrolled={scrolled} isHome={isHome} />

            <Link 
              to="/cart" 
              className={`relative text-sm font-medium transition-colors whitespace-nowrap ${
                scrolled || !isHome ? 'text-gray-700 hover:text-amber-600' : 'text-white hover:text-amber-300'
              }`}
            >
              <i className="ri-shopping-cart-line text-xl"></i>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="flex items-center space-x-4">
                <span className={`text-sm whitespace-nowrap ${
                  scrolled || !isHome ? 'text-gray-700' : 'text-white'
                }`}>
                  {currentUser.name}
                </span>
                <button
                  onClick={handleLogout}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    scrolled || !isHome ? 'text-gray-700 hover:text-amber-600' : 'text-white hover:text-amber-300'
                  }`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-amber-600 text-white px-4 xl:px-6 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors whitespace-nowrap"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="flex lg:hidden items-center space-x-3 sm:space-x-4">
            <div className="scale-75 sm:scale-100">
              <CurrencySelector scrolled={scrolled} isHome={isHome} />
            </div>
            <Link 
              to="/cart" 
              className={`relative ${
                scrolled || !isHome ? 'text-gray-700' : 'text-white'
              }`}
            >
              <i className="ri-shopping-cart-line text-xl sm:text-2xl"></i>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${
                scrolled || !isHome ? 'text-gray-700' : 'text-white'
              }`}
            >
              <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl sm:text-3xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 py-4 shadow-lg">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-amber-600 hover:bg-amber-50 font-medium px-4 py-3 transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-700 hover:text-amber-600 hover:bg-amber-50 font-medium px-4 py-3 transition-colors"
              >
                Products
              </Link>
              
              {currentUser?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="text-gray-700 hover:text-amber-600 hover:bg-amber-50 font-medium px-4 py-3 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {currentUser ? (
                <>
                  <div className="text-gray-700 font-medium px-4 py-3 bg-gray-50">
                    {currentUser.name}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-amber-600 hover:bg-amber-50 font-medium px-4 py-3 text-left transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-amber-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-amber-700 mx-4 text-center transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
