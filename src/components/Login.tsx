import { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User as UserIcon, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const user = auth.currentUser;
  const isAdmin = user?.email === 'microflicker@gmail.com';

  return (
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center space-y-8"
      >
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-10 h-10 text-emerald-600" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">
            {user ? 'Welcome Back!' : 'Admin Access'}
          </h2>
          <p className="text-gray-500">
            {user
              ? `Logged in as ${user.displayName}`
              : 'Please sign in with your Google account to access the admin panel.'}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        {user ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
              ) : (
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                  <UserIcon className="w-6 h-6" />
                </div>
              )}
              <div className="text-left">
                <p className="font-bold text-gray-900">{user.displayName}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Go to Admin Panel
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full py-4 bg-white text-gray-600 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-6 h-6" />
                Sign in with Google
              </>
            )}
          </button>
        )}
      </motion.div>
    </div>
  );
}
