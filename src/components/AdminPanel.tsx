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
    <div className="pt-24 pb-20 min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
              <p className="text-gray-500">Manage your restaurant's content</p>
            </div>
          </div>

          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            <button
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'menu' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Utensils className="w-5 h-5" />
              Menu Items
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'offers' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Gift className="w-5 h-5" />
              Offers
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <motion.div
              layout
              className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-28"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                {isEditing ? <Edit2 className="w-5 h-5 text-emerald-600" /> : <Plus className="w-5 h-5 text-emerald-600" />}
                {isEditing ? 'Edit Item' : `Add New ${activeTab === 'menu' ? 'Menu Item' : 'Offer'}`}
              </h2>

              <form onSubmit={activeTab === 'menu' ? handleMenuSubmit : handleOfferSubmit} className="space-y-6">
                {activeTab === 'menu' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <Tag className="w-4 h-4" /> Name
                      </label>
                      <input
                        required
                        value={menuForm.name}
                        onChange={e => setMenuForm({ ...menuForm, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        placeholder="e.g., Grilled Salmon"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" /> Price
                        </label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          value={menuForm.price}
                          onChange={e => setMenuForm({ ...menuForm, price: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                          placeholder="12.99"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Category</label>
                        <select
                          value={menuForm.category}
                          onChange={e => setMenuForm({ ...menuForm, category: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        >
                          <option>Food</option>
                          <option>Juice</option>
                          <option>Dessert</option>
                          <option>Special</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4" /> Image URL
                      </label>
                      <input
                        value={menuForm.imageUrl}
                        onChange={e => setMenuForm({ ...menuForm, imageUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Description</label>
                      <textarea
                        value={menuForm.description}
                        onChange={e => setMenuForm({ ...menuForm, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none h-24 resize-none"
                        placeholder="Describe the dish..."
                      />
                    </div>
                    <label className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={menuForm.isSpeciality}
                        onChange={e => setMenuForm({ ...menuForm, isSpeciality: e.target.checked })}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="font-bold text-emerald-900 flex items-center gap-2">
                        <Star className={`w-4 h-4 ${menuForm.isSpeciality ? 'fill-emerald-600' : ''}`} />
                        Mark as Speciality
                      </span>
                    </label>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Offer Title</label>
                      <input
                        required
                        value={offerForm.title}
                        onChange={e => setOfferForm({ ...offerForm, title: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        placeholder="e.g., Weekend Special"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Discount</label>
                      <input
                        required
                        value={offerForm.discount}
                        onChange={e => setOfferForm({ ...offerForm, discount: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        placeholder="e.g., 20% OFF"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Image URL</label>
                      <input
                        value={offerForm.imageUrl}
                        onChange={e => setOfferForm({ ...offerForm, imageUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        placeholder="https://..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Description</label>
                      <textarea
                        value={offerForm.description}
                        onChange={e => setOfferForm({ ...offerForm, description: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all outline-none h-24 resize-none"
                        placeholder="Offer details..."
                      />
                    </div>
                    <label className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={offerForm.isActive}
                        onChange={e => setOfferForm({ ...offerForm, isActive: e.target.checked })}
                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="font-bold text-emerald-900">Active Offer</span>
                    </label>
                  </>
                )}

                <div className="flex gap-4">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(null);
                        setMenuForm({ name: '', description: '', price: '', category: 'Food', imageUrl: '', isSpeciality: false });
                        setOfferForm({ title: '', description: '', discount: '', imageUrl: '', isActive: true });
                      }}
                      className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                  >
                    {isEditing ? 'Save Changes' : 'Add Item'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {(activeTab === 'menu' ? menuItems : offers).map((item: any) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-6 items-center group hover:shadow-md transition-all"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name || item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 truncate text-lg">{item.name || item.title}</h3>
                      {activeTab === 'menu' && item.isSpeciality && (
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      )}
                      {activeTab === 'offers' && (
                        item.isActive ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">{item.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {item.category || item.discount}
                      </span>
                      {item.price && (
                        <span className="font-bold text-gray-900">${item.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                      className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ id: item.id, type: activeTab === 'menu' ? 'menuItems' : 'offers' })}
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {(activeTab === 'menu' ? menuItems : offers).length === 0 && (
              <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No items found. Add your first one!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center space-y-6"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <Trash2 className="w-10 h-10 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">Are you sure?</h3>
                <p className="text-gray-500">This action cannot be undone. This item will be permanently removed.</p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
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
