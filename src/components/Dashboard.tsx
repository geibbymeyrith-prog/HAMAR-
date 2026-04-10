import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth, handleFirestoreError, OperationType } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar, Heart, Sun, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export function MemberDashboard() {
  const { t } = useTranslation();
  const { profile, user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      try {
        const q = query(
          collection(db, 'calculations'), 
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'calculations');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'calculations', id));
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `calculations/${id}`);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-xl bg-gradient-to-br from-stone-900 to-stone-800 text-white overflow-hidden">
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-serif">{t('dashboard.greeting')}, {profile?.displayName}</CardTitle>
              <CardDescription className="text-stone-400">
                {t('dashboard.status')}: <span className="text-[#FBC02D] font-bold uppercase">{profile?.subscriptionStatus} {t('dashboard.member')}</span>
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-xs text-stone-400 uppercase tracking-widest">{t('dashboard.waConsultation')}</p>
              <p className="text-2xl font-bold">{profile?.subscriptionStatus === 'free' ? 0 : 1} {t('dashboard.available')}</p>
            </div>
          </div>
        </CardHeader>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBC02D]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-serif font-bold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#2E7D32]" /> {t('dashboard.history')}
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
            {history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-none shadow-md bg-white hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        item.type === 'weton' ? "bg-blue-100 text-blue-600" :
                        item.type === 'jodoh' ? "bg-pink-100 text-pink-600" :
                        "bg-green-100 text-green-600"
                      )}>
                        {item.type === 'weton' ? <Calendar className="w-5 h-5" /> :
                         item.type === 'jodoh' ? <Heart className="w-5 h-5" /> :
                         <Sun className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-stone-800 capitalize">{item.type} Jawa</p>
                        <p className="text-xs text-stone-400">
                          {item.createdAt?.toDate ? format(item.createdAt.toDate(), 'd MMM yyyy, HH:mm') : 'Baru saja'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-stone-400 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-stone-600 border-stone-200">
                        {t('common.view')} <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {history.length === 0 && !loading && (
            <div className="py-12 text-center text-stone-400 italic bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
              {t('dashboard.noHistory')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
