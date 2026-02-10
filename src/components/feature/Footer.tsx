import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <img 
              src="https://static.readdy.ai/image/a4e157aaaac222b76662ac0a94f2add0/92f5c613d29f43e3fe672a20b23e905d.jpeg" 
              alt="Amco Chidy Electricals" 
              className="h-10 sm:h-12 w-auto"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for premium electrical solutions and luxury lighting fixtures.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-y-[-2px]">
                <i className="ri-facebook-fill text-xl sm:text-2xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-y-[-2px]">
                <i className="ri-twitter-fill text-xl sm:text-2xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-y-[-2px]">
                <i className="ri-instagram-fill text-xl sm:text-2xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-y-[-2px]">
                <i className="ri-linkedin-fill text-xl sm:text-2xl"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Categories</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                  Chandeliers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                  Wall Lights
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                  Ceiling Lights
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-all duration-300 hover:translate-x-1 inline-block text-sm">
                  Outdoor Lighting
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Contact Us</h3>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-start space-x-3">
                <i className="ri-map-pin-line text-amber-400 text-lg sm:text-xl mt-1 flex-shrink-0"></i>
                <span className="text-gray-400 text-sm">123 Electrical Avenue, Lagos, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="ri-phone-line text-amber-400 text-lg sm:text-xl flex-shrink-0"></i>
                <span className="text-gray-400 text-sm">+234 123 456 7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="ri-mail-line text-amber-400 text-lg sm:text-xl flex-shrink-0"></i>
                <span className="text-gray-400 text-sm break-all">info@amcochidy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 sm:pt-8">
          <p className="text-gray-400 text-xs sm:text-sm text-center">
            © 2025 Amco Chidy Electricals. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
