/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { id, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { 
  Calendar as CalendarIcon, 
  Heart, 
  Sun, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  ArrowRight,
  Moon,
  Compass,
  Wind,
  Zap,
  User,
  Users,
  Download,
  Shield,
  LogOut,
  LogIn,
  LayoutDashboard,
  FileText,
  Clock,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  getJavaneseDetails, 
  getJodohPinasti, 
  getMangsaFromDate,
  PRANATA_MANGSA,
  type JavaneseDetails 
} from '@/lib/javanese-calendar';
import { useAuth } from '@/lib/AuthContext';
import { Paywall } from '@/components/Paywall';
import { AdminDashboard } from '@/components/AdminDashboard';
import { UserDashboard } from '@/components/UserDashboard';
import { AuthModal } from '@/components/AuthModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: any;
}

export default function App() {
  return <MainApp />;
}

function MainApp() {
  const { t, i18n: i18nInstance } = useTranslation();
  const { user, profile, login, logout, incrementGenerateCount, isPremium, isAdmin, saveHistory } = useAuth();
  const [activeTab, setActiveTab] = useState('weton');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDashboardMode, setIsDashboardMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [publicArticles, setPublicArticles] = useState<Article[]>([]);
  const [guestGenerateCount, setGuestGenerateCount] = useState<number>(() => {
    const saved = localStorage.getItem('hamare_guest_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  
  const openLogin = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };
  
  const openRegister = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const resultRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Public Articles for Homepage
    const q = query(
      collection(db, 'articles'),
      where('visibility', '==', 'public'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPublicArticles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Article[]);
    });
    return () => unsubscribe();
  }, []);

  const incrementGuestGenerateCount = () => {
    const newCount = guestGenerateCount + 1;
    setGuestGenerateCount(newCount);
    localStorage.setItem('hamare_guest_count', newCount.toString());
  };

  // New states for specific calculations
  const [birthDateWeton, setBirthDateWeton] = useState<Date | null>(null);
  const [eventDateHariBaik, setEventDateHariBaik] = useState<Date | null>(null);
  
  const wetonKelahiranDetails = useMemo(() => birthDateWeton ? getJavaneseDetails(birthDateWeton) : null, [birthDateWeton]);
  const hariBaikDetails = useMemo(() => eventDateHariBaik ? getJavaneseDetails(eventDateHariBaik) : null, [eventDateHariBaik]);

  const dateLocale = i18nInstance.language === 'id' || i18nInstance.language === 'jv' ? id : enUS;

  // Jodoh Pinasti State
  const [birthDateSelf, setBirthDateSelf] = useState<Date>(new Date(1990, 0, 1));
  const [birthDatePartner, setBirthDatePartner] = useState<Date>(new Date(1992, 0, 1));
  
  const mangsaSelfData = useMemo(() => {
    const name = getMangsaFromDate(birthDateSelf);
    return PRANATA_MANGSA.find(pm => pm.name === name);
  }, [birthDateSelf]);

  const mangsaPartnerData = useMemo(() => {
    const name = getMangsaFromDate(birthDatePartner);
    return PRANATA_MANGSA.find(pm => pm.name === name);
  }, [birthDatePartner]);

  const [jodohResult, setJodohResult] = useState<ReturnType<typeof getJodohPinasti> | null>(null);

  const wetonDetails = useMemo(() => getJavaneseDetails(selectedDate), [selectedDate]);

  const currentCount = profile ? profile.generateCount : guestGenerateCount;
  const showPaywall = !isPremium && currentCount > 3;
  const canDownload = isPremium || currentCount <= 3;

  const handleCalculateWeton = (date: Date | null) => {
    if (date) {
      setBirthDateWeton(date);
      const details = getJavaneseDetails(date);
      if (profile) {
        saveHistory('weton', `${details.masehiDayName} ${details.pasaranName}`, details);
        if (!isPremium && profile.generateCount <= 3) {
          incrementGenerateCount();
        }
      } else {
        if (guestGenerateCount <= 3) {
          incrementGuestGenerateCount();
        }
      }
    }
  };

  const handleCalculateHariBaik = (date: Date | null) => {
    if (date) {
      setEventDateHariBaik(date);
      const details = getJavaneseDetails(date);
      if (profile) {
        saveHistory('hariBaik', `${details.masehiDayName} ${details.pasaranName}`, details);
        if (!isPremium && profile.generateCount <= 3) {
          incrementGenerateCount();
        }
      } else {
        if (guestGenerateCount <= 3) {
          incrementGuestGenerateCount();
        }
      }
    }
  };

  const handleCalculateJodoh = async () => {
    if (mangsaSelfData && mangsaPartnerData) {
      const result = getJodohPinasti(mangsaSelfData.name, mangsaPartnerData.name);
      setJodohResult(result);
      if (profile) {
        saveHistory('jodoh', `${mangsaSelfData.name} x ${mangsaPartnerData.name}`, result);
        if (!isPremium && profile.generateCount <= 3) {
          incrementGenerateCount();
        }
      } else {
        if (guestGenerateCount <= 3) {
          incrementGuestGenerateCount();
        }
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;
    setIsLoading(true);
    
    try {
      // Use a more aggressive scrubber in onclone
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F5F5F0',
        logging: false,
        onclone: (clonedDoc) => {
          const allElements = clonedDoc.getElementsByTagName("*");
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            const styles = window.getComputedStyle(el);
            
            // Critical CSS properties to check
            const propsToCheck = [
              'color', 'background-color', 'border-color', 'fill', 'stroke',
              'outline-color', 'text-decoration-color', 'stop-color'
            ];

            propsToCheck.forEach(prop => {
              const val = styles.getPropertyValue(prop);
              if (val && val.includes('oklch')) {
                // Force a safe fallback using inline style on the cloned element
                const propCamelCase = prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                // @ts-ignore
                el.style[propCamelCase] = (prop === 'background-color' || prop === 'fill') ? 'transparent' : '#1A1A1A';
              }
            });

            // Extra check for complex properties like box-shadow or backgrounds with gradients
            const backgroundImage = styles.getPropertyValue('background-image');
            if (backgroundImage && backgroundImage.includes('oklch')) {
              el.style.backgroundImage = 'none';
            }
            
            const boxShadow = styles.getPropertyValue('box-shadow');
            if (boxShadow && boxShadow.includes('oklch')) {
              el.style.boxShadow = 'none';
            }
          }
          
          // Force results to be visible in the clone even if hidden in the main view
          const paywall = clonedDoc.querySelector('.absolute.inset-0.z-20');
          if (paywall) {
            (paywall as HTMLElement).style.display = 'none';
          }

          // Ensure the result container itself is visible and has correct background
          const resultEl = clonedDoc.querySelector('[ref="resultRef"]'); 
          if (resultEl) {
            (resultEl as HTMLElement).style.backgroundColor = '#F5F5F0';
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Hamare-${activeTab}-${format(new Date(), 'ddMMyy-HHmm')}.pdf`);
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Gagal mengunduh PDF. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] p-4 md:p-8 font-sans" id="app-container">
      {isAdminMode && isAdmin ? (
        <AdminDashboard onBack={() => setIsAdminMode(false)} />
      ) : isDashboardMode && profile ? (
        <UserDashboard onBack={() => setIsDashboardMode(false)} />
      ) : (
        <>
          <header className="max-w-6xl mx-auto mb-8 text-center relative" id="header">
            <div className="absolute top-0 right-0 flex gap-2">
              <div className="flex gap-1">
                {['id', 'jv', 'en'].map((lng) => (
                  <Button 
                    key={lng}
                    variant="ghost" 
                    size="sm" 
                    onClick={() => i18nInstance.changeLanguage(lng)}
                    className={cn("text-[10px] font-bold px-2 h-7", i18nInstance.language === lng ? "text-[#2E7D32] bg-stone-200/50" : "text-stone-600")}
                  >
                    {lng.toUpperCase()}
                  </Button>
                ))}
              </div>
              
              {profile ? (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsDashboardMode(true)}
                    className="h-7 text-[10px] font-bold px-2 text-[#2E7D32] border border-[#2E7D32]/20 hover:bg-[#2E7D32]/10"
                  >
                    <LayoutDashboard className="w-3 h-3 mr-1" /> DASHBOARD
                  </Button>
                  {isAdmin && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => setIsAdminMode(true)}
                      className="h-7 text-[10px] font-bold px-3 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm rounded-full"
                    >
                      <Shield className="w-3 h-3 mr-1" /> PANEL ADMIN
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={logout} className="h-7 text-[10px] font-bold px-2 text-stone-600">
                    <LogOut className="w-3 h-3 mr-1" /> KELUAR
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={openLogin} className="h-7 text-[10px] font-bold px-4 text-[#2E7D32] border-[#2E7D32]/30 hover:bg-[#2E7D32]/10 rounded-full">
                  <LogIn className="w-3 h-3 mr-1" /> MASUK / DAFTAR
                </Button>
              )}
            </div>

            <AuthModal 
              isOpen={isAuthModalOpen} 
              onClose={() => setIsAuthModalOpen(false)} 
              defaultMode={authModalMode}
            />

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-tight"
          id="main-title"
        >
          {t('title')}
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl md:text-2xl font-serif text-stone-700 mb-2"
          id="main-subtitle-1"
        >
          {t('subtitle')}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-stone-700 font-medium italic"
          id="main-subtitle-2"
        >
          {t('description')}
        </motion.p>
      </header>

      <main className="max-w-6xl mx-auto space-y-8" id="main-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Infinite Calendar --- */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden" id="calendar-card">
              <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-7 bg-stone-900 text-white">
                <div className="text-center md:text-left">
                  <CardTitle className="font-serif text-3xl">{format(currentMonth, 'MMMM yyyy', { locale: dateLocale })}</CardTitle>
                  <CardDescription className="text-stone-400">{t('calendar.title')}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-7 border-b border-stone-100 bg-stone-50">
                  {[
                    t('calendar.days.min'),
                    t('calendar.days.sen'),
                    t('calendar.days.sel'),
                    t('calendar.days.rab'),
                    t('calendar.days.kam'),
                    t('calendar.days.jum'),
                    t('calendar.days.sab')
                  ].map(day => (
                    <div key={day} className="py-3 text-center text-xs font-bold text-stone-600 uppercase tracking-widest">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, idx) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const details = getJavaneseDetails(day);
                    
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "h-20 md:h-28 p-2 border-r border-b border-stone-50 text-left transition-all group relative",
                          !isCurrentMonth && "opacity-30",
                          isSelected && "bg-stone-50 ring-1 ring-inset ring-stone-200 shadow-inner"
                        )}
                        onClick={() => setSelectedDate(day)}
                      >
                        <span className={cn(
                          "text-lg font-medium",
                          isSelected ? "text-stone-900" : "text-stone-600"
                        )}>
                          {format(day, 'd')}
                        </span>
                        <div className="mt-1 space-y-0.5">
                          <p className="text-[9px] md:text-[10px] font-bold text-stone-600 uppercase truncate">
                            {details.pasaranName.split('-')[0]}
                          </p>
                          <p className="text-[8px] md:text-[9px] text-stone-700 truncate">
                            {details.wuku}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- Public Blog Feed --- */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-[#2E7D32]" />
              <h3 className="font-serif font-bold text-xl text-stone-800">Artikel Terbaru</h3>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {publicArticles.length === 0 ? (
                <div className="p-8 text-center bg-white/50 rounded-2xl border border-dashed border-stone-200">
                  <p className="text-sm text-stone-400 italic">Belum ada artikel publik.</p>
                </div>
              ) : (
                publicArticles.map((article) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={article.id}
                  >
                    <Card className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-serif font-bold group-hover:text-[#2E7D32] transition-colors line-clamp-2">
                          {article.title}
                        </CardTitle>
                        <CardDescription className="text-stone-500 flex items-center gap-2">
                          <Clock className="w-3 h-3" /> {article.createdAt ? format(article.createdAt.toDate(), 'dd MMM yyyy') : '-'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed">
                          {article.content}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* --- Selected Date Summary --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={selectedDate.toISOString()}
        >
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden" id="selected-date-summary">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-stone-100">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">{t('weton.selectedDate')}</h3>
                  <div className="space-y-1">
                    <p className="text-2xl md:text-3xl font-serif font-bold text-stone-800">
                      {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: dateLocale })}
                    </p>
                    <p className="text-stone-500 font-medium">
                      {wetonDetails.jawiDate} {wetonDetails.jawiMonthName} {wetonDetails.tahunJawi}
                    </p>
                  </div>
                </div>
                <div className="md:w-72 p-6 bg-[#2E7D32] text-white flex flex-col justify-center items-center text-center shadow-inner">
                  <p className="text-[10px] text-green-100 uppercase tracking-[0.2em] font-bold mb-2">{t('weton.neptu')}</p>
                  <p className="text-3xl font-serif font-bold">
                    {wetonDetails.masehiDayName} {wetonDetails.pasaranName.split('-')[0]}
                  </p>
                  <p className="text-xs text-green-200 mt-2 font-medium">
                    {t('weton.neptu')}: {wetonDetails.neptuValue} ({wetonDetails.dayValue} + {wetonDetails.pasaranValue})
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* --- Detil Weton Hari Ini (Global Info for Selected Date) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          key={`details-${selectedDate.toISOString()}`}
        >
          <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden" id="weton-details-card">
            <CardHeader className="bg-stone-900 text-white">
              <CardTitle className="font-serif text-2xl flex items-center gap-2">
                <Info className="w-6 h-6" /> {t('weton.details')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
                {/* Visible Section (100%) */}
                <div className="p-6 space-y-6">
                  <DetailItem label={t('weton.labels.jawiDate')} value={`${wetonDetails.jawiDate} ${t(`calendar.months.${wetonDetails.jawiMonthName}`)}`} icon={<Moon className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.dayLambang')} value={`${wetonDetails.jawiDayName} (${wetonDetails.dayLambang})`} icon={<Sun className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.pasaranDewa')} value={`${wetonDetails.pasaranName} (${wetonDetails.pasaranDewa})`} icon={<Zap className="w-4 h-4" />} />
                </div>
                
                <div className="p-6 space-y-6 bg-stone-50/50">
                  <DetailItem label={t('weton.labels.daySifat')} value={t(wetonDetails.daySifat)} isLongText />
                  <DetailItem label={t('weton.labels.pasaranSifat')} value={t(wetonDetails.pasaranSifat)} isLongText />
                  <DetailItem label={t('weton.labels.tahunSaka')} value={`${wetonDetails.tahunSaka}`} subValue={t(wetonDetails.tahunSakaSifat)} icon={<CalendarIcon className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.windu')} value={`${wetonDetails.windu}`} subValue={t(wetonDetails.winduSifat)} icon={<Wind className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.lambang')} value={`${wetonDetails.lambang}`} subValue={t(wetonDetails.lambangSifat)} icon={<Info className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.tahunJawi')} value={`${wetonDetails.tahunJawi}`} subValue={t(wetonDetails.tahunJawiSifat)} icon={<ArrowRight className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.pranataMangsa')} value={`${wetonDetails.pranataMangsa}`} subValue={t(wetonDetails.pranataMangsaSifat)} icon={<Compass className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.wuku')} value={`${wetonDetails.wuku}`} subValue={t(wetonDetails.wukuSifat)} icon={<Zap className="w-4 h-4" />} />
                </div>
              </div>
              <div className="p-6 bg-stone-100 border-t border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">{t('weton.nagadina')}</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-stone-400">{t('weton.dewa')}</p>
                    <p className="font-medium">{wetonDetails.nagadinaDewa}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-stone-500">{t('weton.warna')}</p>
                    <p className="font-medium">{wetonDetails.nagadinaWarna}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-stone-500">{t('weton.arah')}</p>
                    <p className="font-medium">{t(wetonDetails.nagadinaArah)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" id="main-tabs">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-stone-200/50 p-1 rounded-xl" id="tabs-list">
            <TabsTrigger 
              value="weton" 
              className="rounded-lg transition-all data-[state=active]:bg-[#FBC02D] data-[state=inactive]:bg-[#2E7D32] data-[state=inactive]:text-white data-[state=active]:text-black font-bold" 
              id="tab-weton"
            >
              {t('tabs.weton')}
            </TabsTrigger>
            <TabsTrigger 
              value="jodoh" 
              className="rounded-lg transition-all data-[state=active]:bg-[#FBC02D] data-[state=inactive]:bg-[#2E7D32] data-[state=inactive]:text-white data-[state=active]:text-black font-bold" 
              id="tab-jodoh"
            >
              {t('tabs.jodoh')}
            </TabsTrigger>
            <TabsTrigger 
              value="hari-baik" 
              className="rounded-lg transition-all data-[state=active]:bg-[#FBC02D] data-[state=inactive]:bg-[#2E7D32] data-[state=inactive]:text-white data-[state=active]:text-black font-bold" 
              id="tab-hari-baik"
            >
              {t('tabs.hariBaik')}
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <AnimatePresence mode="wait">
            {/* --- Weton Hari Kelahiran --- */}
            <TabsContent value="weton" key="weton" id="content-weton">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <Card className="border-none shadow-xl bg-white/90 backdrop-blur-lg overflow-hidden" id="weton-kelahiran-input-card">
                  <CardHeader className="bg-stone-900 text-white text-center py-6">
                    <User className="w-10 h-10 mx-auto mb-2 text-[#FBC02D]" />
                    <CardTitle className="font-serif text-2xl">{t('weton.calculateTitle')}</CardTitle>
                    <CardDescription className="text-stone-400">{t('weton.calculateDesc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="max-w-sm mx-auto space-y-4">
                      <div className="space-y-2">
                        <Label className="font-bold">{t('weton.birthDate')}</Label>
                        <Input 
                          type="date" 
                          min="1582-01-01"
                          max="2100-12-31"
                          onChange={(e) => handleCalculateWeton(e.target.value ? new Date(e.target.value) : null)}
                          className="bg-stone-50 border-stone-200 h-12"
                        />
                      </div>
                    </div>

                    {wetonKelahiranDetails && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 space-y-6 relative"
                        ref={activeTab === 'weton' ? resultRef : null}
                      >
                        {showPaywall && <Paywall />}
                        
                        <div className="space-y-6">
                          <div className="p-6 rounded-xl bg-[#2E7D32] text-white shadow-inner text-center">
                            <p className="text-xs text-green-100 uppercase tracking-widest font-bold mb-1">{t('weton.birthDate')}</p>
                            <p className="text-3xl font-serif font-bold">
                              {wetonKelahiranDetails.masehiDayName} {wetonKelahiranDetails.pasaranName}
                            </p>
                            <p className="text-sm text-green-200 mt-2">
                              {t('weton.neptu')}: {wetonKelahiranDetails.neptuValue} ({wetonKelahiranDetails.dayValue} + {wetonKelahiranDetails.pasaranValue})
                            </p>
                          </div>

                          <div className={cn("p-6 bg-stone-50 rounded-2xl border border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-6 relative transition-all", showPaywall && "blur-md select-none pointer-events-none")}>
                            <DetailItem label={t('weton.labels.daySifat')} value={t(wetonKelahiranDetails.daySifat)} isLongText />
                            <DetailItem label={t('weton.labels.pasaranSifat')} value={t(wetonKelahiranDetails.pasaranSifat)} isLongText />
                            <DetailItem label={t('weton.labels.wuku')} value={wetonKelahiranDetails.wuku} subValue={t(wetonKelahiranDetails.wukuSifat)} isLongText />
                            <DetailItem label={t('weton.labels.pranataMangsa')} value={wetonKelahiranDetails.pranataMangsa} subValue={t(wetonKelahiranDetails.pranataMangsaSifat)} isLongText />
                          </div>
                          
                          {!canDownload ? (
                            <Button 
                              variant="outline" 
                              className="w-full mt-4 gap-2 border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed"
                              onClick={() => {
                                document.getElementById('calendar-card')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                            >
                              <Lock className="w-4 h-4" /> {t('common.unlockToDownload') || 'Unlock untuk Download PDF'}
                            </Button>
                          ) : (
                            <Button variant="outline" className="w-full mt-4 gap-2 border-stone-300" onClick={handleDownloadPDF}>
                              <Download className="w-4 h-4" /> Download PDF
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* --- Jodoh Pinasti --- */}
            <TabsContent value="jodoh" key="jodoh" id="content-jodoh">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-lg overflow-hidden" id="jodoh-card">
                  <CardHeader className="bg-stone-900 text-white text-center py-8">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-[#FBC02D]" />
                    <CardTitle className="font-serif text-3xl">{t('jodoh.title')}</CardTitle>
                    <CardDescription className="text-stone-400">{t('jodoh.desc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2 font-bold"><User className="w-4 h-4" /> {t('jodoh.birthDateSelf')}</Label>
                        <Input 
                          type="date" 
                          min="1582-01-01"
                          max="2100-12-31"
                          value={format(birthDateSelf, 'yyyy-MM-dd')}
                          onChange={(e) => setBirthDateSelf(new Date(e.target.value))}
                          className="bg-stone-50 border-stone-200 h-12"
                        />
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-[10px] font-bold text-green-600 uppercase">{t('jodoh.mangsaSelf')}</p>
                          <p className="font-bold text-green-800">{mangsaSelfData?.name}</p>
                          <p className="text-[10px] text-green-700 mt-1 leading-relaxed italic">{mangsaSelfData?.sifat}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Label className="flex items-center gap-2 font-bold"><Users className="w-4 h-4" /> {t('jodoh.birthDatePartner')}</Label>
                        <Input 
                          type="date" 
                          min="1582-01-01"
                          max="2100-12-31"
                          value={format(birthDatePartner, 'yyyy-MM-dd')}
                          onChange={(e) => setBirthDatePartner(new Date(e.target.value))}
                          className="bg-stone-50 border-stone-200 h-12"
                        />
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-[10px] font-bold text-green-600 uppercase">{t('jodoh.mangsaPartner')}</p>
                          <p className="font-bold text-green-800">{mangsaPartnerData?.name}</p>
                          <p className="text-[10px] text-green-700 mt-1 leading-relaxed italic">{mangsaPartnerData?.sifat}</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={handleCalculateJodoh}
                      className="w-full h-14 text-lg font-bold bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl transition-all shadow-lg"
                      id="btn-calculate-jodoh"
                    >
                      {t('jodoh.calculate')}
                    </Button>

                    {jodohResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 relative"
                        id="jodoh-result"
                        ref={activeTab === 'jodoh' ? resultRef : null}
                      >
                        {showPaywall && <Paywall />}
                        
                        <div className="space-y-6">
                          <div className="p-8 rounded-2xl bg-stone-50 border-2 border-stone-100 text-center relative overflow-hidden">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">{t('jodoh.status')}</h3>
                            <p className={cn(
                              "text-3xl font-serif font-bold",
                              jodohResult.status.includes('Berjodoh') ? "text-[#2E7D32]" : "text-stone-700"
                            )}>
                              {jodohResult.status.includes('Pinasti') ? t('jodoh.results.pinasti.status') : 
                               jodohResult.status === 'Serasi' ? t('jodoh.results.serasi.status') : 
                               t('jodoh.results.kendala.status')}
                            </p>
                          </div>
                          
                          <div className={cn("p-8 rounded-2xl bg-stone-50 border-2 border-stone-100 text-center relative overflow-hidden transition-all", showPaywall && "blur-md select-none pointer-events-none")}>
                            <Separator className="my-6" />
                            <p className="text-lg leading-relaxed text-stone-600 italic">
                              "{jodohResult.status.includes('Pinasti') ? t('jodoh.results.pinasti.pesan') : 
                                jodohResult.status === 'Serasi' ? t('jodoh.results.serasi.pesan') : 
                                t('jodoh.results.kendala.pesan')}"
                            </p>
                          </div>
                          
                          {!canDownload ? (
                            <Button 
                              variant="outline" 
                              className="w-full gap-2 border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed"
                              onClick={() => {
                                document.getElementById('calendar-card')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                            >
                              <Lock className="w-4 h-4" /> {t('common.unlockToDownload') || 'Unlock untuk Download PDF'}
                            </Button>
                          ) : (
                            <Button variant="outline" className="w-full gap-2 border-stone-300" onClick={handleDownloadPDF}>
                              <Download className="w-4 h-4" /> Download PDF
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* --- Hari Baik --- */}
            <TabsContent value="hari-baik" key="hari-baik" id="content-hari-baik">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <Card className="border-none shadow-xl bg-white/90 backdrop-blur-lg overflow-hidden" id="hari-baik-input-card">
                  <CardHeader className="bg-stone-900 text-white text-center py-6">
                    <Compass className="w-10 h-10 mx-auto mb-2 text-[#FBC02D]" />
                    <CardTitle className="font-serif text-2xl">{t('hariBaik.title')}</CardTitle>
                    <CardDescription className="text-stone-400">{t('hariBaik.desc')}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="max-w-sm mx-auto space-y-4">
                      <div className="space-y-2">
                        <Label className="font-bold">{t('hariBaik.eventDate')}</Label>
                        <Input 
                          type="date" 
                          min="1582-01-01"
                          max="2100-12-31"
                          onChange={(e) => handleCalculateHariBaik(e.target.value ? new Date(e.target.value) : null)}
                          className="bg-stone-50 border-stone-200 h-12"
                        />
                      </div>
                    </div>

                    {hariBaikDetails && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 relative"
                        ref={activeTab === 'hari-baik' ? resultRef : null}
                      >
                        {showPaywall && <Paywall />}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="md:col-span-2 space-y-4 relative">
                            <Card className="border-none shadow-xl bg-white/90 overflow-hidden">
                              <CardHeader className="bg-stone-800 text-white">
                                <CardTitle className="text-xl font-serif">{t('hariBaik.analysis')}</CardTitle>
                                <CardDescription className="text-stone-400">{format(hariBaikDetails.masehiDate, 'EEEE, d MMMM yyyy', { locale: dateLocale })}</CardDescription>
                              </CardHeader>
                              <CardContent className={cn("p-8 space-y-8 transition-all", showPaywall && "blur-md select-none pointer-events-none")}>
                                <div className="space-y-8">
                                  <DetailItemSmall 
                                    label={t('hariBaik.naas')} 
                                    value={hariBaikDetails.naas} 
                                    subValue={t(hariBaikDetails.naasSifat)}
                                    extra={t(hariBaikDetails.naasPantangan)}
                                    color="text-red-600"
                                  />
                                  <Separator />
                                  <DetailItemSmall 
                                    label={t('hariBaik.gisir')} 
                                    value={hariBaikDetails.gisir} 
                                    subValue={`${t('weton.labels.daySifat')}: ${t(hariBaikDetails.gisirSifat)}`}
                                  />
                                  <Separator />
                                  <DetailItemSmall 
                                    label={t('hariBaik.padewan')} 
                                    value={hariBaikDetails.padewan} 
                                    subValue={t(hariBaikDetails.padewanSifat)}
                                    extra={`${t('common.manfaat')}: ${t(hariBaikDetails.padewanManfaat)}`}
                                  />
                                  <Separator />
                                  <DetailItemSmall 
                                    label={t('hariBaik.padangon')} 
                                    value={hariBaikDetails.padangon} 
                                    subValue={t(hariBaikDetails.padangonSifat)}
                                  />
                                </div>
                              </CardContent>
                            </Card>
                            
                            {!canDownload ? (
                              <Button 
                                variant="outline" 
                                className="w-full gap-2 border-stone-200 bg-stone-50 text-stone-400 cursor-not-allowed"
                                onClick={() => {
                                  document.getElementById('calendar-card')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                              >
                                <Lock className="w-4 h-4" /> {t('common.unlockToDownload') || 'Unlock untuk Download PDF'}
                              </Button>
                            ) : (
                              <Button variant="outline" className="w-full gap-2 border-stone-300" onClick={handleDownloadPDF}>
                                <Download className="w-4 h-4" /> Download PDF
                              </Button>
                            )}
                          </div>
                          
                          <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-[#2E7D32] text-white shadow-xl">
                              <h4 className="text-xs font-bold uppercase tracking-widest text-green-200 mb-4">{t('hariBaik.summary')}</h4>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-green-700/50 pb-2">
                                  <span className="text-sm text-green-200">Pasaran</span>
                                  <span className="font-bold">{hariBaikDetails.pasaranName}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-green-700/50 pb-2">
                                  <span className="text-sm text-green-200">Wuku</span>
                                  <span className="font-bold">{hariBaikDetails.wuku}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-green-700/50 pb-2">
                                  <span className="text-sm text-green-200">Neptu</span>
                                  <span className="font-bold">{hariBaikDetails.neptuValue}</span>
                                </div>
                              </div>
                            </div>

                            <Card className={cn("border-none shadow-lg bg-[#FBC02D]/10 border border-[#FBC02D]/20 transition-all", showPaywall && "blur-md select-none pointer-events-none")}>
                              <CardContent className="p-6">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">{t('hariBaik.nagadina')}</h4>
                                <div className="space-y-2">
                                  <p className="text-sm"><span className="text-stone-400">Dewa:</span> <span className="font-bold">{hariBaikDetails.nagadinaDewa}</span></p>
                                  <p className="text-sm"><span className="text-stone-400">Warna:</span> <span className="font-bold">{hariBaikDetails.nagadinaWarna}</span></p>
                                  <p className="text-sm"><span className="text-stone-400">Arah:</span> <span className="font-bold">{t(hariBaikDetails.nagadinaArah)}</span></p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </div>
      </Tabs>
      </main>

      <footer className="max-w-6xl mx-auto mt-20 pt-8 border-t border-stone-200 text-center text-stone-400 text-sm pb-12">
        <p>© 2026 {t('title')} - {t('description')}</p>
        <div className="mt-4 flex items-center justify-center gap-4">
          {isAdmin && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsAdminMode(true)}
              className="text-[10px] font-bold text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200"
            >
              <Shield className="w-3 h-3 mr-1" /> ADMIN DASHBOARD
            </Button>
          )}
        </div>
      </footer>
    </>
    )}
    </div>
  );
}

function formatBulletPoints(text: string) {
  if (!text) return null;
  // Split by period followed by space
  const parts = text.split(/\. /).filter(p => p.trim() !== '');
  return (
    <ul className="list-disc list-outside ml-4 space-y-1 mt-2">
      {parts.map((part, i) => {
        const subParts = part.split(/ : |: /);
        if (subParts.length > 1) {
          return (
            <li key={i} className="text-xs text-stone-600 leading-relaxed">
              <span className="font-bold text-stone-700">{subParts[0]}</span>: {subParts.slice(1).join(': ')}
            </li>
          );
        }
        return (
          <li key={i} className="text-xs text-stone-600 leading-relaxed">
            {part.endsWith('.') ? part : part + '.'}
          </li>
        );
      })}
    </ul>
  );
}

function DetailItem({ label, value, subValue, icon, isLongText = false }: { label: string; value: string; subValue?: string; icon?: React.ReactNode; isLongText?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-stone-700">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      {isLongText ? (
        <div className="mt-1">
          {formatBulletPoints(t(value))}
        </div>
      ) : (
        <p className="font-serif font-bold text-stone-800 text-xl">
          {t(value)}
        </p>
      )}
      {subValue && (
        <div className="mt-1">
          {subValue.length > 60 ? formatBulletPoints(t(subValue)) : <p className="text-xs text-stone-700 leading-relaxed">{t(subValue)}</p>}
        </div>
      )}
    </div>
  );
}

function DetailItemSmall({ label, value, subValue, extra, color }: { label: string; value: string; subValue?: string; extra?: string; color?: string }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-700">{label}</h4>
      <p className={cn("text-lg font-serif font-bold", color || "text-stone-800")}>{t(value)}</p>
      {subValue && <p className="text-xs text-stone-600 leading-relaxed">{t(subValue)}</p>}
      {extra && (
        <div className="mt-2 p-2 rounded bg-stone-50 border border-stone-100">
          <p className="text-[10px] font-bold text-stone-600 uppercase mb-1">{t('hariBaik.keterangan')}</p>
          <p className="text-[11px] text-stone-700 italic">{t(extra)}</p>
        </div>
      )}
    </div>
  );
}
