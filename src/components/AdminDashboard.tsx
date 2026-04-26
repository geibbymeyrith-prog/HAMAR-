import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  X, 
  Clock, 
  ExternalLink, 
  MessageCircle, 
  ArrowLeft,
  Calendar,
  User,
  Package as PackageIcon,
  Search,
  Filter
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDoc,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useAuth } from '../lib/AuthContext';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface Payment {
  id: string;
  userId: string;
  name: string;
  email: string;
  whatsapp: string;
  package: string;
  packageName: string;
  uniqueAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
}

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { isAdmin } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    let q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
    
    if (filter === 'pending') {
      q = query(collection(db, 'payments'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const paymentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[];
      setPayments(paymentData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, filter]);

  const handleApprove = async (payment: Payment) => {
    try {
      const paymentRef = doc(db, 'payments', payment.id);
      const userRef = doc(db, 'users', payment.userId);

      // 1. Update payment status
      await updateDoc(paymentRef, { status: 'approved', updatedAt: serverTimestamp() });

      // 2. Update user status based on package
      const now = new Date();
      if (payment.package === '11000') {
        await updateDoc(userRef, { temporaryUnlock: true });
      } else if (payment.package === '111000') {
        const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await updateDoc(userRef, { 
          subscriptionStatus: 'monthly',
          premiumExpiredAt: expiry,
          temporaryUnlock: false 
        });
      } else if (payment.package === '1111000') {
        const expiry = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        await updateDoc(userRef, { 
          subscriptionStatus: 'yearly',
          premiumExpiredAt: expiry,
          temporaryUnlock: false 
        });
      }
      
      alert(`Pembayaran ${payment.name} berhasil disetujui!`);
    } catch (error) {
      console.error("Error approving payment:", error);
      alert("Gagal menyetujui pembayaran.");
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!confirm("Yakin ingin menolak pembayaran ini?")) return;
    try {
      const paymentRef = doc(db, 'payments', paymentId);
      await updateDoc(paymentRef, { status: 'rejected', updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("Gagal menolak pembayaran.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <X className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Akses Ditolak</h1>
        <p className="text-stone-500">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
        <Button onClick={onBack} className="mt-6">Kembali</Button>
      </div>
    );
  }

  const filteredPayments = payments.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.uniqueAmount.toString().includes(searchTerm)
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">Admin Dashboard</h1>
            <p className="text-sm text-stone-500">Verifikasi pembayaran manual pengguna</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-stone-100">
            {payments.length} Pesanan
          </Badge>
          <div className="flex bg-stone-100 p-1 rounded-lg">
            <Button 
              size="sm" 
              variant={filter === 'pending' ? 'default' : 'ghost'} 
              className="h-8 rounded-md"
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'all' ? 'default' : 'ghost'} 
              className="h-8 rounded-md"
              onClick={() => setFilter('all')}
            >
              Semua
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-stone-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input 
            placeholder="Cari nama, email, atau nominal..." 
            className="pl-10 border-none bg-transparent focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="sm" className="hidden md:flex gap-2 text-stone-500">
          <Filter className="w-4 h-4" /> Filter
        </Button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="p-20 text-center text-stone-400">Loading data...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-20 text-center bg-stone-50 rounded-2xl border-2 border-dashed border-stone-200">
            <Clock className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-stone-500">Tidak ada pembayaran ditemukan</p>
          </div>
        ) : (
          filteredPayments.map((payment) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={payment.id}
            >
              <Card className="overflow-hidden border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            {payment.name}
                            <Badge className={cn(
                              payment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                              payment.status === 'approved' ? 'bg-green-100 text-green-700' :
                              'bg-red-100 text-red-700'
                            )}>
                              {payment.status.toUpperCase()}
                            </Badge>
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-stone-500">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {payment.email}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {payment.whatsapp}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {payment.createdAt ? format(payment.createdAt.toDate(), 'dd MMM yyyy, HH:mm') : '-'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Unique Amount</p>
                          <p className="text-xl font-mono font-bold text-stone-900">Rp {payment.uniqueAmount.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                      
                      <div className="bg-stone-50 p-3 rounded-lg flex items-center justify-between border border-stone-100">
                        <div className="flex items-center gap-3">
                          <div className="bg-stone-900 text-white p-2 rounded-lg">
                            <PackageIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-stone-400 uppercase font-bold">Paket Terpilih</p>
                            <p className="font-bold text-sm">{payment.packageName}</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-[#25D366] font-bold text-xs hover:bg-[#25D366]/10"
                          asChild
                        >
                          <a href={`https://wa.me/${payment.whatsapp.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer">
                            Chat WA <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </div>
                    
                    {payment.status === 'pending' && (
                      <div className="bg-stone-50 border-t md:border-t-0 md:border-l border-stone-200 p-6 flex flex-row md:flex-col justify-center gap-3 md:w-48">
                        <Button 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold"
                          onClick={() => handleApprove(payment)}
                        >
                          <Check className="w-4 h-4 mr-2" /> Approve
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 font-bold"
                          onClick={() => handleReject(payment.id)}
                        >
                          <X className="w-4 h-4 mr-2" /> Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
