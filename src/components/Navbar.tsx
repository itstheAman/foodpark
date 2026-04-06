import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, UtensilsCrossed, LogIn, LayoutDashboard, Search } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Offers', path: '/offers' },
    { name: 'Speciality', path: '/speciality' },
    { name: 'Contact', path: '/contact' },
  ];

  const isAdmin = user?.email === 'microflicker@gmail.com';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'py-4 bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100' : 'py-8 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group relative z-10">
            <img 
              src="https://storage.googleapis.com/a1aa/image/eI2n5tJ446K4D9I8N20Q50143831871239123891238912389123891238912389123891238912389.jpg" 
              alt="Foodpark Logo" 
              className="w-12 h-12 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform"
              onError={(e) => {
                // Fallback if the image URL is not accessible
                e.currentTarget.src = "https://placehold.co/100x100/e1ede1/2f4e2f?text=FP";
              }}
            />
            <div className="flex flex-col">
              <span className="text-xl font-sans font-black tracking-tight text-red-900 leading-none">
                FOODPARK
              </span>
              <span className="text-[10px] font-bold text-brand-red tracking-widest uppercase">
                Mini Restaurant
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Center Aligned */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs font-black uppercase tracking-widest transition-all hover:text-brand-red relative group ${
                  location.pathname === link.path ? 'text-brand-red' : 'text-brand-dark/70'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-brand-red transition-transform duration-300 origin-left ${
                  location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-6 relative z-10">
            {/* Open/Closed Indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-green-700">Open Now</span>
            </div>
            <button className="p-2 text-brand-dark hover:text-brand-red transition-colors">
              <Search className="w-5 h-5" />
            </button>
            {isAdmin ? (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-dark text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-xl shadow-gray-900/10"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Admin
              </Link>
            ) : (
              <Link
                to="/contact"
                className="px-6 py-2.5 bg-brand-red text-white rounded-full text-xs font-black uppercase tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-red-900/20"
              >
                Book Now
              </Link>
            )}
            {!user && (
              <Link
                to="/login"
                className="p-2 text-brand-dark hover:text-brand-red transition-colors"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4 relative z-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-brand-dark hover:text-brand-red transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl overflow-hidden"
          >
            <div className="py-10 px-4 space-y-6 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg font-black uppercase tracking-widest transition-colors ${
                    location.pathname === link.path
                      ? 'text-brand-red'
                      : 'text-brand-dark hover:text-brand-red'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-6 border-t border-gray-50 space-y-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block py-4 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block py-4 bg-brand-red text-white rounded-2xl font-black uppercase tracking-widest text-xs"
                >
                  Book A Table
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
