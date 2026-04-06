import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Sparkles, Utensils, ArrowRight, Heart } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isSpeciality: boolean;
}

export default function Speciality() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'menuItems'),
      where('isSpeciality', '==', true),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'menuItems'));

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-brand-light px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 text-brand-red rounded-full text-xs font-black uppercase tracking-widest border border-red-100 shadow-sm"
          >
            <Star className="w-4 h-4 fill-brand-red text-brand-red" />
            <span>Chef's Choice</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-sans font-black text-brand-dark tracking-tight"
          >
            Our <span className="text-brand-red">Specialities</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Discover the unique flavors that define Foody. These are our most-loved dishes, crafted with extra care and premium ingredients.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col md:flex-row h-full"
              >
                <div className="relative md:w-2/5 h-72 md:h-auto overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-gray-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white text-[10px] font-black flex items-center gap-2 uppercase tracking-widest">
                      <Heart className="w-4 h-4 fill-brand-red text-brand-red" />
                      Highly Recommended
                    </p>
                  </div>
                </div>

                <div className="p-10 md:w-3/5 flex flex-col justify-between space-y-8 bg-white text-center md:text-left">
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                      <h3 className="text-3xl font-sans font-black text-brand-dark leading-tight group-hover:text-brand-red transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-2xl font-black text-brand-dark tracking-tighter">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed line-clamp-3">
                      {item.description || 'A masterpiece of flavor and presentation, this speciality dish is a must-try for any food lover.'}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-gray-50 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-xl">
                        <Star className="w-5 h-5 text-brand-red fill-brand-red" />
                      </div>
                      <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-brand-red font-black text-[10px] uppercase tracking-widest">
                      <Sparkles className="w-4 h-4" />
                      Signature Dish
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {items.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-brand-dark">No specialities yet</h3>
            <p className="text-gray-500 font-medium">Our chef is busy crafting something amazing. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  );
}
