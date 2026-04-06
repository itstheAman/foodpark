import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Tag, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  imageUrl: string;
  isActive: boolean;
}

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'offers'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'offers'));

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
            <Sparkles className="w-4 h-4" />
            <span>Limited Time Deals</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-7xl font-sans font-black text-brand-dark tracking-tight"
          >
            Exclusive <span className="text-brand-red">Foody Deals</span>
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Grab our special deals and enjoy your favorite food and juices at unbeatable prices.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <AnimatePresence mode="popLayout">
            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative bg-white rounded-[3rem] overflow-hidden shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all duration-500 border border-gray-50 flex flex-col"
              >
                <div className="relative h-80 overflow-hidden">
                  {offer.imageUrl ? (
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                      <Gift className="w-16 h-16 text-gray-200" />
                    </div>
                  )}
                  <div className="absolute top-8 left-8">
                    <div className="px-8 py-4 bg-brand-red text-white rounded-2xl font-black text-3xl shadow-2xl shadow-red-900/40 border-4 border-white">
                      {offer.discount}
                    </div>
                  </div>
                </div>

                <div className="p-12 space-y-8 flex-1 flex flex-col">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-brand-red font-black text-[10px] uppercase tracking-[0.2em]">
                      <Tag className="w-3 h-3" />
                      Limited Offer
                    </div>
                    <h3 className="text-3xl font-sans font-black text-brand-dark leading-tight group-hover:text-brand-red transition-colors">
                      {offer.title}
                    </h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                      {offer.description || 'Enjoy this exclusive deal on our premium menu items. Valid for a limited time only.'}
                    </p>
                  </div>

                  <div className="pt-6 mt-auto space-y-6">
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5" />
                      Valid until supplies last
                    </div>
                    <button className="w-full py-5 bg-brand-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-red transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-3 group/btn">
                      Claim Offer
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {offers.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-black text-brand-dark">No active offers</h3>
            <p className="text-gray-500 font-medium">Check back later for exciting new deals!</p>
          </div>
        )}
      </div>
    </div>
  );
}
