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
    <div className="pt-32 pb-20 min-h-screen flex items-center justify-center bg-earth-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[3.5rem] shadow-2xl shadow-red-900/5 border border-red-50 p-12 text-center space-y-10"
      >
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-12 h-12 text-brand-red" />
        </div>

        <div className="space-y-4">
          <h2 className="text-4xl font-sans font-black text-red-950 leading-tight">
            {user ? 'Welcome Back!' : 'Admin Access'}
          </h2>
          <p className="text-earth-500 font-medium">
            {user
              ? `Logged in as ${user.displayName}`
              : 'Please sign in with your Google account to access the forest sanctuary admin panel.'}
          </p>
        </div>

        {error && (
          <div className="p-5 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-100">
            {error}
          </div>
        )}

        {user ? (
          <div className="space-y-6">
            <div className="flex items-center gap-5 p-6 bg-earth-50 rounded-[2rem] border border-red-100 shadow-inner">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-16 h-16 rounded-full border-4 border-white shadow-md" />
              ) : (
                <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center text-white shadow-lg">
                  <UserIcon className="w-8 h-8" />
                </div>
              )}
              <div className="text-left">
                <p className="font-black text-red-950 text-lg leading-none mb-1">{user.displayName}</p>
                <p className="text-xs font-black uppercase tracking-widest text-red-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              {isAdmin && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full py-5 bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-800 transition-all shadow-xl shadow-red-900/20"
                >
                  Go to Admin Panel
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full py-5 bg-white text-earth-600 border-2 border-red-100 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-earth-50 transition-all flex items-center justify-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-6 bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-800 transition-all shadow-xl shadow-red-900/20 flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign in with Google
              </>
            )}
          </button>
        )}
      </motion.div>
    </div>
  );
}
