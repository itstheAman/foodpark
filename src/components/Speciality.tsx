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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold shadow-sm border border-amber-200"
          >
            <Star className="w-4 h-4 fill-amber-700" />
            <span>Chef's Choice</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-extrabold text-gray-900 tracking-tight"
          >
            Our <span className="text-emerald-600 font-black">Specialities</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Discover the unique flavors that define FoodPark. These are our most-loved dishes, crafted with extra care.
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
                className="group relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-gray-100 flex flex-col md:flex-row h-full"
              >
                <div className="relative md:w-2/5 h-72 md:h-auto overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                      <Sparkles className="w-16 h-16 text-emerald-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <p className="text-white text-sm font-medium flex items-center gap-2">
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      Highly Recommended
                    </p>
                  </div>
                </div>

                <div className="p-10 md:w-3/5 flex flex-col justify-between space-y-8 bg-gradient-to-br from-white to-gray-50">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-3xl font-black text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">
                        {item.name}
                      </h3>
                      <span className="text-2xl font-black text-emerald-600">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-gray-500 text-lg leading-relaxed line-clamp-3">
                      {item.description || 'A masterpiece of flavor and presentation, this speciality dish is a must-try for any food lover.'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg">
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      </div>
                      <span className="font-bold text-gray-900 uppercase tracking-widest text-xs">
                        {item.category}
                      </span>
                    </div>
                    <button className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-4 transition-all group/btn">
                      Order Now
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {items.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">No specialities yet</h3>
            <p className="text-gray-500">Our chef is busy crafting something amazing. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  );
}
