import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDoc,
  serverTimestamp,
  where,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { useAuth } from '../lib/AuthContext';
import { format } from 'date-fns';
import { cn } from '../lib/utils';
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
  Filter,
  Plus,
  FileText,
  Save,
  Send,
  Trash,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';

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

interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  contentHtml: string;
  visibility: 'public' | 'member';
  status: 'draft' | 'published';
  createdAt: any;
}

import { 
  JAVA_MONTHS,
  PM_ORDERED,
  getJavaDate,
  getPMDate,
  getPasaran,
  getNagadina,
  getDewaHarian,
  getWuku,
  getPadewan,
  getPadangon,
  getSifatHari,
  getNeptu,
  getSTValue,
  checkIs40,
  getJavaneseMonthName,
  getJavaneseYearDetails
} from '../lib/calendar-utils';

export const AdminDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { isAdmin } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeView, setActiveView] = useState<'payments' | 'blog' | 'calendar'>('payments');
  
  // Calendar state
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());

  // Blog form state
  const [isCreating, setIsCreating] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleAuthor, setArticleAuthor] = useState('Geibby Meyrith');
  const [articleContent, setArticleContent] = useState('');
  const [articleVisibility, setArticleVisibility] = useState<'public' | 'member'>('member');

  useEffect(() => {
    if (!isAdmin) return;

    if (activeView === 'payments') {
      let q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
      if (filter === 'pending') {
        q = query(collection(db, 'payments'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
      }
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setPayments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Payment[]);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Article[]);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isAdmin, filter, activeView]);

  const handleApprove = async (payment: Payment) => {
    try {
      const paymentRef = doc(db, 'payments', payment.id);
      const userRef = doc(db, 'users', payment.userId);
      await updateDoc(paymentRef, { status: 'approved', updatedAt: serverTimestamp() });
      const now = new Date();
      if (payment.package === '11000') {
        await updateDoc(userRef, { temporaryUnlock: true });
      } else if (payment.package === '111000') {
        const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        await updateDoc(userRef, { subscriptionStatus: 'monthly', premiumExpiredAt: expiry, temporaryUnlock: false });
      } else if (payment.package === '1111000') {
        const expiry = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        await updateDoc(userRef, { subscriptionStatus: 'yearly', premiumExpiredAt: expiry, temporaryUnlock: false });
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
      await updateDoc(doc(db, 'payments', paymentId), { status: 'rejected', updatedAt: serverTimestamp() });
    } catch (error) {
      console.error("Error rejecting payment:", error);
      alert("Gagal menolak pembayaran.");
    }
  };

  const handleSaveArticle = async (status: 'draft' | 'published') => {
    if (!articleTitle || !articleContent) {
      alert("Judul dan isi artikel wajib diisi!");
      return;
    }
    if (articleContent.length > 1000) {
      alert("Artikel maksimal 1000 karakter!");
      return;
    }

    try {
      const data = {
        title: articleTitle,
        author: articleAuthor,
        content: articleContent,
        contentHtml: articleContent, // Simple for now, could be enhanced
        visibility: articleVisibility,
        status,
        createdAt: editingArticle ? editingArticle.createdAt : serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      if (editingArticle) {
        await updateDoc(doc(db, 'articles', editingArticle.id), data);
      } else {
        await addDoc(collection(db, 'articles'), data);
      }

      setIsCreating(false);
      setEditingArticle(null);
      setArticleTitle('');
      setArticleContent('');
      alert(status === 'draft' ? "Artikel disimpan sebagai draft." : "Artikel berhasil dipublish!");
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Gagal menyimpan artikel.");
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Gagal menghapus artikel.");
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

  return (
    <div className={cn(
      "mx-auto p-4 md:p-8 space-y-8 transition-all duration-300",
      activeView === 'calendar' ? "max-w-[1400px]" : "max-w-6xl"
    )}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-stone-900">Admin Dashboard</h1>
            <p className="text-sm text-stone-500">Kelola pembayaran dan konten blog</p>
          </div>
        </div>
        
        <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="bg-stone-100 p-1 rounded-lg">
          <TabsList className="bg-transparent">
            <TabsTrigger value="payments" className="data-[state=active]:bg-white shadow-none">Pembayaran</TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-white shadow-none">Konten Blog</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-white shadow-none">Database Calendar</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Separator />

      {activeView === 'payments' ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <Input 
                placeholder="Cari nama, email..." 
                className="pl-10 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex bg-stone-100 p-1 rounded-lg">
              <Button size="sm" variant={filter === 'pending' ? 'default' : 'ghost'} onClick={() => setFilter('pending')}>Pending</Button>
              <Button size="sm" variant={filter === 'all' ? 'default' : 'ghost'} onClick={() => setFilter('all')}>Semua</Button>
            </div>
          </div>

          <div className="grid gap-4">
            {loading ? <div className="p-20 text-center">Loading...</div> : payments.length === 0 ? <div className="p-20 text-center text-stone-400">Tidak ada data.</div> : 
              payments.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(payment => (
                <Card key={payment.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row divide-x divide-stone-100">
                    <div className="flex-1 p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg flex items-center gap-2">
                            {payment.name}
                            <Badge className={cn(payment.status === 'pending' ? 'bg-amber-100 text-amber-700' : payment.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                              {payment.status.toUpperCase()}
                            </Badge>
                          </h3>
                          <div className="text-xs text-stone-500 mt-1 flex gap-4">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {payment.email}</span>
                            <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {payment.whatsapp}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-stone-400 uppercase">Total</p>
                          <p className="text-xl font-mono font-bold">Rp {payment.uniqueAmount.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </div>
                    {payment.status === 'pending' && (
                      <div className="bg-stone-50 p-6 flex flex-col gap-2 w-48 justify-center">
                        <Button className="w-full bg-green-600" onClick={() => handleApprove(payment)}><Check className="w-4 h-4 mr-2" /> Approve</Button>
                        <Button variant="outline" className="w-full border-red-200 text-red-600" onClick={() => handleReject(payment.id)}><X className="w-4 h-4 mr-2" /> Reject</Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            }
          </div>
        </div>
      ) : activeView === 'blog' ? (
        <div className="space-y-6">
          {isCreating || editingArticle ? (
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="font-serif">{editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Judul Artikel</Label>
                    <Input value={articleTitle} onChange={e => setArticleTitle(e.target.value)} placeholder="Masukkan judul..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Penulis</Label>
                    <Input value={articleAuthor} onChange={e => setArticleAuthor(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Isi Artikel (Maks 1000 karakter)</Label>
                    <span className="text-[10px] text-stone-400">{articleContent.length}/1000</span>
                  </div>
                  
                  {/* Mock Toolbar */}
                  <div className="flex flex-wrap gap-1 p-2 bg-stone-100 rounded-t-lg border border-stone-200 border-b-0">
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Bold className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><Italic className="w-4 h-4" /></Button>
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <Button variant="ghost" size="icon" className="w-8 h-8"><AlignLeft className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><AlignCenter className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><AlignRight className="w-4 h-4" /></Button>
                    <Separator orientation="vertical" className="h-6 mx-1" />
                    <Button variant="ghost" size="icon" className="w-8 h-8"><List className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><ImageIcon className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8"><LinkIcon className="w-4 h-4" /></Button>
                  </div>
                  
                  <Textarea 
                    value={articleContent} 
                    onChange={e => setArticleContent(e.target.value.slice(0, 1000))} 
                    className="min-h-[300px] rounded-t-none border-stone-200"
                    placeholder="Tulis artikel di sini..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Visibilitas</Label>
                    <Select value={articleVisibility} onValueChange={(v: any) => setArticleVisibility(v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih target" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Umum (Beranda)</SelectItem>
                        <SelectItem value="member">Member Saja</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => { setIsCreating(false); setEditingArticle(null); }}>Batal</Button>
                  <Button variant="outline" className="flex-1 gap-2" onClick={() => handleSaveArticle('draft')}><Save className="w-4 h-4" /> Simpan Draft</Button>
                  <Button className="flex-1 bg-[#2E7D32] gap-2" onClick={() => handleSaveArticle('published')}><Send className="w-4 h-4" /> Publish</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <Input placeholder="Cari artikel..." className="pl-10" />
                </div>
                <Button className="bg-[#2E7D32] gap-2" onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4" /> Tulis Artikel
                </Button>
              </div>

              <div className="grid gap-4">
                {articles.length === 0 ? <div className="p-20 text-center text-stone-400">Belum ada artikel.</div> : articles.map(article => (
                  <Card key={article.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{article.title}</h3>
                          <Badge variant="outline" className={cn(article.status === 'published' ? 'border-green-200 text-green-700' : 'border-stone-200 text-stone-500')}>
                            {article.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-stone-500">
                          Oleh {article.author} • {article.createdAt ? format(article.createdAt.toDate(), 'dd MMM yyyy, HH:mm') : '-'}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge className="bg-stone-100 text-stone-700 hover:bg-stone-100">
                            {article.visibility === 'public' ? 'Umum' : 'Member Only'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingArticle(article);
                          setArticleTitle(article.title);
                          setArticleContent(article.content);
                          setArticleAuthor(article.author);
                          setArticleVisibility(article.visibility);
                        }}>
                          <FileText className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteArticle(article.id)}>
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6 pb-20">
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-stone-100 mb-4">
              <div>
                <CardTitle className="font-serif text-2xl text-stone-800">
                  {getJavaneseMonthName(calendarMonth)}, {getJavaneseYearDetails(calendarYear).year} {getJavaneseYearDetails(calendarYear).name} ({new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(calendarYear, calendarMonth))}, {calendarYear})
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Select value={calendarYear.toString()} onValueChange={v => setCalendarYear(parseInt(v))}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Tahun" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {Array.from({ length: 2200 - 1582 + 1 }, (_, i) => 1582 + i).map(y => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={calendarMonth.toString()} onValueChange={v => setCalendarMonth(parseInt(v))}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Bulan" />
                  </SelectTrigger>
                  <SelectContent>
                    {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => (
                      <SelectItem key={i} value={i.toString()}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border border-stone-200">
                <table className="w-full text-left border-collapse table-auto">
                  <thead>
                    {(() => {
                      const PM_INFO_DETAILS = [
                        { mStart: 5, mEnd: 7, text: "Kasa - Kartika || 41 Hari || Bathara Wisnu || Domba || Sapi Gumarang" },
                        { mStart: 7, mEnd: 7, text: "Pusa - Karo || 23 hari || Bathara Sambu || Banteng || Tagih" },
                        { mStart: 7, mEnd: 8, text: "Katelu - Manggasri || 24 Hari || Bathara Rudra || Kehidupan Tanaman Tumbuh Bertunas || Lumbung" },
                        { mStart: 8, mEnd: 9, text: "Kapat - Sitra | 25 Hari || Bathara Nyamadipati || Kepiting || Jaran Dawuk" },
                        { mStart: 9, mEnd: 10, text: "Kalima - Manggala || 27 Hari || Bathara Metri || Singa || Banyak Angrem" },
                        { mStart: 10, mEnd: 11, text: "Kanem - Naya || 43 Hari || Bathara Guru || Perempuan Roro Kenya || Gotong Mayit" },
                        { mStart: 11, mEnd: 1, text: "Palguna - Kapitu || 43 Hari || Bathara Indra || Neraca Keseimbangan || Bimasekti" },
                        { mStart: 1, mEnd: 1, text: "Wasika - Kawolu || 25 Hari || Bathara Brahma || Kelabang || Wulanjar Angirian" },
                        { mStart: 2, mEnd: 2, text: "Jita - Kasanga || 25 Hari || Bathara Bayu || Garuda || Wuluh" },
                        { mStart: 2, mEnd: 3, text: "Srawana - Kasedasa || 24 Hari || Rsi Bisma || Kambing || Waluku" },
                        { mStart: 3, mEnd: 4, text: "Destha - Padrawana || 23 Hari || Bathara Antaboga || Air Tertumpah" },
                        { mStart: 4, mEnd: 5, text: "Sadda - Asuji || 41 Hari || Bathari Sri || Mino" },
                      ];
                      
                      const active = PM_INFO_DETAILS.filter(pm => {
                        if (pm.mStart <= pm.mEnd) {
                          return calendarMonth >= pm.mStart && calendarMonth <= pm.mEnd;
                        } else {
                          return calendarMonth >= pm.mStart || calendarMonth <= pm.mEnd;
                        }
                      });

                      return active.map((pm, idx) => (
                        <tr key={`pm-header-${idx}`} className="bg-[#211e1d] text-white border-b border-stone-800">
                          <th colSpan={16} className="p-1 px-4 text-[9px] font-bold text-center tracking-wide uppercase">
                            {pm.text}
                          </th>
                        </tr>
                      ));
                    })()}
                    <tr className="bg-[#211e1d] text-[6.5px] font-bold uppercase tracking-tighter text-white border-b border-stone-200">
                      <th className="p-0.5 w-6 text-center">40</th>
                      <th className="p-0.5 w-6 text-center">S/T</th>
                      <th className="p-0.5 w-6 text-center">Tgl</th>
                      <th className="p-0.5 text-center">Hari</th>
                      <th className="p-0.5 text-center">Jawa</th>
                      <th className="p-0.5 text-center">Bulan Jawa</th>
                      <th className="p-0.5 text-center">Pranata Mangsa</th>
                      <th className="p-0.5 text-center">Tgl PM</th>
                      <th className="p-0.5 text-center">Pasaran</th>
                      <th className="p-0.5 text-center">Neptu</th>
                      <th className="p-0.5 text-center">Nagadina</th>
                      <th className="p-0.5 text-center">Dewa Harian</th>
                      <th className="p-0.5 text-center">Sifat Hari</th>
                      <th className="p-0.5 text-center">Wuku</th>
                      <th className="p-0.5 text-center">Padewan</th>
                      <th className="p-0.5 text-center">Padangon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 uppercase">
                    {(() => {
                      const daysInMonthResult = new Date(calendarYear, calendarMonth + 1, 0).getDate();
                      const rows = [];
                      for (let i = 1; i <= daysInMonthResult; i++) {
                        const date = new Date(calendarYear, calendarMonth, i);
                        const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(date);
                        const java = getJavaDate(date);
                        const pm = getPMDate(date);
                        const pasaran = getPasaran(date);
                        const neptu = getNeptu(dayName, pasaran);
                        const nagaDina = getNagadina(neptu);
                        const dewaHarian = getDewaHarian(nagaDina);
                        const sifatHari = getSifatHari(date);
                        const wuku = getWuku(date);
                        const padewan = getPadewan(date);
                        const padangon = getPadangon(date);
                        
                        // Perhitungan background color setiap 3 hari sekali
                        const refBase = new Date(2025, 1, 3); // 3 Feb 2025
                        const diffDays3Val = Math.round((date.getTime() - refBase.getTime()) / (1000 * 60 * 60 * 24));
                        let mod3 = diffDays3Val % 3;
                        if (mod3 < 0) mod3 += 3;
                        const isThirdDay = mod3 === 0;
                        
                        const stValue = getSTValue(java.day);
                        const is40 = checkIs40(dayName, pasaran);
                        const fortyValue = is40 ? '40' : '';
                        
                        rows.push(
                          <tr key={i} className={cn(
                            "transition-colors text-[6.5px] leading-none",
                            isThirdDay ? "bg-[#928f8e]" : "bg-white",
                            "hover:opacity-80"
                          )}>
                            <td className="p-0.5 font-mono text-black font-bold text-center">{fortyValue}</td>
                            <td className="p-0.5 font-mono text-black font-bold text-center">{stValue}</td>
                            <td className="p-0.5 font-mono text-black font-bold text-center">{i}</td>
                            <td className={cn(
                              "p-0.5 font-serif font-bold whitespace-nowrap",
                              dayName === 'Minggu' ? "text-red-600" : "text-black"
                            )}>{dayName}</td>
                            <td className="p-0.5 font-mono text-black font-bold text-center">{java.day}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{java.month}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{pm.name}</td>
                            <td className="p-0.5 font-mono font-bold text-black text-center">{pm.day}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{pasaran}</td>
                            <td className="p-0.5 font-mono font-bold text-black text-center">{neptu}</td>
                            <td className={cn(
                              "p-0.5 font-serif font-bold border-x border-stone-100 text-center",
                              nagaDina === 'Utara' && "bg-black text-white",
                              nagaDina === 'Selatan' && "bg-yellow-300 text-black",
                              nagaDina === 'Barat' && "bg-red-500 text-black",
                              nagaDina === 'Timur' && (isThirdDay ? "bg-[#928f8e] text-black" : "bg-white text-black")
                            )}>{nagaDina}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{dewaHarian}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{sifatHari}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{wuku}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap">{padewan}</td>
                            <td className="p-0.5 font-serif font-bold text-black whitespace-nowrap text-center">{padangon}</td>
                          </tr>
                        );
                      }
                      return rows;
                    })()}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex justify-between items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-100">
                <Button 
                  variant="outline" 
                  disabled={calendarYear === 1582 && calendarMonth === 0}
                  onClick={() => {
                    if (calendarMonth === 0) {
                      setCalendarYear(v => v - 1);
                      setCalendarMonth(11);
                    } else {
                      setCalendarMonth(v => v - 1);
                    }
                  }}
                >
                  Bulan Sebelumnya
                </Button>
                <span className="text-xs font-bold text-stone-400">PAGE {calendarMonth + 1} / 12 ({calendarYear})</span>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    if (calendarMonth === 11) {
                      setCalendarYear(v => v + 1);
                      setCalendarMonth(0);
                    } else {
                      setCalendarMonth(v => v + 1);
                    }
                  }}
                >
                  Bulan Berikutnya
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
