import { motion } from 'motion/react';
import { ArrowRight, Star, Leaf, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] pt-32 pb-12 flex flex-col items-center justify-center overflow-hidden bg-brand-light">
      {/* Floating Decorative Leaves */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[10%] text-red-300 opacity-30"
        >
          <Leaf className="w-16 h-16" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-40 right-[15%] text-red-400 opacity-20"
        >
          <Leaf className="w-24 h-24" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute top-1/2 right-[5%] text-red-200 opacity-25"
        >
          <Leaf className="w-12 h-12" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10 text-center col-span-full max-w-4xl mx-auto"
          >
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-sans font-black text-brand-dark leading-[1.1] tracking-tight">
                Fresh Food. <br />
                <span className="text-brand-red">Fast Service.</span> <br />
                View Our Menu.
              </h1>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                Explore our curated selection of dishes, crafted with the freshest ingredients and a touch of passion.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center px-10 py-5 bg-brand-red text-white rounded-full font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 group"
              >
                View Menu
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-10 py-5 bg-white text-brand-dark rounded-full font-black uppercase tracking-widest border-2 border-gray-100 hover:border-brand-red hover:text-brand-red transition-all shadow-sm"
              >
                Book A Table
              </Link>
            </div>

            {/* Review Badge */}
            <div className="pt-8 flex items-center justify-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-sm">
                    <img 
                      src={`https://i.pravatar.cc/150?u=${i + 10}`} 
                      alt="User" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white bg-brand-dark text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  45+
                </div>
              </div>
              <div className="space-y-1 text-left">
                <p className="font-black text-brand-dark">Reviews</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
