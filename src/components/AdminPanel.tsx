import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { Plus, Edit2, Trash2, Image as ImageIcon, DollarSign, Tag, Star, CheckCircle2, XCircle, LayoutDashboard, Utensils, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isSpeciality: boolean;
  createdAt: any;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: any;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'menu' | 'offers'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const navigate = useNavigate();

  // Form States
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Food',
    imageUrl: '',
    isSpeciality: false
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    discount: '',
    imageUrl: '',
    isActive: true
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (!user || user.email !== 'microflicker@gmail.com') {
      navigate('/login');
      return;
    }

    const qMenu = query(collection(db, 'menuItems'), orderBy('createdAt', 'desc'));
    const unsubscribeMenu = onSnapshot(qMenu, (snapshot) => {
      setMenuItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'menuItems'));

    const qOffers = query(collection(db, 'offers'), orderBy('createdAt', 'desc'));
    const unsubscribeOffers = onSnapshot(qOffers, (snapshot) => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Offer)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'offers'));

    return () => {
      unsubscribeMenu();
      unsubscribeOffers();
    };
  }, [navigate]);

  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...menuForm,
        price: parseFloat(menuForm.price),
        createdAt: Timestamp.now()
      };

      if (isEditing) {
        await updateDoc(doc(db, 'menuItems', isEditing), data);
        setIsEditing(null);
      } else {
        await addDoc(collection(db, 'menuItems'), data);
      }
      setMenuForm({ name: '', description: '', price: '', category: 'Food', imageUrl: '', isSpeciality: false });
    } catch (err) {
      handleFirestoreError(err, isEditing ? OperationType.UPDATE : OperationType.CREATE, 'menuItems');
    }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...offerForm,
        createdAt: Timestamp.now()
      };

      if (isEditing) {
        await updateDoc(doc(db, 'offers', isEditing), data);
        setIsEditing(null);
      } else {
        await addDoc(collection(db, 'offers'), data);
      }
      setOfferForm({ title: '', description: '', discount: '', imageUrl: '', isActive: true });
    } catch (err) {
      handleFirestoreError(err, isEditing ? OperationType.UPDATE : OperationType.CREATE, 'offers');
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, type: 'menuItems' | 'offers' } | null>(null);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteDoc(doc(db, deleteConfirm.type, deleteConfirm.id));
      setDeleteConfirm(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, deleteConfirm.type);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen bg-earth-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-8 rounded-[3rem] shadow-xl shadow-red-900/5 border border-red-50">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-red-700 rounded-[1.5rem] shadow-2xl shadow-red-900/20">
              <LayoutDashboard className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-sans font-black text-red-950 tracking-tighter">Admin Dashboard</h1>
              <p className="text-earth-500 font-medium">Manage your forest's bounty</p>
            </div>
          </div>

          <div className="flex bg-earth-50 p-1.5 rounded-2xl border border-red-100">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                activeTab === 'menu' ? 'bg-red-700 text-white shadow-xl shadow-red-900/20' : 'text-earth-500 hover:bg-earth-100'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Menu Items
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-2 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                activeTab === 'offers' ? 'bg-red-700 text-white shadow-xl shadow-red-900/20' : 'text-earth-500 hover:bg-earth-100'
              }`}
            >
              <Gift className="w-4 h-4" />
              Offers
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <motion.div
              layout
              className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-red-900/5 border border-red-50 sticky top-32"
            >
              <h2 className="text-2xl font-sans font-black text-red-950 mb-8 flex items-center gap-3">
                {isEditing ? <Edit2 className="w-6 h-6 text-brand-red" /> : <Plus className="w-6 h-6 text-brand-red" />}
                {isEditing ? 'Edit Item' : `Add New ${activeTab === 'menu' ? 'Menu Item' : 'Offer'}`}
              </h2>

              <form onSubmit={activeTab === 'menu' ? handleMenuSubmit : handleOfferSubmit} className="space-y-8">
                {activeTab === 'menu' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-4">Item Name</label>
                      <input
                        required
                        value={menuForm.name}
                        onChange={e => setMenuForm({ ...menuForm, name: e.target.value })}
                        className="w-full px-6 py-4 bg-earth-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none font-medium text-red-950"
                        placeholder="e.g., Grilled Salmon"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-4">Price ($)</label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          value={menuForm.price}
                          onChange={e => setMenuForm({ ...menuForm, price: e.target.value })}
                          className="w-full px-6 py-4 bg-earth-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none font-medium text-red-950"
                          placeholder="12.99"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-4">Category</label>
                        <select
                          value={menuForm.category}
                          onChange={e => setMenuForm({ ...menuForm, category: e.target.value })}
                          className="w-full px-6 py-4 bg-earth-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none font-black uppercase tracking-widest text-[10px] text-red-950"
                        >
                          <option>Food</option>
                          <option>Juice</option>
                          <option>Dessert</option>
                          <option>Special</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-4">Image URL</label>
                      <input
                        value={menuForm.imageUrl}
                        onChange={e => setMenuForm({ ...menuForm, imageUrl: e.target.value })}
                        className="w-full px-6 py-4 bg-earth-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none font-medium text-red-950"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-4">Description</label>
                      <textarea
                        value={menuForm.description}
                        onChange={e => setMenuForm({ ...menuForm, description: e.target.value })}
                        className="w-full px-6 py-4 bg-earth-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none h-32 resize-none font-medium text-red-950"
                        placeholder="Describe the dish..."
                      />
                    </div>
                    <label className="flex items-center gap-4 p-5 bg-red-50 rounded-[1.5rem] border border-red-100 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={menuForm.isSpeciality}
                        onChange={e => setMenuForm({ ...menuForm, isSpeciality: e.target.checked })}
                        className="w-6 h-6 text-red-700 rounded-lg focus:ring-red-500 border-red-200"
                      />
                      <span className="font-black text-red-900 flex items-center gap-2 uppercase tracking-widest text-xs">
                        <Star className={`w-4 h-4 ${menuForm.isSpeciality ? 'fill-brand-red text-brand-red' : 'text-red-300'}`} />
                        Mark as Speciality
                      </span>
                    </label>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-4">Offer Title</label>
                      <input
                        required
                        value={offerForm.title}
                        onChange={e => setOfferForm({ ...offerForm, title: e.target.value })}
                        className="w-full px-6 py-4 bg-earth-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none font-medium text-red-950"
                        placeholder="e.g., Weekend Special"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-4">Discount</label>
                      <input
                        required
                        value={offerForm.discount}
                        onChange={e => setOfferForm({ ...offerForm, discount: e.target.value })}
                        className="w-full px-6 py-4 bg-earth-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none font-medium text-red-950"
                        placeholder="e.g., 20% OFF"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-4">Image URL</label>
                      <input
                        value={offerForm.imageUrl}
                        onChange={e => setOfferForm({ ...offerForm, imageUrl: e.target.value })}
                        className="w-full px-6 py-4 bg-earth-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none font-medium text-red-950"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-400 ml-4">Description</label>
                      <textarea
                        value={offerForm.description}
                        onChange={e => setOfferForm({ ...offerForm, description: e.target.value })}
                        className="w-full px-6 py-4 bg-earth-50 border border-red-100 rounded-2xl focus:ring-2 focus:ring-red-500 transition-all outline-none h-32 resize-none font-medium text-red-950"
                        placeholder="Offer details..."
                      />
                    </div>
                    <label className="flex items-center gap-4 p-5 bg-red-50 rounded-[1.5rem] border border-red-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={offerForm.isActive}
                        onChange={e => setOfferForm({ ...offerForm, isActive: e.target.checked })}
                        className="w-6 h-6 text-red-700 rounded-lg focus:ring-red-500 border-red-200"
                      />
                      <span className="font-black text-red-900 uppercase tracking-widest text-xs">Active Offer</span>
                    </label>
                  </>
                )}

                <div className="flex gap-4 pt-4">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(null);
                        setMenuForm({ name: '', description: '', price: '', category: 'Food', imageUrl: '', isSpeciality: false });
                        setOfferForm({ title: '', description: '', discount: '', imageUrl: '', isActive: true });
                      }}
                      className="flex-1 py-5 bg-earth-50 text-earth-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-earth-100 transition-all border border-red-100"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-[2] py-5 bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-800 transition-all shadow-xl shadow-red-900/20"
                  >
                    {isEditing ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="popLayout">
              {(activeTab === 'menu' ? menuItems : offers).map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-8 rounded-[3rem] shadow-sm border border-red-50 flex flex-col sm:flex-row gap-8 items-center group hover:shadow-2xl transition-all"
                >
                  <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-earth-50 flex-shrink-0 border border-red-100 shadow-inner">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name || item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-red-200">
                        <ImageIcon className="w-10 h-10" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                      <h3 className="font-sans font-black text-red-950 truncate text-2xl leading-tight">{item.name || item.title}</h3>
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        {activeTab === 'menu' && item.isSpeciality && (
                          <Star className="w-5 h-5 text-brand-red fill-brand-red" />
                        )}
                        {activeTab === 'offers' && (
                          item.isActive ? <CheckCircle2 className="w-5 h-5 text-brand-red" /> : <XCircle className="w-5 h-5 text-earth-300" />
                        )}
                      </div>
                    </div>
                    <p className="text-earth-500 font-medium line-clamp-1 mb-4">{item.description}</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                      <span className="px-4 py-1.5 bg-red-50 text-red-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                        {item.category || item.discount}
                      </span>
                      {item.price && (
                        <span className="font-black text-red-900 text-xl tracking-tighter">${item.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setIsEditing(item.id);
                        if (activeTab === 'menu') {
                          setMenuForm({
                            name: item.name,
                            description: item.description || '',
                            price: item.price.toString(),
                            category: item.category,
                            imageUrl: item.imageUrl || '',
                            isSpeciality: item.isSpeciality
                          });
                        } else {
                          setOfferForm({
                            title: item.title,
                            description: item.description || '',
                            discount: item.discount,
                            imageUrl: item.imageUrl || '',
                            isActive: item.isActive
                          });
                        }
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-4 bg-red-50 text-brand-red rounded-2xl hover:bg-brand-red hover:text-white transition-all shadow-sm"
                    >
                      <Edit2 className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ id: item.id, type: activeTab === 'menu' ? 'menuItems' : 'offers' })}
                      className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {(activeTab === 'menu' ? menuItems : offers).length === 0 && (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-red-100">
                <div className="w-20 h-20 bg-earth-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="w-10 h-10 text-red-200" />
                </div>
                <p className="text-earth-500 font-black uppercase tracking-widest text-xs">No items found. Add your first one!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-red-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-sm w-full text-center space-y-8 border border-red-50"
            >
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-12 h-12 text-red-600" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-sans font-black text-red-950 leading-tight">Are you sure?</h3>
                <p className="text-earth-500 font-medium">This action cannot be undone. This item will be permanently removed from the forest.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-5 bg-earth-50 text-earth-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-earth-100 transition-all border border-red-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-xl shadow-red-900/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
