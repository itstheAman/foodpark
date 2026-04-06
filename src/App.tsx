import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { AnimatePresence } from 'motion/react';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { UtensilsCrossed, Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

// Lazy load components
const Menu = React.lazy(() => import('./components/Menu'));
const Offers = React.lazy(() => import('./components/Offers'));
const Speciality = React.lazy(() => import('./components/Speciality'));
const Contact = React.lazy(() => import('./components/Contact'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const Login = React.lazy(() => import('./components/Login'));

function Home() {
  return (
    <>
      <Hero />
      <div id="direct-menu">
        <Suspense fallback={<div className="py-20 text-center">Loading Menu...</div>}>
          <Menu isHomepage />
        </Suspense>
      </div>
    </>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-brand-light"><div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin" /></div>;
  
  const isAdmin = user?.email === 'microflicker@gmail.com';
  if (!isAdmin) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function Layout() {
  return (
    <div className="min-h-screen bg-brand-light font-sans selection:bg-brand-red selection:text-white">
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-brand-light"><div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" /></div>}>
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </Suspense>
      </main>
      <footer className="bg-brand-dark text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="space-y-8">
              <div className="flex items-center gap-3 group">
                <img 
                  src="https://storage.googleapis.com/a1aa/image/eI2n5tJ446K4D9I8N20Q50143831871239123891238912389123891238912389123891238912389.jpg" 
                  alt="Foodpark Logo" 
                  className="w-10 h-10 rounded-full object-cover shadow-lg group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/100x100/e1ede1/2f4e2f?text=FP";
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-xl font-sans font-black tracking-tight text-red-900 leading-none uppercase">
                    Foodpark
                  </span>
                  <span className="text-[10px] font-bold text-brand-red tracking-widest uppercase">
                    Mini Restaurant
                  </span>
                </div>
              </div>
              <p className="text-gray-400 font-medium leading-relaxed">
                Redefining the art of dining with passion, precision, and the freshest ingredients from nature.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-red transition-all group">
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-sm font-black uppercase tracking-widest text-brand-red">Quick Links</h4>
              <ul className="space-y-4">
                {['Home', 'Menu', 'Offers', 'Speciality', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors font-medium">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-sm font-black uppercase tracking-widest text-brand-red">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-gray-400 font-medium">
                  <MapPin className="w-5 h-5 text-brand-red shrink-0" />
                  <span>123 Gourmet Street, Food City, FC 45678</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 font-medium">
                  <Phone className="w-5 h-5 text-brand-red shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400 font-medium">
                  <Mail className="w-5 h-5 text-brand-red shrink-0" />
                  <span>hello@foody.com</span>
                </li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-sm font-black uppercase tracking-widest text-brand-red">Newsletter</h4>
              <p className="text-gray-400 font-medium">Subscribe to get special offers and menu updates.</p>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-white/5 border border-white/10 rounded-full py-4 px-6 focus:outline-none focus:ring-2 focus:ring-brand-red transition-all text-sm"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-brand-red text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              &copy; {new Date().getFullYear()} Foody Restaurant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="offers" element={<Offers />} />
          <Route path="speciality" element={<Speciality />} />
          <Route path="contact" element={<Contact />} />
          <Route path="admin" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
