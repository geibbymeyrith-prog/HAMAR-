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
  Lock,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  addDoc,
  serverTimestamp
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
  calculateJodohNama,
  calculateHitungNama,
  PRANATA_MANGSA,
  type JavaneseDetails 
} from '@/lib/javanese-calendar';
import { 
  getJavaDate, 
  getPMDate, 
  getSifatHari, 
  getSTValue,
  getJavaneseMonthName,
  getJavaneseYearDetails,
  getPasaran
} from '@/lib/calendar-utils';
import { useAuth } from '@/lib/AuthContext';
import { Paywall } from '@/components/Paywall';
import { AdminDashboard } from '@/components/AdminDashboard';
import { UserDashboard } from '@/components/UserDashboard';
import { AuthModal } from '@/components/AuthModal';
import { MemberOfferModal } from '@/components/MemberOfferModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
// Logo imports removed

interface Article {
  id: string;
  title: string;
  author: string;
  content: string;
  createdAt: any;
}

// Helper to get or generate a persistent visitor ID for stats tracking
const getOrCreateVisitorId = (): string => {
  let visitorId = localStorage.getItem('hamare_visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('hamare_visitor_id', visitorId);
  }
  return visitorId;
};

const PENGHIDUPAN_LABELS: Record<number, string> = {
  0: "Kesakitan (Penderitaan dan perjalanan hidup)",
  1: "Penghasilan atau pemasukan sedikit",
  2: "Penghasilan sedang atau cukup",
  3: "Penghasilan baik",
  4: "Penghasilan besar",
  5: "Penghasilan baik dan hidup senang",
  7: "Hidup serba mewah dan sangat sempurna",
  8: "Kehidupan serba mewah karena keberhasilannya, dan diteruskan oleh keturunannya"
};

const PENGHIDUPAN_DATA = [
  { minAge: 0, maxAge: 6, neptuMap: { 7: 4, 8: 4, 9: 2, 10: 1, 11: 2, 12: 0, 13: 3, 14: 1, 15: 2, 16: 0, 17: 1, 18: 2 } },
  { minAge: 7, maxAge: 12, neptuMap: { 7: 1, 8: 1, 9: 5, 10: 0, 11: 4, 12: 5, 13: 1, 14: 0, 15: 0, 16: 3, 17: 1, 18: 5 } },
  { minAge: 13, maxAge: 18, neptuMap: { 7: 4, 8: 0, 9: 1, 10: 4, 11: 1, 12: 1, 13: 0, 14: 1, 15: 1, 16: 1, 17: 0, 18: 1 } },
  { minAge: 19, maxAge: 24, neptuMap: { 7: 1, 8: 1, 9: 0, 10: 1, 11: 1, 12: 0, 13: 5, 14: 4, 15: 1, 16: 2, 17: 5, 18: 0 } },
  { minAge: 25, maxAge: 30, neptuMap: { 7: 0, 8: 0, 9: 4, 10: 1, 11: 8, 12: 4, 13: 0, 14: 0, 15: 5, 16: 0, 17: 0, 18: 4 } },
  { minAge: 31, maxAge: 36, neptuMap: { 7: 2, 8: 3, 9: 1, 10: 3, 11: 1, 12: 0, 13: 1, 14: 0, 15: 2, 16: 1, 17: 1, 18: 1 } },
  { minAge: 37, maxAge: 42, neptuMap: { 7: 2, 8: 0, 9: 4, 10: 0, 11: 0, 12: 1, 13: 1, 14: 4, 15: 0, 16: 8, 17: 1, 18: 4 } },
  { minAge: 43, maxAge: 48, neptuMap: { 8: 1, 9: 0, 10: 0, 11: 1, 12: 0, 13: 5, 14: 4, 15: 1, 16: 1, 17: 5, 18: 0 } },
  { minAge: 49, maxAge: 54, neptuMap: { 9: 1, 10: 4, 11: 2, 12: 1, 13: 2, 14: 1, 15: 2, 16: 2, 17: 2, 18: 1 } },
  { minAge: 55, maxAge: 60, neptuMap: { 10: 4, 11: 0, 12: 4, 13: 0, 14: 4, 15: 5, 16: 7, 17: 0, 18: 4 } },
  { minAge: 61, maxAge: 66, neptuMap: { 11: 2, 12: 4, 13: 1, 14: 0, 15: 5, 16: 2, 17: 1, 18: 4 } },
  { minAge: 67, maxAge: 72, neptuMap: { 12: 0, 13: 2, 14: 1, 15: 1, 16: 0, 17: 2, 18: 0 } },
  { minAge: 73, maxAge: 78, neptuMap: { 13: 5, 14: 4, 15: 0, 16: 7, 17: 5, 18: 0 } },
  { minAge: 79, maxAge: 84, neptuMap: { 14: 4, 15: 4, 16: 1, 17: 5, 18: 4 } },
  { minAge: 85, maxAge: 90, neptuMap: { 15: 1, 16: 0, 17: 1, 18: 1 } },
  { minAge: 91, maxAge: 96, neptuMap: { 16: 2, 17: 0, 18: 4 } },
  { minAge: 97, maxAge: 102, neptuMap: { 17: 4, 18: 1 } },
  { minAge: 103, maxAge: 108, neptuMap: { 18: 1 } }
];

export default function App() {
  return <MainApp />;
}

