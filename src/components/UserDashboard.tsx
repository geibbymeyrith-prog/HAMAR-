import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  History, 
  FileText, 
  Settings, 
  ArrowLeft, 
  Save, 
  Calendar, 
  MessageCircle, 
  Mail,
  ChevronRight,
  Clock,
  ExternalLink,
  Shield,
  Check
} from 'lucide-react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { useAuth } from '../lib/AuthContext';
import { format } from 'date-fns';
import { cn } from '../lib/utils';

interface HistoryItem {
  id: string;
  type: 'weton' | 'jodoh' | 'hariBaik';
  label: string;
  details: any;
  createdAt: any;
}

interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: any;
}

const PRANATA_MANGSA_WA_NUMBER = "6281299996816";

const PricingCard: React.FC<{
  title: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  onSelect: () => void;
}> = ({ title, price, period, features, isPopular, onSelect }) => (
  <div className={cn(
    "relative p-6 rounded-2xl border flex flex-col transition-all overflow-hidden",
    isPopular ? "border-[#2E7D32] bg-[#2E7D32]/5 shadow-lg" : "border-stone-200 bg-white shadow-sm"
  )}>
    {isPopular && (
      <div className="absolute top-0 right-0 bg-[#2E7D32] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest">
        REKOMENDASI
      </div>
    )}
    <div className="mb-6">
      <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1">{title}</h4>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-serif font-bold text-stone-900">Rp {price}</span>
        <span className="text-xs text-stone-500">/{period}</span>
      </div>
    </div>
    <ul className="space-y-3 mb-8 flex-1">
      {features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-stone-600">
          <Check className="w-3.5 h-3.5 text-[#2E7D32] shrink-0 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Button 
      className={cn(
        "w-full h-11 rounded-xl font-bold transition-all",
        isPopular ? "bg-[#2E7D32] hover:bg-[#1B5E20] text-white" : "bg-stone-900 hover:bg-stone-800 text-white"
      )}
      onClick={onSelect}
    >
      Pilih Paket
    </Button>
  </div>
);

export const UserDashboard: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, updateProfile } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile local state
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [whatsapp, setWhatsapp] = useState(profile?.whatsapp || '');
  const [birthDay, setBirthDay] = useState(profile?.birthDate?.day || '');
  const [birthMonth, setBirthMonth] = useState(profile?.birthDate?.month || '');
  const [birthYear, setBirthYear] = useState(profile?.birthDate?.year || '');

  useEffect(() => {
    if (!profile) return;

    // Load History
    const hq = query(
      collection(db, 'history'), 
      where('userId', '==', profile.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeHistory = onSnapshot(hq, (snapshot) => {
      setHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as HistoryItem[]);
    });

    // Load Member Articles
    const aq = query(
      collection(db, 'articles'),
      where('visibility', '==', 'member'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeArticles = onSnapshot(aq, (snapshot) => {
      setArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Article[]);
      setLoading(false);
    });

    return () => {
      unsubscribeHistory();
      unsubscribeArticles();
    };
  }, [profile]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        fullName,
        whatsapp,
        birthDate: {
          day: birthDay,
          month: birthMonth,
          year: birthYear
        }
      });
      alert("Profil berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Gagal memperbarui profil.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Dashboard Saya</h1>
          <p className="text-sm text-stone-500">Kelola riwayat dan informasi pribadi Anda</p>
        </div>
      </div>

      <Tabs defaultValue="history" className="space-y-6">
        <TabsList className="bg-stone-100 p-1 rounded-xl">
          <TabsTrigger value="history" className="rounded-lg gap-2">
            <History className="w-4 h-4" /> Riwayat
          </TabsTrigger>
          <TabsTrigger value="subscription" className="rounded-lg gap-2">
            <Shield className="w-4 h-4" /> Langganan
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-lg gap-2">
            <User className="w-4 h-4" /> Profil
          </TabsTrigger>
          <TabsTrigger value="articles" className="rounded-lg gap-2">
            <FileText className="w-4 h-4" /> Artikel Member
          </TabsTrigger>
        </TabsList>

        {/* Subscription Content */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-stone-900 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="font-serif text-2xl">Status Langganan</CardTitle>
                  <CardDescription className="text-stone-400">
                    Kelola paket aktif Anda • {profile?.subscriptionStatus === 'free' ? 'Gratis' : profile?.subscriptionStatus === 'monthly' ? 'Bulanan' : 'Tahunan'}
                  </CardDescription>
                </div>
                {profile?.role === 'admin' ? (
                  <div className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-full">ADMIN</div>
                ) : (
                  <div className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase rounded-full",
                    profile?.subscriptionStatus === 'free' ? "bg-stone-700 text-stone-300" : "bg-green-600 text-white"
                  )}>
                    {profile?.subscriptionStatus}
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-8">
              {profile?.role === 'admin' ? (
                <div className="text-center py-8">
                  <Shield className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold">Akses Admin Aktif</h3>
                  <p className="text-stone-500">Anda memiliki akses penuh ke seluruh fitur situs.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-6 bg-stone-50 rounded-2xl border border-stone-100">
                    <div className="space-y-1 text-center md:text-left">
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Detail Paket</p>
                      <h3 className="text-2xl font-serif font-bold text-stone-800">
                        {profile?.subscriptionStatus === 'free' ? 'Paket Gratis' : 
                         profile?.subscriptionStatus === 'monthly' ? 'Paket Unlimited 30 Hari' : 'Paket Unlimited 365 Hari'}
                      </h3>
                      {profile?.premiumExpiredAt && (
                        <p className={cn(
                          "text-sm font-medium",
                          new Date(profile.premiumExpiredAt.toDate ? profile.premiumExpiredAt.toDate() : profile.premiumExpiredAt) < new Date() 
                            ? "text-red-500" 
                            : "text-green-600"
                        )}>
                          {new Date(profile.premiumExpiredAt.toDate ? profile.premiumExpiredAt.toDate() : profile.premiumExpiredAt) < new Date()
                            ? "Masa Berlaku Telah Habis"
                            : `Berlaku Sampai: ${format(profile.premiumExpiredAt.toDate ? profile.premiumExpiredAt.toDate() : new Date(profile.premiumExpiredAt), 'dd MMMM yyyy')}`}
                        </p>
                      )}
                    </div>
                    {(!profile?.premiumExpiredAt || new Date(profile.premiumExpiredAt.toDate ? profile.premiumExpiredAt.toDate() : profile.premiumExpiredAt) < new Date()) && (
                      <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] font-bold px-6 h-12 rounded-xl">
                        PERBARUI LANGGANAN
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PricingCard 
                      title="Unlimited 30 Hari" 
                      price="111.000" 
                      period="bulan" 
                      features={['Unlimited Generate Weton', 'Unlimited Cek Jodoh', 'Akses Hari Baik Tanpa Batas', 'Download PDF Sepuasnya', 'Akses Artikel Eksklusif Member']}
                      isPopular
                      onSelect={() => window.open(`https://wa.me/6281299996816?text=${encodeURIComponent(`Halo Admin, saya ingin berlangganan paket Unlimited 30 Hari.\nEmail: ${profile?.email}`)}`, '_blank')}
                    />
                    <PricingCard 
                      title="Unlimited 365 Hari" 
                      price="1.111.000" 
                      period="tahun" 
                      features={['Semua Fitur Paket Bulanan', 'Akses Tanpa Batas Selama Setahun', 'Prioritas Dukungan Admin', 'Hemat Lebih Dari 25%']}
                      onSelect={() => window.open(`https://wa.me/6281299996816?text=${encodeURIComponent(`Halo Admin, saya ingin berlangganan paket Unlimited 365 Hari.\nEmail: ${profile?.email}`)}`, '_blank')}
                    />
                  </div>

                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-amber-800">Instruksi Pembayaran Manual</h4>
                      <p className="text-xs text-amber-700 max-w-lg">
                        Silakan pilih paket di atas, kirimkan bukti transfer ke WhatsApp admin kami, dan akun Anda akan diaktifkan dalam waktu 1-12 jam.
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-amber-200 w-full max-w-sm space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Bank</span>
                        <span className="font-bold">BCA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">No. Rekening</span>
                        <span className="font-mono font-bold">1371225981</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Penerima</span>
                        <span className="font-bold">GEIBBY MEYRITH BOLANG</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Content */}
        <TabsContent value="history" className="space-y-4">
          {history.length === 0 ? (
            <div className="p-20 text-center bg-white rounded-3xl border border-stone-100 shadow-sm">
              <Clock className="w-12 h-12 text-stone-200 mx-auto mb-4" />
              <p className="text-stone-400">Belum ada riwayat perhitungan.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((item) => (
                <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-xl",
                        item.type === 'weton' ? "bg-amber-100 text-amber-600" :
                        item.type === 'jodoh' ? "bg-red-100 text-red-600" :
                        "bg-green-100 text-green-600"
                      )}>
                        {item.type === 'weton' ? <User className="w-5 h-5" /> :
                         item.type === 'jodoh' ? <Heart className="w-5 h-5" /> :
                         <Calendar className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{item.type}</p>
                        <h4 className="font-bold text-stone-800">{item.label}</h4>
                        <p className="text-xs text-stone-500">
                          {item.createdAt ? format(item.createdAt.toDate(), 'dd MMMM yyyy, HH:mm') : '-'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Profile Content */}
        <TabsContent value="profile">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-stone-900 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-stone-700 flex items-center justify-center border-4 border-stone-800">
                  <User className="w-8 h-8 text-stone-400" />
                </div>
                <div>
                  <CardTitle className="font-serif text-2xl">{profile?.displayName}</CardTitle>
                  <CardDescription className="text-stone-400">{profile?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><User className="w-3 h-3" /> Nama Lengkap</Label>
                    <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Geibby Meyrith..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><MessageCircle className="w-3 h-3" /> WhatsApp Aktif</Label>
                    <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="0812..." />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Calendar className="w-3 h-3" /> Tanggal Lahir</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="Tgl" value={birthDay} onChange={e => setBirthDay(e.target.value)} />
                      <Input placeholder="Bln" value={birthMonth} onChange={e => setBirthMonth(e.target.value)} />
                      <Input placeholder="Thn" value={birthYear} onChange={e => setBirthYear(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 opacity-50"><Mail className="w-3 h-3" /> Email Aktif</Label>
                    <Input value={profile?.email} disabled className="bg-stone-50" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button className="bg-[#2E7D32] hover:bg-[#1B5E20] gap-2 px-8 h-12 rounded-xl text-lg font-bold" onClick={handleUpdateProfile}>
                  <Save className="w-5 h-5" /> Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Articles Content */}
        <TabsContent value="articles">
          {articles.length === 0 ? (
            <div className="p-20 text-center bg-white rounded-3xl border border-stone-100 shadow-sm">
              <FileText className="w-12 h-12 text-stone-200 mx-auto mb-4" />
              <p className="text-stone-400">Belum ada artikel khusus member.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Card key={article.id} className="border-none shadow-md hover:shadow-xl transition-all h-full flex flex-col">
                  <CardHeader>
                    <p className="text-[10px] font-bold text-[#2E7D32] uppercase tracking-[0.2em] mb-1">MEMBER ONLY</p>
                    <CardTitle className="font-serif text-xl line-clamp-2">{article.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {article.createdAt ? format(article.createdAt.toDate(), 'dd MMM yyyy') : '-'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-stone-600 line-clamp-4 leading-relaxed">
                      {article.content}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="ghost" className="w-full text-[#2E7D32] font-bold group">
                      Baca Selengkapnya <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const Heart = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.505 4.04 3 5.5L12 21l7-7Z" />
  </svg>
);
