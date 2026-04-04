import React, { Component, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import { AnimatePresence } from 'motion/react';
import { auth } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Lazy load components
const Menu = React.lazy(() => import('./components/Menu'));
const Offers = React.lazy(() => import('./components/Offers'));
const Speciality = React.lazy(() => import('./components/Speciality'));
const Contact = React.lazy(() => import('./components/Contact'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const Login = React.lazy(() => import('./components/Login'));

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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;
  
  const isAdmin = user?.email === 'microflicker@gmail.com';
  if (!isAdmin) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

function Layout() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>}>
          <AnimatePresence mode="wait">
            <Outlet />
          </AnimatePresence>
        </Suspense>
      </main>
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <h3 className="text-3xl font-black text-emerald-500 tracking-tighter italic">FoodPark</h3>
              <p className="text-gray-400 leading-relaxed">
                Elevating your dining experience with fresh ingredients, bold flavors, and a passion for healthy living.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Explore</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="/" className="hover:text-emerald-500 transition-colors">Home</a></li>
                <li><a href="/menu" className="hover:text-emerald-500 transition-colors">Full Menu</a></li>
                <li><a href="/offers" className="hover:text-emerald-500 transition-colors">Special Offers</a></li>
                <li><a href="/speciality" className="hover:text-emerald-500 transition-colors">Chef's Special</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Support</h4>
              <ul className="space-y-4 text-gray-400">
                <li><a href="/contact" className="hover:text-emerald-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a></li>
                <li><a href="/login" className="hover:text-emerald-500 transition-colors">Admin Login</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-white">Newsletter</h4>
              <p className="text-gray-400 mb-4 text-sm">Subscribe to get the latest updates and offers.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  className="bg-gray-800 border-none rounded-xl px-4 py-3 text-sm flex-1 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button className="bg-emerald-600 px-4 py-3 rounded-xl hover:bg-emerald-700 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <p>&copy; 2024 FoodPark Mini Restaurant. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Instagram</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
            </div>
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
          <Route index element={<Hero />} />
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
