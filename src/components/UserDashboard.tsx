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
  ExternalLink
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
          <TabsTrigger value="profile" className="rounded-lg gap-2">
            <User className="w-4 h-4" /> Profil
          </TabsTrigger>
          <TabsTrigger value="articles" className="rounded-lg gap-2">
            <FileText className="w-4 h-4" /> Artikel Member
          </TabsTrigger>
        </TabsList>

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
