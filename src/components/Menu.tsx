import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Utensils, Star, Search, Filter, ShoppingBag } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isSpeciality: boolean;
}

export default function Menu({ isHomepage = false }: { isHomepage?: boolean }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'menuItems'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'menuItems'));

    return () => unsubscribe();
  }, []);

  const categories = ['All', 'Food', 'Juice', 'Dessert', 'Special'];

  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'All' || item.category === filter;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className={`${isHomepage ? 'py-20' : 'min-h-screen'} flex items-center justify-center bg-brand-light`}>
        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`${isHomepage ? 'pb-20' : 'pt-32 pb-20 min-h-screen'} bg-brand-light px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 text-brand-red rounded-full text-xs font-black uppercase tracking-widest border border-red-100"
          >
            <Utensils className="w-4 h-4" />
            <span>Our Menu</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-sans font-black text-brand-dark tracking-tight"
          >
            Discover Our <br />
            <span className="text-brand-red">Culinary Art</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Explore our curated selection of dishes, crafted with the freshest ingredients and a touch of passion.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white p-6 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all ${
                  filter === cat
                    ? 'bg-brand-red text-white shadow-lg shadow-red-900/20'
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-full focus:ring-2 focus:ring-brand-red outline-none transition-all font-medium text-brand-dark text-sm"
            />
          </div>
        </div>

        {/* Menu Grid - Pinned Cards Presentation */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 pt-10">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              // Deterministic rotation based on index to look organic
              const rotation = index % 2 === 0 ? (index % 3 === 0 ? 2 : -2) : (index % 5 === 0 ? -3 : 3);
              
              // Pin colors
              const pinColors = ['bg-pink-600', 'bg-purple-600', 'bg-red-600', 'bg-rose-500'];
              const pinColor = pinColors[index % pinColors.length];

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0, rotate: rotation }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                  className="relative group cursor-pointer"
                >
                  {/* The Card */}
                  <div 
                    className="bg-[#fdfcfb] rounded-sm p-3 pb-6 text-center shadow-[2px_4px_12px_rgba(0,0,0,0.15)] border border-gray-200/60 flex flex-col h-full relative"
                    style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }}
                  >
                    
                    {/* The Pin */}
                    <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${pinColor} shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-black/10 z-10`} />

                    {/* Image Area */}
                    <div className="w-full aspect-square bg-white shadow-sm overflow-hidden mb-4 relative rounded-sm">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                          <Utensils className="w-10 h-10 text-gray-200" />
                        </div>
                      )}
                      
                      {item.isSpeciality && (
                        <div className="absolute top-2 right-2 p-1.5 bg-amber-400 text-white rounded-full shadow-sm">
                          <Star className="w-3 h-3 fill-white" />
                        </div>
                      )}
                    </div>

                    {/* Text Area */}
                    <div className="space-y-1 flex-1 flex flex-col items-center justify-center">
                      <h3 className="text-lg font-sans text-gray-800 leading-tight">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-brand-red font-bold text-sm">
                          ${item.price.toFixed(2)}
                        </p>
                        <span className="text-gray-300">•</span>
                        <p className="text-gray-400 text-[10px] uppercase tracking-wider">
                          {item.category}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-brand-dark">No dishes found</h3>
            <p className="text-gray-500 font-medium">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