function MainApp() {
  const { t, i18n: i18nInstance } = useTranslation();
  const { user, profile, login, logout, incrementGenerateCount, isPremium, isAdmin, saveHistory, isExpired } = useAuth();
  const [activeTab, setActiveTab] = useState('weton');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDashboardMode, setIsDashboardMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarDetailModalOpen, setIsCalendarDetailModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [publicArticles, setPublicArticles] = useState<Article[]>([]);
  const [allVisits, setAllVisits] = useState<any[]>([]);
  const [segeraHadirData, setSegeraHadirData] = useState<{ type: 'donation' | 'business' | 'research' } | null>(null);

  const handleShowSegeraHadir = (type: 'donation' | 'business' | 'research') => {
    setSegeraHadirData({ type });
  };

  // Visitor tracking logic
  useEffect(() => {
    const trackVisit = async () => {
      // Check if tracked in this sessionStorage session to prevent duplicate calls on refresh
      if (sessionStorage.getItem('hamare_session_tracked')) {
        return;
      }

      try {
        const visitorId = getOrCreateVisitorId();
        const now = new Date();
        const monthYearStr = format(now, 'yyyy-MM'); // Format: YYYY-MM
        
        await addDoc(collection(db, 'visits'), {
          visitorId,
          monthYear: monthYearStr,
          createdAt: serverTimestamp()
        });

        sessionStorage.setItem('hamare_session_tracked', 'true');
      } catch (err) {
        console.error('Error tracking visit:', err);
      }
    };

    trackVisit();
  }, []);

  // Listen to ALL visits for realtime statistics
  useEffect(() => {
    const q = query(
      collection(db, 'visits'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllVisits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Error fetching visits for statistics:", error);
    });
    return () => unsubscribe();
  }, []);

  const visitorStats = useMemo(() => {
    const stats = {
      totalVisitorsAllTime: 0,
      totalVisitorsCurrentMonth: 0,
      returningVisitorsAllTime: 0,
      returningVisitorsCurrentMonth: 0,
    };

    if (allVisits.length === 0) return stats;

    const now = new Date();
    const currentMonthStr = format(now, 'yyyy-MM');

    // Group by visitorId for all time and current month
    const visitsByVisitorAllTime: Record<string, number> = {};
    const visitsByVisitorCurrentMonth: Record<string, number> = {};

    allVisits.forEach((v) => {
      const vid = v.visitorId;
      if (!vid) return;

      // Increment all time
      visitsByVisitorAllTime[vid] = (visitsByVisitorAllTime[vid] || 0) + 1;

      // Extract details for current month
      const isCurrentMonth = v.monthYear === currentMonthStr;
      if (isCurrentMonth) {
        visitsByVisitorCurrentMonth[vid] = (visitsByVisitorCurrentMonth[vid] || 0) + 1;
      }
    });

    // Count total unique visitors
    stats.totalVisitorsAllTime = Object.keys(visitsByVisitorAllTime).length;
    stats.totalVisitorsCurrentMonth = Object.keys(visitsByVisitorCurrentMonth).length;

    // Count unique recurring visitors (visited >= 2 times)
    let recurringAllTime = 0;
    Object.values(visitsByVisitorAllTime).forEach((cnt) => {
      if (cnt >= 2) recurringAllTime++;
    });
    stats.returningVisitorsAllTime = recurringAllTime;

    let recurringCurrentMonth = 0;
    Object.values(visitsByVisitorCurrentMonth).forEach((cnt) => {
      if (cnt >= 2) recurringCurrentMonth++;
    });
    stats.returningVisitorsCurrentMonth = recurringCurrentMonth;

    return stats;
  }, [allVisits]);
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

  const wetonKelahiranAgeStats = useMemo(() => {
    if (!birthDateWeton) return null;
    const today = new Date();
    const diffTime = Math.max(0, today.getTime() - birthDateWeton.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const ageYears = Math.floor(diffDays / 365);
    return { diffDays, ageYears };
  }, [birthDateWeton]);

  const wetonKelahiranPenghidupan = useMemo(() => {
    if (!wetonKelahiranDetails || !wetonKelahiranAgeStats) return null;
    const neptu = wetonKelahiranDetails.neptuValue;
    const age = wetonKelahiranAgeStats.ageYears;
    
    let currentAge = age;
    let val: number | undefined = undefined;
    let matchedRangeRange: string = "";
    
    while (currentAge >= 0) {
      const range = PENGHIDUPAN_DATA.find(r => currentAge >= r.minAge && currentAge <= r.maxAge);
      if (range) {
        if (range.neptuMap[neptu as keyof typeof range.neptuMap] !== undefined) {
          val = range.neptuMap[neptu as keyof typeof range.neptuMap];
          matchedRangeRange = `${range.minAge} - ${range.maxAge} tahun`;
          break;
        }
      } else if (currentAge > 108) {
        currentAge -= 6;
        continue;
      }
      currentAge -= 6;
    }
    
    if (val === undefined) {
      val = 1; // fallback
      matchedRangeRange = "0 - 6 tahun";
    }
    
    const label = PENGHIDUPAN_LABELS[val] || "Penghasilan sedang atau cukup";
    const saran = "Untuk menyiasati urip atau penghidupan atau rejeki yang kecil, sebaiknya Anda harus mempunyai pasangan kerja atau partner yang nilai keberuntungannya tinggi. Jika sudah terlanjur memiliki pasangan yang memiliki nilai keberuntungan kecil maka Anda bisa menyiasati dengan melakukan Seratan Winadi di weton kelahiran Anda, weton kelahiran pasangan Anda, dan weton hari pernikahan.";
    
    return { value: val, label, rangeText: matchedRangeRange, saran };
  }, [wetonKelahiranDetails, wetonKelahiranAgeStats]);

  const hariBaikDetails = useMemo(() => eventDateHariBaik ? getJavaneseDetails(eventDateHariBaik) : null, [eventDateHariBaik]);

  const dateLocale = i18nInstance.language === 'id' || i18nInstance.language === 'jv' ? id : enUS;

  // Jodoh Pinasti State
  const [birthDateSelf, setBirthDateSelf] = useState<Date>(new Date(1990, 0, 1));
  const [birthDatePartner, setBirthDatePartner] = useState<Date>(new Date(1992, 0, 1));
  const [nameSelf, setNameSelf] = useState<string>('');
  const [namePartner, setNamePartner] = useState<string>('');
  const [jodohNamaResult, setJodohNamaResult] = useState<ReturnType<typeof calculateJodohNama> | null>(null);
  
  const mangsaSelfData = useMemo(() => {
    const name = getMangsaFromDate(birthDateSelf);
    return PRANATA_MANGSA.find(pm => pm.name === name);
  }, [birthDateSelf]);

  const mangsaPartnerData = useMemo(() => {
    const name = getMangsaFromDate(birthDatePartner);
    return PRANATA_MANGSA.find(pm => pm.name === name);
  }, [birthDatePartner]);

  const [jodohResult, setJodohResult] = useState<ReturnType<typeof getJodohPinasti> | null>(null);

  // Hitung Nama State
  const [nameInput, setNameInput] = useState<string>('');
  const [hitungNamaResult, setHitungNamaResult] = useState<ReturnType<typeof calculateHitungNama> | null>(null);

  const handleDateSelfChange = (date: Date) => {
    setBirthDateSelf(date);
    setJodohResult(null); // Reset result when date changes
    setJodohNamaResult(null);
  };

  const handleDatePartnerChange = (date: Date) => {
    setBirthDatePartner(date);
    setJodohResult(null); // Reset result when date changes
    setJodohNamaResult(null);
  };

  const wetonDetails = useMemo(() => getJavaneseDetails(selectedDate), [selectedDate]);
  const javaSelected = useMemo(() => getJavaDate(selectedDate), [selectedDate]);
  const jYearSelected = useMemo(() => getJavaneseYearDetails(selectedDate.getFullYear()), [selectedDate]);
  const pasaranSelected = useMemo(() => getPasaran(selectedDate), [selectedDate]);

  const [isMemberOfferOpen, setIsMemberOfferOpen] = useState(false);
  const [pendingCalculation, setPendingCalculation] = useState<{
    type: 'weton' | 'hariBaik' | 'jodoh';
    payload: any;
  } | null>(null);

  const currentCount = profile ? profile.generateCount : guestGenerateCount;
  const showPaywall = !isPremium && currentCount >= 3;
  const canDownload = isPremium || currentCount < 3;

  const handleCalculateWeton = (date: Date | null) => {
    if (!date) return;
    
    if (!user && !sessionStorage.getItem('hamare_login_offer_shown')) {
      setPendingCalculation({ type: 'weton', payload: date });
      setIsMemberOfferOpen(true);
      return;
    }

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
  };

  const handleCalculateHariBaik = (date: Date | null) => {
    if (!date) return;

    if (!user && !sessionStorage.getItem('hamare_login_offer_shown')) {
      setPendingCalculation({ type: 'hariBaik', payload: date });
      setIsMemberOfferOpen(true);
      return;
    }

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
  };

  const handleCalculateJodoh = async () => {
    if (!mangsaSelfData || !mangsaPartnerData) return;

    if (!user && !sessionStorage.getItem('hamare_login_offer_shown')) {
      setPendingCalculation({ type: 'jodoh', payload: null });
      setIsMemberOfferOpen(true);
      return;
    }

    const result = getJodohPinasti(mangsaSelfData.name, mangsaPartnerData.name);
    setJodohResult(result);

    const nameResult = calculateJodohNama(nameSelf, namePartner);
    setJodohNamaResult(nameResult);

    if (profile) {
      saveHistory('jodoh', `${mangsaSelfData.name} x ${mangsaPartnerData.name} (${nameSelf || '-'} x ${namePartner || '-'})`, result);
      if (!isPremium && profile.generateCount <= 3) {
        incrementGenerateCount();
      }
    } else {
      if (guestGenerateCount <= 3) {
        incrementGuestGenerateCount();
      }
    }
  };

  const handleConfirmLoginFromOffer = () => {
    setIsMemberOfferOpen(false);
    openLogin();
  };

  const handleConfirmRegisterFromOffer = () => {
    setIsMemberOfferOpen(false);
    openRegister();
  };

  const handleContinueAsGuestFromOffer = () => {
    sessionStorage.setItem('hamare_login_offer_shown', 'true');
    setIsMemberOfferOpen(false);
    
    // Execute the pending action
    if (pendingCalculation) {
      const { type, payload } = pendingCalculation;
      setPendingCalculation(null);
      if (type === 'weton') {
        handleCalculateWeton(payload);
      } else if (type === 'hariBaik') {
        handleCalculateHariBaik(payload);
      } else if (type === 'jodoh') {
        handleCalculateJodoh();
      }
    }
  };

  const parseOklch = (str: string): { r: number; g: number; b: number; a: number } | null => {
    const regex = /oklch\s*\(\s*([\d.]+\%?)\s+([\d.]+)\s+([\d.]+(?:deg|rad)?)\s*(?:\/\s*([\d.]+\%?))?\s*\)/i;
    const commaRegex = /oklch\s*\(\s*([\d.]+\%?)\s*,\s*([\d.]+)\s*,\s*([\d.]+(?:deg|rad)?)\s*(?:,\s*([\d.]+\%?))?\s*\)/i;
    
    const match = str.match(regex) || str.match(commaRegex);
    if (!match) return null;
    
    const L_str = match[1];
    const C_str = match[2];
    const H_str = match[3];
    const A_str = match[4] || "1";
    
    const L = L_str.endsWith('%') ? parseFloat(L_str) / 100 : parseFloat(L_str);
    const C = parseFloat(C_str);
    
    let H = parseFloat(H_str);
    if (H_str.endsWith('rad')) {
      H = H * (180 / Math.PI);
    }
    
    const A = A_str.endsWith('%') ? parseFloat(A_str) / 100 : parseFloat(A_str);
    
    const theta = H * (Math.PI / 180);
    const a_ok = C * Math.cos(theta);
    const b_ok = C * Math.sin(theta);
    
    const l_ = L + 0.3963377774 * a_ok + 0.2158037573 * b_ok;
    const m_ = L - 0.1055613458 * a_ok - 0.0638541728 * b_ok;
    const s_ = L - 0.0894841775 * a_ok - 1.2914855480 * b_ok;
    
    const l = Math.pow(Math.max(0, l_), 3);
    const m = Math.pow(Math.max(0, m_), 3);
    const s = Math.pow(Math.max(0, s_), 3);
    
    const r_linear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g_linear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const b_linear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    
    const f = (u: number) => {
      return u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055;
    };
    
    const r = Math.min(255, Math.max(0, Math.round(f(r_linear) * 255)));
    const g = Math.min(255, Math.max(0, Math.round(f(g_linear) * 255)));
    const b = Math.min(255, Math.max(0, Math.round(f(b_linear) * 255)));
    
    return { r, g, b, a: A };
  };

  const parseOklab = (str: string): { r: number; g: number; b: number; a: number } | null => {
    const regex = /oklab\s*\(\s*([\d.]+\%?)\s+([+-]?[\d.]+)\s+([+-]?[\d.]+)\s*(?:\/\s*([\d.]+\%?))?\s*\)/i;
    const commaRegex = /oklab\s*\(\s*([\d.]+\%?)\s*,\s*([+-]?[\d.]+)\s*,\s*([+-]?[\d.]+)\s*(?:,\s*([\d.]+\%?))?\s*\)/i;
    
    const match = str.match(regex) || str.match(commaRegex);
    if (!match) return null;
    
    const L_str = match[1];
    const a_str = match[2];
    const b_str = match[3];
    const A_str = match[4] || "1";
    
    const L = L_str.endsWith('%') ? parseFloat(L_str) / 100 : parseFloat(L_str);
    const a_ok = parseFloat(a_str);
    const b_ok = parseFloat(b_str);
    const A = A_str.endsWith('%') ? parseFloat(A_str) / 100 : parseFloat(A_str);
    
    const l_ = L + 0.3963377774 * a_ok + 0.2158037573 * b_ok;
    const m_ = L - 0.1055613458 * a_ok - 0.0638541728 * b_ok;
    const s_ = L - 0.0894841775 * a_ok - 1.2914855480 * b_ok;
    
    const l = Math.pow(Math.max(0, l_), 3);
    const m = Math.pow(Math.max(0, m_), 3);
    const s = Math.pow(Math.max(0, s_), 3);
    
    const r_linear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g_linear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const b_linear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    
    const f = (u: number) => {
      return u <= 0.0031308 ? 12.92 * u : 1.055 * Math.pow(u, 1 / 2.4) - 0.055;
    };
    
    const r = Math.min(255, Math.max(0, Math.round(f(r_linear) * 255)));
    const g = Math.min(255, Math.max(0, Math.round(f(g_linear) * 255)));
    const b = Math.min(255, Math.max(0, Math.round(f(b_linear) * 255)));
    
    return { r, g, b, a: A };
  };

  const replaceAllModernColorsInString = (str: string): string => {
    if (!str) return str;
    let res = str;
    
    // List of targets to process
    const targets = ['oklch(', 'oklab(', 'OKLCH(', 'OKLAB('];
    
    for (const target of targets) {
      let idx = res.indexOf(target);
      while (idx !== -1) {
        // Find matching closing parenthesis by tracking bracket depth
        let depth = 1;
        let i = idx + target.length;
        while (i < res.length && depth > 0) {
          if (res[i] === '(') {
            depth++;
          } else if (res[i] === ')') {
            depth--;
          }
          i++;
        }
        
        if (depth === 0) {
          const fullMatch = res.substring(idx, i);
          let replacement = 'rgba(41, 37, 36, 1)'; // general dark stone-950 fallback
          
          let parsedColor = null;
          try {
            // Only parse if it does not contain nested function blocks like var() or calc()
            if (!fullMatch.includes('var(') && !fullMatch.includes('calc(')) {
              if (target.toLowerCase().startsWith('oklch')) {
                parsedColor = parseOklch(fullMatch);
              } else {
                parsedColor = parseOklab(fullMatch);
              }
            }
          } catch (e) {
            // Ignore parse exception, rely on smart fallback
          }
          
          if (parsedColor) {
            replacement = `rgba(${parsedColor.r}, ${parsedColor.g}, ${parsedColor.b}, ${parsedColor.a})`;
          } else {
            // High-fidelity smart color mappings for beautiful layouts
            const numRegex = /[\d.]+/g;
            const numbers = fullMatch.match(numRegex);
            if (numbers && numbers.length >= 1) {
              const L = parseFloat(numbers[0]);
              const C = numbers[1] ? parseFloat(numbers[1]) : 0;
              const H = numbers[2] ? parseFloat(numbers[2]) : 0;
              
              if (L >= 0.90) {
                replacement = 'rgba(245, 245, 240, 1)'; // beautiful light cream
              } else if (L <= 0.25) {
                replacement = 'rgba(28, 25, 23, 1)'; // dark stone
              } else if (H >= 110 && H <= 165) {
                // Javanese Primbon green shades
                replacement = L > 0.6 ? 'rgba(74, 163, 80, 1)' : 'rgba(46, 125, 50, 1)';
              } else if (H >= 340 || H <= 45) {
                // Majestic warning / gold or warm accent tones
                replacement = L > 0.65 ? 'rgba(251, 192, 45, 1)' : 'rgba(180, 83, 9, 1)';
              } else {
                // Grayscaled neutrals
                if (L > 0.7) {
                  replacement = 'rgba(244, 244, 245, 1)';
                } else if (L > 0.4) {
                  replacement = 'rgba(120, 113, 108, 1)';
                } else {
                  replacement = 'rgba(41, 37, 36, 1)';
                }
              }
            }
          }
          
          res = res.substring(0, idx) + replacement + res.substring(i);
          idx = res.indexOf(target, idx + replacement.length);
        } else {
          // If unmatched parentheses, do replacement of word to guarantee no infinite loops
          res = res.substring(0, idx) + 'rgba(41, 37, 36, 1)' + res.substring(idx + target.length);
          idx = res.indexOf(target, idx);
        }
      }
    }
    
    return res;
  };

    const handleDownloadPDF = async () => {
    const target = resultRef.current;
    if (!target) return;
    setIsLoading(true);
    
    const originalId = target.getAttribute('id');
    const tempId = "pdf-target-element";
    target.setAttribute('id', tempId);

    const originalGetComputedStyle = window.getComputedStyle;
    const patchWindowStyle = (w: any) => {
      try {
        const orig = w.getComputedStyle;
        if (!orig) return;
        w.getComputedStyle = function(el: any, pseudo: any) {
          const style = orig.call(w, el, pseudo);
          return new Proxy(style, {
            get(targetStyle, prop) {
              const val = (targetStyle as any)[prop];
              if (typeof val === 'string' && (val.includes('oklch') || val.includes('oklab') || val.includes('OKLCH') || val.includes('OKLAB'))) {
                return replaceAllModernColorsInString(val);
              }
              if (typeof val === 'function') {
                if (prop === 'getPropertyValue') {
                  return function(propertyName: string) {
                    const originalVal = targetStyle.getPropertyValue(propertyName);
                    if (typeof originalVal === 'string' && (originalVal.includes('oklch') || originalVal.includes('oklab') || originalVal.includes('OKLCH') || originalVal.includes('OKLAB'))) {
                      return replaceAllModernColorsInString(originalVal);
                    }
                    return originalVal;
                  };
                }
                return val.bind(targetStyle);
              }
              return val;
            }
          });
        };
      } catch (patchErr) {
        console.error("Error patching window style", patchErr);
      }
    };

    patchWindowStyle(window);

    const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
    const originalLinkStates: { link: HTMLLinkElement; disabled: boolean }[] = [];
    const tempStyles: HTMLStyleElement[] = [];

    const liveStyleTags = Array.from(document.querySelectorAll('style:not(.temp-pdf-sanitized-style)')) as HTMLStyleElement[];
    const originalStylesContents = new Map<HTMLStyleElement, string>();

    // Sanitize all live style tags in the head/body of the actual page temporarily to prevent html2canvas crashes
    for (const style of liveStyleTags) {
      if (style.innerHTML && (style.innerHTML.includes('oklch') || style.innerHTML.includes('oklab') || style.innerHTML.includes('OKLCH') || style.innerHTML.includes('OKLAB'))) {
        originalStylesContents.set(style, style.innerHTML);
        style.innerHTML = replaceAllModernColorsInString(style.innerHTML);
      }
    }

    // Capture and clean all in-memory CSS rules from the original stylesheets
    let aggregatedCSS = '';
    const originalSheets = Array.from(document.styleSheets);
    for (const sheet of originalSheets) {
      try {
        if (!sheet.disabled) {
          const rules = sheet.cssRules || sheet.rules;
          if (rules) {
            for (let i = 0; i < rules.length; i++) {
              aggregatedCSS += rules[i].cssText + '\n';
            }
          }
        }
      } catch (e) {
        // Cross-origin stylesheets throw details error which we ignore
      }
    }

    // Create a major sanitized style element
    const sanitizedAggregatedCss = replaceAllModernColorsInString(aggregatedCSS);
    const mainSanitizedStyle = document.createElement('style');
    mainSanitizedStyle.className = 'temp-pdf-sanitized-style';
    mainSanitizedStyle.innerHTML = sanitizedAggregatedCss;
    document.head.appendChild(mainSanitizedStyle);
    tempStyles.push(mainSanitizedStyle);

    // Build the custom fake StyleSheetList
    const fakeSheetsList: CSSStyleSheet[] = [];
    if (mainSanitizedStyle.sheet) {
      fakeSheetsList.push(mainSanitizedStyle.sheet);
    }
    
    const fakeStyleSheetsList = Object.create(StyleSheetList.prototype);
    fakeSheetsList.forEach((sheet, idx) => {
      fakeStyleSheetsList[idx] = sheet;
    });
    Object.defineProperty(fakeStyleSheetsList, 'length', {
      get: () => fakeSheetsList.length,
      configurable: true
    });
    fakeStyleSheetsList.item = (index: number) => fakeSheetsList[index] || null;

    // Redefine document.styleSheets temporarily
    const originalStyleSheetsDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'styleSheets');
    try {
      Object.defineProperty(document, 'styleSheets', {
        get: () => fakeStyleSheetsList,
        configurable: true
      });
    } catch (err) {
      console.error("Error setting custom document.styleSheets getter", err);
    }
    
    try {
      // Disable original stylesheet links to ensure fallback
      for (const link of linkTags) {
        try {
          if (link.href) {
            originalLinkStates.push({ link, disabled: link.disabled });
            link.disabled = true;
          }
        } catch (fetchErr) {
          console.error("Error disabling link tag:", link.href, fetchErr);
        }
      }

      let canvas;
      // Stage 1: html2canvas
      try {
        canvas = await html2canvas(target, {
          scale: 1.5,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#F5F5F0',
          logging: true,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById(tempId);
            if (!clonedElement) {
              console.error("Cloned target element not found in onclone!");
              return;
            }

            if (clonedDoc.defaultView) {
              patchWindowStyle(clonedDoc.defaultView);
            }

            // Redefine clonedDoc.styleSheets getter
            try {
              Object.defineProperty(clonedDoc, 'styleSheets', {
                get: () => fakeStyleSheetsList,
                configurable: true
              });
            } catch (e) {
              console.error("Error setting custom clonedDoc.styleSheets getter", e);
            }

            // Add Branding / Header for PDF
            try {
              const header = clonedDoc.createElement('div');
              header.style.textAlign = 'center';
              header.style.marginBottom = '30px';
              header.style.padding = '20px';
              header.style.borderBottom = '2px solid #2E7D32';
              header.innerHTML = `
                <h1 style="font-family: serif; font-size: 28px; margin: 0; color: #1A1A1A;">HAMARE</h1>
                <p style="font-size: 14px; color: #2E7D32; font-weight: bold; margin: 5px 0 0 0;">Primbon Javanese & Pranata Mangsa Expert</p>
                <p style="font-size: 10px; color: #78716c; margin: 5px 0 0 0;">Generated on ${format(new Date(), 'EEEE, d MMMM yyyy HH:mm')}</p>
              `;
              
              clonedElement.insertBefore(header, clonedElement.firstChild);
            } catch (e) {
              console.error("Error inserting PDF header:", e);
            }

            // Hide action buttons to produce pristine outputs
            try {
              const buttons = clonedElement.querySelectorAll('button');
              buttons.forEach(btn => {
                (btn as HTMLElement).style.display = 'none';
              });
            } catch (btnErr) {
              console.error("Error hiding buttons in clone", btnErr);
            }

            // CRITICAL: Sanitize all style tags inside the cloned document as well
            try {
              const styleTags = clonedDoc.querySelectorAll('style');
              styleTags.forEach(style => {
                try {
                  if (style.innerHTML && (style.innerHTML.includes('oklch') || style.innerHTML.includes('oklab') || style.innerHTML.includes('OKLCH') || style.innerHTML.includes('OKLAB'))) {
                    const cleaned = replaceAllModernColorsInString(style.innerHTML);
                    if (cleaned !== style.innerHTML) {
                      style.innerHTML = cleaned;
                    }
                  }
                } catch (styleErr) {
                  console.error("Error sanitizing style tag:", styleErr);
                }
              });
            } catch (e) {
              console.error("Error sanitizing style tags:", e);
            }

            // CRITICAL: Sanitize all style sheets rules inside the cloned document as well
            try {
              const styleSheets = clonedDoc.styleSheets;
              for (let i = 0; i < styleSheets.length; i++) {
                try {
                  const sheet = styleSheets[i];
                  const rules = sheet.cssRules || sheet.rules;
                  if (rules) {
                    for (let j = 0; j < rules.length; j++) {
                      const rule = rules[j] as CSSStyleRule;
                      if (rule.style && rule.style.cssText) {
                        if (rule.style.cssText.includes('oklch') || rule.style.cssText.includes('oklab') || rule.style.cssText.includes('OKLCH') || rule.style.cssText.includes('OKLAB')) {
                          const cleaned = replaceAllModernColorsInString(rule.style.cssText);
                          if (cleaned !== rule.style.cssText) {
                            rule.style.cssText = cleaned;
                          }
                        }
                      }
                    }
                  }
                } catch (sheetErr) {
                  // Suppress cross-origin stylesheet errors
                }
              }
            } catch (e) {
              console.error("Error in stylesheet sanitization:", e);
            }
            
            try {
              const allElements = clonedElement.getElementsByTagName("*");
              for (let i = 0; i < allElements.length; i++) {
                const el = allElements[i] as HTMLElement;
                
                try {
                  const styleAttr = el.getAttribute('style');
                  if (styleAttr && (styleAttr.includes('oklch') || styleAttr.includes('oklab') || styleAttr.includes('OKLCH') || styleAttr.includes('OKLAB'))) {
                    const cleaned = replaceAllModernColorsInString(styleAttr);
                    if (cleaned !== styleAttr) {
                      el.style.cssText = cleaned;
                    }
                  }
                } catch (elErr) {
                  // Suppressed
                }
              }
            } catch (e) {
              console.error("Error in onclone styling traversal:", e);
            }
            
            // Force results to be visible in the clone by removing paywalls and unblurring
            try {
              const paywall = clonedElement.querySelector('.z-20');
              if (paywall) (paywall as HTMLElement).style.display = 'none';

              const blurreds = clonedElement.querySelectorAll('.blur-md');
              blurreds.forEach(b => {
                try {
                  (b as HTMLElement).classList.remove('blur-md');
                  (b as HTMLElement).style.filter = 'none';
                  (b as HTMLElement).style.pointerEvents = 'auto';
                  (b as HTMLElement).style.userSelect = 'auto';
                } catch (err) {}
              });
            } catch (e) {
              console.error("Error cleaning paywall / blur in clone:", e);
            }
          }
        });
      } catch (error: any) {
        console.error("PDF Stage Failed:", {
          stage: "html2canvas",
          error,
          stack: error?.stack
        });
        throw error;
      }
      
      // Stage 2: generate HTML / image conversion
      let imgData;
      try {
        imgData = canvas.toDataURL('image/png');
      } catch (error: any) {
        console.error("PDF Stage Failed:", {
          stage: "generate HTML",
          error,
          stack: error?.stack
        });
        throw error;
      }
      
      // Stage 3: create PDF
      let pdf;
      try {
        pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        const drawWatermark = (pObj: typeof pdf, w: number, h: number) => {
          try {
            pObj.setTextColor(220, 225, 218); 
            pObj.setFont("Helvetica", "bold");
            pObj.setFontSize(55);
            pObj.text("HAMARÉ", w / 2, h / 2, {
              align: "center",
              angle: 45
            });
            pObj.setFontSize(10);
            pObj.setTextColor(180, 185, 178);
            pObj.text("HAMARÉ BRANDING - AUTHENTIC PRIMBON REPORT", 15, pageHeight - 10);
            pObj.text(`Halaman ${pObj.getNumberOfPages()}`, w - 25, pageHeight - 10);
          } catch (err) {
            console.error("Watermark drawing error:", err);
          }
        };

        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        drawWatermark(pdf, pdfWidth, pageHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft > 0) {
          pdf.addPage();
          position = - (imgHeight - heightLeft);
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
          drawWatermark(pdf, pdfWidth, pageHeight);
          heightLeft -= pageHeight;
        }
      } catch (error: any) {
        console.error("PDF Stage Failed:", {
          stage: "create PDF",
          error,
          stack: error?.stack
        });
        throw error;
      }
      
      // Stage 4: save PDF
      try {
        pdf.save(`Hamare-${activeTab}-${format(new Date(), 'ddMMyy-HHmm')}.pdf`);
      } catch (error: any) {
        console.error("PDF Stage Failed:", {
          stage: "save PDF",
          error,
          stack: error?.stack
        });
        throw error;
      }
    } catch (error) {
      console.error("PDF Export Error:", error);
      alert("Gagal mengunduh PDF: " + (error as Error).message);
    } finally {
      // Restore window.getComputedStyle
      if (originalGetComputedStyle) {
        window.getComputedStyle = originalGetComputedStyle;
      }

      // Restore document.styleSheets
      if (originalStyleSheetsDescriptor) {
        try {
          Object.defineProperty(document, 'styleSheets', originalStyleSheetsDescriptor);
        } catch (restoreErr) {
          console.error("Error restoring document.styleSheets descriptor", restoreErr);
        }
      } else {
        try {
          delete (document as any).styleSheets;
        } catch (restoreErr) {
          console.error("Error deleting custom document.styleSheets", restoreErr);
        }
      }

      // 1. Restore live style original contents
      for (const [style, originalContent] of originalStylesContents.entries()) {
        try {
          style.innerHTML = originalContent;
        } catch (restoreErr) {
          console.error("Error restoring live style:", restoreErr);
        }
      }

      // 2. Restore links back to their original state and cleanup the temporary style elements
      for (const state of originalLinkStates) {
        state.link.disabled = state.disabled;
      }
      for (const style of tempStyles) {
        style.remove();
      }
      if (target) {
        if (originalId) {
          target.setAttribute('id', originalId);
        } else {
          target.removeAttribute('id');
        }
      }
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
        <AdminDashboard onBack={() => setIsAdminMode(false)} visitorStats={visitorStats} />
      ) : isDashboardMode && profile ? (
        <UserDashboard onBack={() => setIsDashboardMode(false)} />
      ) : (
        <>
          <header className="max-w-6xl mx-auto mb-8 text-center" id="header">
            {isExpired && !isDashboardMode && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-red-800">Masa Langganan Habis</p>
                    <p className="text-xs text-red-600">Akses premium Anda telah berakhir. Silakan perbarui paket Anda.</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsDashboardMode(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold h-10 rounded-xl whitespace-nowrap"
                >
                  PERBARUI SEKARANG
                </Button>
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full border-b border-stone-200/60 pb-4 mb-6" id="header-top-bar">
              <div className="flex items-center gap-2" id="brand-logo">
                <span className="font-serif font-bold text-lg text-[#2E7D32] tracking-wider">HAMARÉ</span>
                <span className="text-[9px] bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Weton & Wisdom</span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3" id="header-controls">
                <div className="flex gap-0.5 bg-stone-200/40 p-0.5 rounded-full" id="lang-selector-group">
                  {['id', 'jv', 'en'].map((lng) => (
                    <Button 
                      key={lng}
                      variant="ghost" 
                      size="sm" 
                      onClick={() => i18nInstance.changeLanguage(lng)}
                      className={cn("text-[10px] font-extrabold px-2.5 h-6 rounded-full transition-all", i18nInstance.language === lng ? "text-white bg-[#2E7D32] shadow-sm" : "text-stone-600 hover:bg-stone-200/30")}
                    >
                      {lng.toUpperCase()}
                    </Button>
                  ))}
                </div>
                
                {profile ? (
                  <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2" id="user-controls-group">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsDashboardMode(true)}
                      className="h-7 text-[10px] font-bold px-3 text-[#2E7D32] border border-[#2E7D32]/25 hover:bg-[#2E7D32]/10 rounded-full transition-all"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-1" /> DASHBOARD
                    </Button>
                    {isAdmin && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => setIsAdminMode(true)}
                        className="h-7 text-[10px] font-bold px-3 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-sm rounded-full transition-all"
                      >
                        <Shield className="w-3.5 h-3.5 mr-1" /> PANEL ADMIN
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={logout} className="h-7 text-[10px] font-bold px-3 text-stone-600 border-stone-300 hover:bg-stone-100 rounded-full transition-all">
                      <LogOut className="w-3.5 h-3.5 mr-1" /> KELUAR
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={openLogin} className="h-7 text-[10px] font-bold px-4 text-[#2E7D32] border-[#2E7D32]/30 hover:bg-[#2E7D32]/10 rounded-full transition-all" id="auth-button">
                    <LogIn className="w-3.5 h-3.5 mr-1" /> MASUK / DAFTAR
                  </Button>
                )}
              </div>
            </div>

            <AuthModal 
              isOpen={isAuthModalOpen} 
              onClose={() => setIsAuthModalOpen(false)} 
              defaultMode={authModalMode}
            />

            <MemberOfferModal
              isOpen={isMemberOfferOpen}
              onClose={() => setIsMemberOfferOpen(false)}
              onLoginClick={handleConfirmLoginFromOffer}
              onRegisterClick={handleConfirmRegisterFromOffer}
              onContinueAsGuest={handleContinueAsGuestFromOffer}
              guestCountRemaining={guestGenerateCount}
            />

            <div className="mt-4 md:mt-6"></div>

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
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-stone-500 font-sans text-xs md:text-sm max-w-2xl mx-auto mt-3 leading-relaxed"
          id="main-opening-narrative"
        >
          {t('openingNarrative')}
        </motion.p>
      </header>

      <main className="max-w-6xl mx-auto space-y-8" id="main-content">
        <div className="w-full">
          {/* --- Infinite Calendar --- */}
          <div className="w-full">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md overflow-hidden" id="calendar-card">
              <CardHeader className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pb-7 bg-stone-900 text-white">
                <div className="text-center md:text-left">
                  <CardTitle className="font-serif text-3xl">
                    {getJavaneseMonthName(currentMonth.getMonth())}, {getJavaneseYearDetails(currentMonth.getFullYear()).year} {getJavaneseYearDetails(currentMonth.getFullYear()).name} ({format(currentMonth, 'MMMM', { locale: dateLocale })}, {currentMonth.getFullYear()})
                  </CardTitle>
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
                    <div key={day} className="py-3 text-center text-xs font-bold text-stone-800 uppercase tracking-widest">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, idx) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const details = getJavaneseDetails(day);
                    
                    const java = getJavaDate(day);
                    const pm = getPMDate(day);
                    const sifat = getSifatHari(day);
                    const st = getSTValue(java.day);
                    const javaYearInfo = getJavaneseYearDetails(day.getFullYear());
                    const pasaran = getPasaran(day);
                    
                    return (
                      <div
                        key={idx}
                        className={cn(
                          "h-24 md:h-32 p-1.5 border-r border-b border-stone-50 text-left transition-all group relative overflow-hidden cursor-pointer hover:bg-stone-50/80 active:scale-[0.98]",
                          !isCurrentMonth && "opacity-30",
                          isSelected && "bg-stone-50 ring-1 ring-inset ring-stone-200 shadow-inner"
                        )}
                        onClick={() => {
                          setSelectedDate(day);
                          setIsCalendarDetailModalOpen(true);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <span className={cn(
                            "text-base md:text-lg font-medium leading-none",
                            isSelected ? "text-stone-900" : "text-stone-600"
                          )}>
                            {format(day, 'd')}
                          </span>
                          {st && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 rounded border border-red-200">
                              {st}
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-1 flex flex-col gap-0.5">
                          <div className="flex justify-between items-start gap-1">
                            <p className="text-[9px] md:text-[10px] font-bold text-[#2E7D32] leading-tight">
                              {java.day} {java.month} {javaYearInfo.year} {javaYearInfo.name}
                            </p>
                            <span className="text-[8px] md:text-[9px] font-mono font-bold text-stone-500 whitespace-nowrap bg-stone-100 px-1 rounded-sm">
                              {pasaran.split('-')[0].trim()}
                            </span>
                          </div>
                          
                          <p className="text-[8px] md:text-[9px] text-amber-700 font-medium truncate">
                            PM: {pm.day} {pm.name.split(' ')[0]}
                          </p>
                          
                          <p className="text-[8px] text-stone-500 truncate italic">
                            {sifat.split('.')[1].trim()}
                          </p>
                          
                          <p className="text-[8px] text-stone-400 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {pasaran} • {details.wuku}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
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
              <p className="text-stone-300 text-xs mt-1.5 font-medium leading-relaxed">
                {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: dateLocale })} — {javaSelected.day} {javaSelected.month} {jYearSelected.year} {jYearSelected.name} (Pasaran: {pasaranSelected.split('-')[0].trim()})
              </p>
            </CardHeader>
            <CardContent className="p-0 relative">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
                {/* Visible Section (100%) */}
                <div className="p-6 space-y-6">
                  <DetailItem label="Tanggal Jawa" value={`${javaSelected.day} ${javaSelected.month} ${jYearSelected.year} ${jYearSelected.name}`} subValue={`Pasaran: ${pasaranSelected}`} icon={<Moon className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.dayLambang')} value={`${wetonDetails.jawiDayName} (${wetonDetails.dayLambang})`} icon={<Sun className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.pasaranDewa')} value={`${wetonDetails.pasaranName} (${wetonDetails.pasaranDewa})`} icon={<Zap className="w-4 h-4" />} />
                </div>
                
                <div className="p-6 space-y-6 bg-stone-50/50">
                  <DetailItem label={t('weton.labels.daySifat')} value={t(wetonDetails.daySifat)} isLongText />
                  <DetailItem label={t('weton.labels.pasaranSifat')} value={t(wetonDetails.pasaranSifat)} isLongText />
                  <DetailItem label={t('hariBaik.gisir') || 'Gisir Harian'} value={wetonDetails.gisir} subValue={t(wetonDetails.gisirSifat)} icon={<Info className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.tahunSaka')} value={`${wetonDetails.tahunSaka}`} subValue={t(wetonDetails.tahunSakaSifat)} icon={<CalendarIcon className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.windu')} value={`${wetonDetails.windu}`} subValue={t(wetonDetails.winduSifat)} icon={<Wind className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.lambang')} value={`${wetonDetails.lambang}`} subValue={t(wetonDetails.lambangSifat)} icon={<Info className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.tahunJawi')} value={`${wetonDetails.tahunJawi}`} subValue={t(wetonDetails.tahunJawiSifat)} icon={<ArrowRight className="w-4 h-4" />} />
                  <DetailItem label={t('weton.labels.pranataMangsa')} value={`Tanggal ${wetonDetails.pranataMangsaDay} ${wetonDetails.pranataMangsa}`} subValue={t(wetonDetails.pranataMangsaSifat)} icon={<Compass className="w-4 h-4" />} />
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
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-stone-200/50 p-1 rounded-xl" id="tabs-list">
            <TabsTrigger 
              value="weton" 
              className="rounded-lg transition-all data-[state=active]:bg-[#FBC02D] data-[state=inactive]:bg-[#2E7D32] data-[state=inactive]:text-white data-[state=active]:text-black font-bold text-xs sm:text-sm" 
              id="tab-weton"
            >
              {t('tabs.weton')}
            </TabsTrigger>
            <TabsTrigger 
              value="jodoh" 
              className="rounded-lg transition-all data-[state=active]:bg-[#FBC02D] data-[state=inactive]:bg-[#2E7D32] data-[state=inactive]:text-white data-[state=active]:text-black font-bold text-xs sm:text-sm" 
              id="tab-jodoh"
            >
              {t('tabs.jodoh')}
            </TabsTrigger>
            <TabsTrigger 
              value="hari-baik" 
              className="rounded-lg transition-all data-[state=active]:bg-[#FBC02D] data-[state=inactive]:bg-[#2E7D32] data-[state=inactive]:text-white data-[state=active]:text-black font-bold text-xs sm:text-sm" 
              id="tab-hari-baik"
            >
              {t('tabs.hariBaik')}
            </TabsTrigger>
            <TabsTrigger 
              value="hitung-nama" 
              className="rounded-lg transition-all data-[state=active]:bg-[#FBC02D] data-[state=inactive]:bg-[#2E7D32] data-[state=inactive]:text-white data-[state=active]:text-black font-bold text-xs sm:text-sm" 
              id="tab-hitung-nama"
            >
              {t('tabs.hitungNama')}
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
                          {/* Calculation Details for PDF */}
                          <div className="p-4 bg-stone-100/50 rounded-xl border border-stone-200 mb-4">
                            <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Detail Perhitungan</p>
                            <p className="text-sm font-medium text-stone-700">Analisis Weton Kelahiran untuk: <span className="font-bold text-stone-900">{format(wetonKelahiranDetails.masehiDate, 'EEEE, d MMMM yyyy', { locale: dateLocale })}</span></p>
                          </div>

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
                            
                            {wetonKelahiranAgeStats && wetonKelahiranPenghidupan && (
                              <div className="col-span-1 md:col-span-2 mt-4 p-6 bg-amber-50/55 rounded-xl border border-amber-100/70 space-y-4 shadow-sm text-left">
                                <div className="flex items-center gap-2 border-b border-amber-200/50 pb-2">
                                  <Clock className="w-5 h-5 text-amber-700" />
                                  <h4 className="font-serif font-bold text-lg text-stone-850">Analisis Usia &amp; Jatah Penghidupan</h4>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                  <div>
                                    <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">Perhitungan Usia (365 Hari/Tahun)</p>
                                    <p className="text-lg font-serif font-bold text-stone-900 mt-1">
                                      {wetonKelahiranAgeStats.ageYears} Tahun <span className="text-xs text-stone-500 font-sans">({wetonKelahiranAgeStats.diffDays.toLocaleString()} hari)</span>
                                    </p>
                                    <p className="text-xs text-stone-400 mt-0.5">Sesuai rentang siklus: {wetonKelahiranPenghidupan.rangeText}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-amber-800 uppercase font-bold tracking-wider">Nilai Jatah Penghidupan Usia Ini</p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                      <span className="text-2xl font-serif font-bold text-[#2E7D32]">
                                        {wetonKelahiranPenghidupan.value}
                                      </span>
                                      <span className="text-xs text-stone-400 font-sans">/ 8</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-white p-4 rounded-lg border border-stone-100 space-y-2 shadow-sm text-left">
                                  <p className="text-xs text-stone-500 uppercase font-bold tracking-wider">Keterangan Penghidupan</p>
                                  <p className="text-sm font-medium text-stone-805 leading-relaxed font-serif">
                                    &ldquo;{wetonKelahiranPenghidupan.label}&rdquo;
                                  </p>
                                </div>
                                
                                <div className="bg-amber-100/30 p-4 rounded-lg border border-amber-200/50 space-y-1 text-left">
                                  <p className="text-xs text-amber-800 uppercase font-bold tracking-widest flex items-center gap-1.5 font-sans">
                                    <Info className="w-3.5 h-3.5" /> Saran Penyiasatan Rejeki
                                  </p>
                                  <p className="text-xs text-amber-950 leading-relaxed italic">
                                    {wetonKelahiranPenghidupan.saran}
                                  </p>
                                </div>
                              </div>
                            )}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8" id="jodoh-inputs-grid">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 font-bold"><User className="w-4 h-4 text-[#2E7D32]" /> {t('jodoh.fullNameSelf')}</Label>
                          <Input 
                            type="text" 
                            placeholder={t('jodoh.fullNameSelf')}
                            value={nameSelf}
                            onChange={(e) => {
                              setNameSelf(e.target.value);
                              setJodohResult(null);
                              setJodohNamaResult(null);
                            }}
                            className="bg-stone-50 border-stone-200 h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 font-bold"><CalendarIcon className="w-4 h-4 text-[#2E7D32]" /> {t('jodoh.birthDateSelf')}</Label>
                          <Input 
                            type="date" 
                            min="1582-01-01"
                            max="2100-12-31"
                            value={format(birthDateSelf, 'yyyy-MM-dd')}
                            onChange={(e) => handleDateSelfChange(new Date(e.target.value))}
                            className="bg-stone-50 border-stone-200 h-12"
                          />
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-[10px] font-bold text-green-600 uppercase">{t('jodoh.mangsaSelf')}</p>
                          <p className="font-bold text-green-800">{mangsaSelfData?.name}</p>
                          <p className="text-[10px] text-green-700 mt-1 leading-relaxed italic">{mangsaSelfData?.sifat}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 font-bold"><Users className="w-4 h-4 text-[#2E7D32]" /> {t('jodoh.fullNamePartner')}</Label>
                          <Input 
                            type="text" 
                            placeholder={t('jodoh.fullNamePartner')}
                            value={namePartner}
                            onChange={(e) => {
                              setNamePartner(e.target.value);
                              setJodohResult(null);
                              setJodohNamaResult(null);
                            }}
                            className="bg-stone-50 border-stone-200 h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2 font-bold"><CalendarIcon className="w-4 h-4 text-[#2E7D32]" /> {t('jodoh.birthDatePartner')}</Label>
                          <Input 
                            type="date" 
                            min="1582-01-01"
                            max="2100-12-31"
                            value={format(birthDatePartner, 'yyyy-MM-dd')}
                            onChange={(e) => handleDatePartnerChange(new Date(e.target.value))}
                            className="bg-stone-50 border-stone-200 h-12"
                          />
                        </div>
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
                          {/* PDF Only Section - Hidden in UI but visible to html2canvas if we need more info */}
                          <div className={cn("space-y-6 transition-all", showPaywall && "blur-md select-none pointer-events-none")}>
                            
                            {/* Detailed Info for PDF */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Card className="border border-stone-100 bg-stone-50/50" id="jodoh-card-self">
                                <CardHeader className="p-4 bg-stone-100/50">
                                  <CardTitle className="text-xs font-bold uppercase text-stone-500">Data Diri</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                  {nameSelf && (
                                    <div>
                                      <p className="text-[10px] text-stone-400 uppercase font-bold">Nama Lengkap</p>
                                      <p className="font-serif font-bold text-stone-800">{nameSelf}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-[10px] text-stone-400 uppercase font-bold">Tanggal Lahir</p>
                                    <p className="font-serif font-bold text-stone-800">{format(birthDateSelf, 'EEEE, d MMMM yyyy', { locale: dateLocale })}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-stone-400 uppercase font-bold">Pranata Mangsa</p>
                                    <p className="font-serif font-bold text-[#2E7D32]">{mangsaSelfData?.name}</p>
                                    <p className="text-[11px] text-stone-600 italic mt-1 leading-relaxed">"{mangsaSelfData?.sifat}"</p>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="border border-stone-100 bg-stone-50/50" id="jodoh-card-partner">
                                <CardHeader className="p-4 bg-stone-100/50">
                                  <CardTitle className="text-xs font-bold uppercase text-stone-500">Data Pasangan</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                  {namePartner && (
                                    <div>
                                      <p className="text-[10px] text-stone-400 uppercase font-bold">Nama Lengkap</p>
                                      <p className="font-serif font-bold text-stone-800">{namePartner}</p>
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-[10px] text-stone-400 uppercase font-bold">Tanggal Lahir</p>
                                    <p className="font-serif font-bold text-stone-800">{format(birthDatePartner, 'EEEE, d MMMM yyyy', { locale: dateLocale })}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] text-stone-400 uppercase font-bold">Pranata Mangsa</p>
                                    <p className="font-serif font-bold text-[#2E7D32]">{mangsaPartnerData?.name}</p>
                                    <p className="text-[11px] text-stone-600 italic mt-1 leading-relaxed">"{mangsaPartnerData?.sifat}"</p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <div className="p-8 rounded-2xl bg-stone-50 border-2 border-stone-100 text-center relative overflow-hidden" id="jodoh-mangsa-result-box">
                              <div className="text-xs text-stone-400 font-bold uppercase tracking-widest mb-1">PERHITUNGAN PRANATA MANGSA</div>
                              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-stone-500 mb-2">{t('jodoh.status')}</h3>
                              <p className={cn(
                                "text-3xl font-serif font-bold",
                                jodohResult.status.includes('Berjodoh') ? "text-[#2E7D32]" : "text-stone-700"
                              )}>
                                {jodohResult.status.includes('Pinasti') ? t('jodoh.results.pinasti.status') : 
                                 jodohResult.status === 'Serasi' ? t('jodoh.results.serasi.status') : 
                                 t('jodoh.results.kendala.status')}
                              </p>
                              
                              <Separator className="my-6" />
                              <p className="text-lg leading-relaxed text-stone-600 italic">
                                "{jodohResult.status.includes('Pinasti') ? t('jodoh.results.pinasti.pesan') : 
                                  jodohResult.status === 'Serasi' ? t('jodoh.results.serasi.pesan') : 
                                  t('jodoh.results.kendala.pesan')}"
                              </p>
                            </div>

                             {jodohNamaResult && (
                              <Card className="border border-stone-200 bg-[#FBC02D]/10 overflow-hidden" id="jodoh-name-result-box">
                                <CardHeader className="bg-amber-100/40 border-b border-amber-200/50 p-5">
                                  <CardTitle className="text-base font-serif font-bold text-amber-900 flex items-center justify-center gap-2">
                                    <Heart className="w-5 h-5 text-amber-600 fill-amber-500 animate-pulse" />
                                    Hasil Perhitungan Aksara Nama (Petung Aksara Jawa)
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4 text-center">
                                  <div className="space-y-2">
                                    <div className="text-sm font-serif text-stone-700 animate-pulse">
                                      Total Skor: <span className="font-bold text-stone-950">{jodohNamaResult.selfResult.score}</span> (Anda) + <span className="font-bold text-stone-950">{jodohNamaResult.partnerResult.score}</span> (Pasangan) = <span className="font-bold text-stone-950">{jodohNamaResult.totalScore}</span>
                                    </div>
                                    <div className="text-sm font-serif text-stone-700">
                                      Sisa: <span className="font-bold text-[#2E7D32]">{jodohNamaResult.sisa}</span>
                                    </div>
                                    <div className="text-sm font-serif text-stone-700">
                                      Hasil: <span className="font-bold text-stone-900">{t(jodohNamaResult.titleKey)}</span>
                                    </div>
                                    <div className="text-sm font-serif text-stone-700">
                                      Arti: <span className="font-bold text-stone-800">"{t(jodohNamaResult.descKey)}"</span>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {/* Keterangan Akhir Hasil */}
                            <div className="p-6 rounded-2xl bg-[#FFF9C4]/20 border border-[#FBC02D]/30 text-center max-w-2xl mx-auto my-4" id="jodoh-final-disclaimer">
                              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic font-medium">
                                "Dalam Petung Jawa, hitungan Jodoh Pinasti adalah tidak untuk dilanggar jika ingin mendapatkan kehidupan pernikahan dan rumah tangga yang harmonis dan bahagia. Namun, jika sudah terlanjur menikah maka dapat melakukan lelaku untuk mengatasi hasil perhitungan yang kurang baik, salah satunya adalah dengan melakukan Seratan Winadi di setiap weton pernikahannya."
                              </p>
                            </div>
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
                                {/* Meta info for PDF */}
                                <div className="p-4 bg-stone-100/50 rounded-xl border border-stone-200 mb-6 hidden md:block">
                                  <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">Target Hari</p>
                                  <p className="text-sm font-bold text-stone-900">{format(hariBaikDetails.masehiDate, 'EEEE, d MMMM yyyy', { locale: dateLocale })}</p>
                                  <p className="text-xs text-stone-600">{hariBaikDetails.pasaranName} • Wuku {hariBaikDetails.wuku} • Neptu {hariBaikDetails.neptuValue}</p>
                                </div>

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

            {/* --- Hitung Nama --- */}
            <TabsContent value="hitung-nama" key="hitung-nama" id="content-hitung-nama">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <Card className="border-none shadow-xl bg-white/90 backdrop-blur-lg overflow-hidden" id="hitung-nama-input-card">
                  <CardHeader className="bg-stone-900 text-white text-center py-6">
                    <Compass className="w-10 h-10 mx-auto mb-2 text-[#FBC02D] animate-pulse" />
                    <CardTitle className="font-serif text-2xl">Hitung Nama & Brand</CardTitle>
                    <CardDescription className="text-stone-300">
                      Fitur ini dapat digunakan untuk menghitung nama orang maupun nama usaha/ brand berdasarkan Petung Jawa dan Sengkalan.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="input-nama-hitung" className="font-bold text-stone-700">Nama Lengkap / Nama Bisnis</Label>
                        <Input 
                          id="input-nama-hitung"
                          type="text" 
                          placeholder="Masukkan nama lengkap atau nama brand..."
                          value={nameInput}
                          onChange={(e) => {
                            setNameInput(e.target.value);
                            setHitungNamaResult(null);
                          }}
                          className="bg-stone-50 border-stone-200 h-12"
                        />
                      </div>
                      <Button 
                        className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
                        onClick={() => {
                          if (nameInput.trim()) {
                            const res = calculateHitungNama(nameInput);
                            setHitungNamaResult(res);
                          }
                        }}
                      >
                        Mulai Hitung
                      </Button>
                    </div>

                    {hitungNamaResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 space-y-6"
                        ref={activeTab === 'hitung-nama' ? resultRef : null}
                      >
                        <Card className="border border-stone-200 bg-[#FBC02D]/10 overflow-hidden" id="hitung-nama-result-box">
                          <CardHeader className="bg-amber-100/40 border-b border-amber-200/50 p-5">
                            <CardTitle className="text-base font-serif font-bold text-amber-900 flex items-center justify-center gap-2 font-medium">
                              Hasil Perhitungan Aksara Nama
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-6 space-y-4 text-center">
                            <div className="space-y-2">
                              <div className="text-sm font-serif text-stone-700">
                                Hasil: <span className="font-bold text-stone-900">{hitungNamaResult.title}</span>
                              </div>
                              <div className="text-sm font-serif text-stone-700">
                                Arti: <span className="font-bold text-stone-800">"{hitungNamaResult.desc}"</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Keterangan Akhir Hasil */}
                        <div className="p-6 rounded-2xl bg-[#FFF9C4]/20 border border-[#FBC02D]/30 text-center max-w-2xl mx-auto" id="hitung-nama-final-disclaimer">
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic font-medium">
                            "Dalam Petung Jawa, hitungan ini adalah tidak untuk dilanggar. Namun, jika sudah terlanjur maka dapat melakukan lelaku untuk mengatasi hasil perhitungan yang kurang baik, salah satunya adalah dengan melakukan Seratan Winadi di setiap weton kelahirannya atau weton berdirinya usaha tersebut."
                          </p>
                        </div>

                        {/* Download PDF Button */}
                        <div className="max-w-md mx-auto mt-4" id="hitung-nama-pdf-download-btn-wrapper">
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
          </AnimatePresence>
        </div>
      </Tabs>

      {/* Statistik Kunjungan Situs */}
      <div className="mt-12 bg-white/60 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-lg text-stone-800" id="site-visitor-stats">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#2E7D32]" />
              Statistik Kunjungan
            </h3>
            <p className="text-xs text-stone-500">Data kunjungan real-time pengunjung situs HAMARÉ</p>
          </div>
          <div className="flex items-center gap-2 bg-stone-100/80 px-3 py-1.5 rounded-full text-[10px] font-bold text-stone-600">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            SINKRONISASI REAL-TIME
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {/* Total Visitor - Bulan Berjalan */}
          <div className="bg-stone-50/50 p-5 rounded-2xl border border-stone-100 shadow-sm">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Visitor Bulan Ini</p>
            <h4 className="text-3xl font-serif font-bold text-[#2E7D32]">{visitorStats.totalVisitorsCurrentMonth.toLocaleString('id-ID')}</h4>
            <p className="text-[10px] text-stone-500 mt-2">Total pengunjung unik bulan berjalan</p>
          </div>

          {/* Total Visitor - Sejak Berdiri */}
          <div className="bg-stone-50/50 p-5 rounded-2xl border border-stone-100 shadow-sm">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Total Visitor</p>
            <h4 className="text-3xl font-serif font-bold text-stone-900">{visitorStats.totalVisitorsAllTime.toLocaleString('id-ID')}</h4>
            <p className="text-[10px] text-stone-500 mt-2">Akumulasi pengunjung unik sejak berdiri</p>
          </div>

          {/* Pengunjung Berulang - Bulan Berjalan */}
          <div className="bg-stone-50/50 p-5 rounded-2xl border border-stone-100 shadow-sm">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Visitor Berulang Bulan Ini</p>
            <h4 className="text-3xl font-serif font-bold text-amber-600">{visitorStats.returningVisitorsCurrentMonth.toLocaleString('id-ID')}</h4>
            <p className="text-[10px] text-stone-500 mt-2">Pengunjung unik berulang (2x+) bulan ini</p>
          </div>

          {/* Pengunjung Berulang - Sejak Berdiri */}
          <div className="bg-stone-50/50 p-5 rounded-2xl border border-stone-100 shadow-sm">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Total Visitor Berulang</p>
            <h4 className="text-3xl font-serif font-bold text-stone-700">{visitorStats.returningVisitorsAllTime.toLocaleString('id-ID')}</h4>
            <p className="text-[10px] text-stone-500 mt-2">Akumulasi unik berulang (2x+) keseluruhan</p>
          </div>
        </div>
      </div>

      {/* --- Public Blog Feed --- */}
      <div className="mt-12 space-y-6" id="latest-articles-section">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#2E7D32]" />
          <h3 className="font-serif font-bold text-xl text-stone-800">Artikel Terbaru</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publicArticles.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white/50 rounded-2xl border border-dashed border-stone-200">
              <p className="text-sm text-stone-400 italic">Belum ada artikel publik.</p>
            </div>
          ) : (
            publicArticles.map((article) => (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                key={article.id}
                className="h-full"
              >
                <Card className="border-none shadow-md hover:shadow-lg transition-all overflow-hidden group h-full flex flex-col bg-white">
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-base font-serif font-bold group-hover:text-[#2E7D32] transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-stone-500 flex items-center gap-2 text-xs mt-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" /> {article.createdAt ? format(article.createdAt.toDate(), 'dd MMM yyyy') : '-'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 flex-1">
                    <p className="text-xs text-stone-500 line-clamp-4 leading-relaxed">
                      {article.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
      </main>
    </>
    )}

      {/* Kemitraan & Dukungan Section - Now visible on every page */}
      <div className="max-w-6xl mx-auto mt-16 space-y-6 w-full" id="partnership-support-section">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-[#2E7D32]" />
          <h3 className="font-serif font-bold text-xl text-stone-800">{t('partnership.title')}</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kotak 1 */}
          <div className="bg-white hover:bg-stone-50/50 p-6 rounded-2xl border border-stone-200/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between h-full group" id="support-box-donation">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-base text-stone-800">{t('partnership.donation.title')}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {t('partnership.donation.desc')}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleShowSegeraHadir("donation")}
                className="w-full text-xs font-bold border-stone-200 hover:bg-stone-50 hover:text-stone-900 group"
                id="donation-detail-btn"
              >
                {t('partnership.detailBtn')} <ArrowRight className="w-3 h-3 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Kotak 2 */}
          <div className="bg-white hover:bg-stone-50/50 p-6 rounded-2xl border border-stone-200/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between h-full group" id="support-box-business">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-base text-stone-800">{t('partnership.business.title')}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {t('partnership.business.desc')}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleShowSegeraHadir("business")}
                className="w-full text-xs font-bold border-stone-200 hover:bg-stone-50 hover:text-stone-900 group"
                id="business-detail-btn"
              >
                {t('partnership.detailBtn')} <ArrowRight className="w-3 h-3 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          {/* Kotak 3 */}
          <div className="bg-white hover:bg-stone-50/50 p-6 rounded-2xl border border-stone-200/80 shadow-md hover:shadow-lg transition-all flex flex-col justify-between h-full group" id="support-box-research">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#E8F5E9] flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#2E7D32]" />
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-base text-stone-800">{t('partnership.research.title')}</h4>
                <p className="text-xs text-stone-500 leading-relaxed">
                  {t('partnership.research.desc')}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleShowSegeraHadir("research")}
                className="w-full text-xs font-bold border-stone-200 hover:bg-stone-50 hover:text-stone-900 group"
                id="research-detail-btn"
              >
                {t('partnership.detailBtn')} <ArrowRight className="w-3 h-3 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Segera Hadir Modal Pop-up */}
      <AnimatePresence>
        {segeraHadirData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 selection:bg-amber-100" id="segera-hadir-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
              onClick={() => setSegeraHadirData(null)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-stone-100 relative z-10 flex flex-col items-center text-center"
              id="segera-hadir-modal"
            >
              <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-amber-600 animate-pulse" />
              </div>
              
              <div className="bg-amber-100/60 text-amber-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest mb-3">
                {t('partnership.comingSoon')}
              </div>

              <h4 className="font-serif font-bold text-xl text-stone-900 mb-2">
                {t(`partnership.${segeraHadirData.type}.popTitle`)}
              </h4>
              
              <p className="text-sm text-stone-600 leading-relaxed mb-6">
                {t(`partnership.${segeraHadirData.type}.popDesc`)}
              </p>

              <Button 
                onClick={() => setSegeraHadirData(null)}
                className="w-full bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all"
                id="segera-hadir-close-btn"
              >
                {t('partnership.closeBtn')}
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Calendar Date Detail Modal Pop-up */}
      <AnimatePresence>
        {isCalendarDetailModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 selection:bg-amber-100" id="calendar-detail-overlay">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
              onClick={() => setIsCalendarDetailModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-100 relative z-10 flex flex-col overflow-hidden max-h-[90vh]"
              id="calendar-detail-modal"
            >
              {/* Top Banner with Javanese Aesthetic */}
              <div className="bg-stone-900 text-white p-6 relative">
                <button
                  onClick={() => setIsCalendarDetailModalOpen(false)}
                  className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full"
                  aria-label="Tutup"
                  id="close-calendar-detail-modal"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="space-y-1 pr-6 text-left">
                  <span className="text-[10px] bg-[#2E7D32] text-green-50 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {t('weton.selectedDate') || 'Detail Weton'}
                  </span>
                  <h3 className="font-serif font-bold text-2xl md:text-3xl mt-1.5 leading-tight">
                    {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: dateLocale })}
                  </h3>
                  <p className="text-stone-300 text-xs font-serif font-medium mt-1">
                    {javaSelected.day} {javaSelected.month} {jYearSelected.year} {jYearSelected.name} (Pasaran: {pasaranSelected.split('-')[0].trim()})
                  </p>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1 text-left">
                {/* Highlight Stats (Neptu & Pasaran) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-stone-50 border border-stone-150 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Neptu Weton</p>
                    <p className="text-2xl font-serif font-extrabold text-[#2E7D32]">
                      {wetonDetails.neptuValue}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-1 font-medium">
                      ({wetonDetails.dayValue} + {wetonDetails.pasaranValue})
                    </p>
                  </div>
                  <div className="bg-[#2E7D32]/10 border border-[#2E7D32]/25 p-4 rounded-2xl text-center">
                    <p className="text-[10px] font-bold text-[#1B5E20] uppercase tracking-widest mb-1">Weton Pasaran</p>
                    <p className="text-xl md:text-2xl font-serif font-extrabold text-stone-900 leading-tight">
                      {wetonDetails.masehiDayName} {wetonDetails.pasaranName.split('-')[0]}
                    </p>
                    <p className="text-[10px] text-stone-600 mt-1 font-medium">
                      {wetonDetails.jawiDayName} ({wetonDetails.dayLambang})
                    </p>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-stone-100">
                  <div className="space-y-5">
                    <DetailItem label="Tanggal Jawa" value={`${javaSelected.day} ${javaSelected.month} ${jYearSelected.year} ${jYearSelected.name}`} subValue={`Pasaran: ${pasaranSelected}`} icon={<Moon className="w-4 h-4 text-[#2E7D32]" />} />
                    <DetailItem label={t('weton.labels.dayLambang')} value={`${wetonDetails.jawiDayName} (${wetonDetails.dayLambang})`} icon={<Sun className="w-4 h-4 text-amber-500" />} />
                    <DetailItem label={t('weton.labels.pasaranDewa')} value={`${wetonDetails.pasaranName} (${wetonDetails.pasaranDewa})`} icon={<Zap className="w-4 h-4 text-amber-500" />} />
                  </div>
                  <div className="space-y-5 md:pl-6 pt-5 md:pt-0 bg-stone-50/50 p-4 rounded-2xl border border-stone-100 md:border-none md:bg-transparent md:p-0">
                    <DetailItem label={t('weton.labels.daySifat')} value={t(wetonDetails.daySifat)} isLongText />
                    <DetailItem label={t('weton.labels.pasaranSifat')} value={t(wetonDetails.pasaranSifat)} isLongText />
                    <DetailItem label={t('hariBaik.gisir') || 'Gisir Harian'} value={wetonDetails.gisir} subValue={t(wetonDetails.gisirSifat)} icon={<Info className="w-4 h-4 text-[#2E7D32]" />} />
                    <DetailItem label={t('weton.labels.tahunSaka')} value={`${wetonDetails.tahunSaka}`} subValue={t(wetonDetails.tahunSakaSifat)} icon={<CalendarIcon className="w-4 h-4 text-stone-600" />} />
                    <DetailItem label={t('weton.labels.windu')} value={`${wetonDetails.windu}`} subValue={t(wetonDetails.winduSifat)} icon={<Wind className="w-4 h-4 text-stone-600" />} />
                    <DetailItem label={t('weton.labels.lambang')} value={`${wetonDetails.lambang}`} subValue={t(wetonDetails.lambangSifat)} icon={<Info className="w-4 h-4 text-stone-600" />} />
                    <DetailItem label={t('weton.labels.tahunJawi')} value={`${wetonDetails.tahunJawi}`} subValue={t(wetonDetails.tahunJawiSifat)} icon={<ArrowRight className="w-4 h-4 text-stone-600" />} />
                    <DetailItem label={t('weton.labels.pranataMangsa')} value={`Tanggal ${wetonDetails.pranataMangsaDay} ${wetonDetails.pranataMangsa}`} subValue={t(wetonDetails.pranataMangsaSifat)} icon={<Compass className="w-4 h-4 text-[#2E7D32]" />} />
                    <DetailItem label={t('weton.labels.wuku')} value={`${wetonDetails.wuku}`} subValue={t(wetonDetails.wukuSifat)} icon={<Zap className="w-4 h-4 text-amber-500" />} />
                  </div>
                </div>

                {/* Nagadina */}
                <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] mb-4 text-center font-sans tracking-widest">{t('weton.nagadina')}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center bg-white p-3 rounded-xl border border-stone-100">
                      <p className="text-[10px] font-semibold text-stone-400 mb-0.5">{t('weton.dewa')}</p>
                      <p className="font-serif font-bold text-stone-850 text-xs sm:text-sm md:text-base truncate">{wetonDetails.nagadinaDewa}</p>
                    </div>
                    <div className="text-center bg-white p-3 rounded-xl border border-stone-100">
                      <p className="text-[10px] font-semibold text-stone-400 mb-0.5">{t('weton.warna')}</p>
                      <p className="font-serif font-bold text-stone-850 text-xs sm:text-sm md:text-base truncate">{wetonDetails.nagadinaWarna}</p>
                    </div>
                    <div className="text-center bg-white p-3 rounded-xl border border-stone-100">
                      <p className="text-[10px] font-semibold text-stone-400 mb-0.5">{t('weton.arah')}</p>
                      <p className="font-serif font-bold text-[#2E7D32] text-xs sm:text-sm md:text-base truncate">{t(wetonDetails.nagadinaArah)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex flex-col sm:flex-row gap-3 justify-end items-center">
                <Button
                  onClick={() => setIsCalendarDetailModalOpen(false)}
                  variant="outline"
                  className="w-full sm:w-auto h-11 border-stone-200 text-stone-700 hover:bg-stone-100 px-6 font-bold rounded-xl"
                  id="calendar-detail-modal-close-btn"
                >
                  Tutup
                </Button>
                <Button
                  onClick={() => {
                    setIsCalendarDetailModalOpen(false);
                    setActiveTab('weton');
                    setBirthDateWeton(selectedDate);
                    setTimeout(() => {
                      document.getElementById('weton-details-card')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="w-full sm:w-auto h-11 bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-[1.01]"
                  id="calendar-detail-modal-action-btn"
                >
                  Gunakan Sebagai Tanggal Lahir
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="max-w-6xl mx-auto mt-20 pt-10 border-t border-stone-200 pb-12 px-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center md:text-left">
          {/* Left: HNJ Indonesia Name only */}
          <div className="flex justify-center md:justify-start">
            <a 
              href="https://hnj-indonesia.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 bg-stone-50 hover:bg-stone-100/80 border border-stone-100 py-1.5 px-4 rounded-full shadow-sm transition-all group"
              id="hnj-footer-link"
            >
              <div className="text-left select-none">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-0.5">Supported By</p>
                <p className="text-xs font-bold text-stone-700 leading-none">HNJ Indonesia</p>
              </div>
            </a>
          </div>

          {/* Center: HAMARÉ */}
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-[#2E7D32] font-serif font-bold text-base tracking-wider mt-0.5">HAMARÉ</p>
            <p className="text-xs text-stone-400">© 2026 {t('title')} - Hak Cipta Dilindungi</p>
          </div>

          {/* Right: Haloka Bhagya Name & Optional Admin Button */}
          <div className="flex flex-col md:flex-row justify-center md:justify-end items-center gap-4">
            {isAdmin && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsAdminMode(true)}
                className="text-[10px] font-bold text-stone-400 hover:text-stone-900 border border-transparent hover:border-stone-200"
                id="admin-dashboard-btn"
              >
                <Shield className="w-3.5 h-3.5 mr-1" /> ADMIN DASHBOARD
              </Button>
            )}
            <a 
              href="https://halokabhagya.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 bg-stone-50 hover:bg-stone-100/80 border border-stone-100 py-1.5 px-4 rounded-full shadow-sm transition-all group"
              id="haloka-footer-link"
            >
              <div className="text-left select-none">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-0.5">Supported By</p>
                <p className="text-xs font-bold text-stone-700 leading-none">Haloka Bhagya</p>
              </div>
            </a>
          </div>
        </div>
      </footer>
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
