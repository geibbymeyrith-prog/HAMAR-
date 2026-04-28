import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Check, Send, AlertCircle, X, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../lib/AuthContext';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

interface PaywallProps {
  onUnlock?: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({ onUnlock }) => {
  const { user, login, loginWithEmail, registerWithEmail, authError: authErr } = useAuth();
  const { t } = useTranslation();
  const [step, setStep] = useState<'options' | 'form' | 'instructions'>('options');
  const [selectedPackage, setSelectedPackage] = useState<{ id: string, name: string, price: number } | null>(null);
  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: user?.email || '', password: '' });
  const [paymentDetails, setPaymentDetails] = useState<{ uniqueAmount: number, package: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packages = [
    { id: '11000', name: '1 Unlock (Hanya Hasil Ini)', price: 11000 },
    { id: '111000', name: 'Unlimited 30 Hari', price: 111000 },
    { id: '1111000', name: 'Unlimited 365 Hari', price: 1111000 },
  ];

  const handleSelectPackage = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg);
    setStep('form');
  };

  const generateUniqueAmount = (basePrice: number) => {
    const randomDigits = Math.floor(Math.random() * 999) + 1;
    return basePrice + randomDigits;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    setIsSubmitting(true);
    const uniqueAmount = generateUniqueAmount(selectedPackage.price);

    try {
      let currentUserId = user?.uid;

      if (!user) {
        try {
          await registerWithEmail(formData.email, formData.password, formData.name);
          // The new user will be signed in automatically
        } catch (err: any) {
          console.error("Auto registration error:", err);
          setIsSubmitting(false);
          return;
        }
      }

      const currentUser = auth.currentUser;
      const uid = currentUser?.uid || user?.uid;

      if (!uid) throw new Error("User ID not found after registration");

      try {
        await addDoc(collection(db, 'payments'), {
          userId: uid,
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          package: selectedPackage.id,
          packageName: selectedPackage.name,
          uniqueAmount: uniqueAmount,
          status: 'pending',
          createdAt: serverTimestamp(),
        });

        setPaymentDetails({ uniqueAmount, package: selectedPackage.name });
        setStep('instructions');
      } catch (err) {
        console.error("Firestore payment error:", err);
        alert("Gagal membuat data pesanan: " + (err instanceof Error ? err.message : String(err)));
      }
    } catch (error) {
      console.error("Error in handleSubmitForm:", error);
      alert("Terjadi kesalahan: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWAUrl = () => {
    if (!paymentDetails || !formData) return '';
    const message = `Halo Admin, saya ingin konfirmasi pembayaran:
Nama: ${formData.name}
Email: ${formData.email}
WhatsApp: ${formData.whatsapp}
Paket: ${paymentDetails.package}
Nominal: Rp ${paymentDetails.uniqueAmount.toLocaleString('id-ID')}

Mohon segera diproses. Terima kasih.`;
    return `https://wa.me/6281299996816?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-white/95 backdrop-blur-md">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border border-stone-100 flex flex-col items-center">
        <div className="bg-stone-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xl transform rotate-3">
          <Lock className="w-8 h-8" />
        </div>
        
        <AnimatePresence mode="wait">
          {step === 'options' && (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-serif font-bold text-stone-800">
                {t('paywall.title') || 'Buka Seluruh Hasil'}
              </h2>
              <p className="text-sm text-stone-500">
                {t('paywall.description') || 'Anda telah mencapai batas 3x generate gratis. Pilih paket untuk melihat hasil lengkap.'}
              </p>
              
              <div className="grid gap-3 pt-2">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg)}
                    className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-white hover:border-[#2E7D32] hover:bg-[#2E7D32]/5 transition-all text-left shadow-sm group"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-stone-800 text-sm">{pkg.name}</p>
                      <p className="text-xs text-stone-500">
                        Rp {pkg.price.toLocaleString('id-ID')} {pkg.id === '11000' ? '' : '+ Nominal Unik'}
                      </p>
                    </div>
                    {!user ? (
                      <LogIn className="w-4 h-4 text-stone-400 group-hover:text-[#2E7D32] transition-colors" />
                    ) : (
                      <Check className="w-4 h-4 text-[#2E7D32] opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                ))}
              </div>
              
              {!user && (
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] text-stone-400 justify-center">
                    <AlertCircle className="w-3 h-3" />
                    <span>Anda harus masuk terlebih dahulu untuk membeli paket</span>
                  </div>
                  <Button onClick={login} className="w-full bg-[#FBC02D] hover:bg-[#f9a825] text-black font-bold h-12 rounded-xl border-b-4 border-[#f9a825] active:border-b-0 active:translate-y-1 transition-all">
                    <LogIn className="w-4 h-4 mr-2" /> MASUK / DAFTAR SEKARANG
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {step === 'form' && selectedPackage && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4 text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif font-bold text-lg">Form Pemesanan</h3>
                <button onClick={() => setStep('options')} className="text-stone-400 hover:text-stone-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-stone-500 mb-4">Paket dipilih: <span className="font-bold text-stone-800">{selectedPackage.name}</span></p>
              
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-stone-500">Nama Lengkap</Label>
                  <Input 
                    id="name" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Masukkan nama Anda"
                    className="h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp" className="text-xs font-bold uppercase tracking-widest text-stone-500">Nomor WhatsApp Aktif</Label>
                  <Input 
                    id="whatsapp" 
                    required 
                    value={formData.whatsapp} 
                    onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="Contoh: 08123456789"
                    className="h-10 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-stone-500">Email Utama</Label>
                  <Input 
                    id="email" 
                    required 
                    type="email"
                    value={formData.email} 
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="h-10 rounded-lg"
                    disabled={!!user?.email}
                  />
                </div>
                
                {!user && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-stone-500">Buat Password Baru</Label>
                    <Input 
                      id="password" 
                      required 
                      type="password"
                      value={formData.password} 
                      onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Minimal 6 karakter"
                      className="h-10 rounded-lg"
                      minLength={6}
                    />
                    <p className="text-[10px] text-stone-400">Password ini digunakan untuk masuk ke dashboard Anda nantinya.</p>
                  </div>
                )}
                
                {authErr && (
                  <div className="space-y-2">
                    <p className="text-xs text-red-500">{authErr}</p>
                    {authErr.includes('terdaftar') && (
                      <button 
                        type="button" 
                        onClick={() => {
                          // Allow user to try login instead
                          const pwd = prompt("Masukkan password untuk login ke akun ini:");
                          if (pwd) loginWithEmail(formData.email, pwd).then(() => setStep('form')).catch(e => alert(e.message));
                        }}
                        className="text-[10px] font-bold text-[#2E7D32] uppercase underline"
                      >
                        Masuk ke akun ini
                      </button>
                    )}
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#FBC02D] hover:bg-[#f9a825] text-black font-bold h-12 rounded-xl mt-4"
                >
                  {isSubmitting ? 'Memproses...' : 'Lanjutkan ke Pembayaran'}
                </Button>
              </form>
            </motion.div>
          )}

          {step === 'instructions' && paymentDetails && (
            <motion.div
              key="instructions"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5"
            >
              <div className="space-y-4 w-full">
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Total Transfer (Hingga 3 Digit Terakhir)</p>
                  <p className="text-3xl font-mono font-bold text-[#2E7D32] bg-stone-50 py-3 rounded-xl border border-stone-100">
                    Rp {paymentDetails.uniqueAmount.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-amber-600 font-bold mt-2 uppercase italic">Wajib transfer tepat sesuai nominal di atas!</p>
                </div>
                
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3 text-left">
                  <div className="pb-3 border-b border-stone-200 mb-1">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Instruksi Pembayaran</p>
                    <p className="text-xs text-stone-600 leading-relaxed">Silakan transfer via ATM / Mobile Banking ke rekening berikut:</p>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 font-medium">Bank</span>
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg" alt="BCA" className="h-4" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 font-medium">No. Rekening</span>
                      <span className="font-mono font-bold text-lg tracking-wider select-all cursor-pointer hover:text-[#2E7D32] transition-colors" title="Klik untuk menyalin">1371225981</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-500 font-medium">Nama Penerima</span>
                      <span className="font-bold">Geibby Meyrith Bolang</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 space-y-4">
                  <Button 
                    onClick={() => window.open(getWAUrl(), '_blank')}
                    className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-3 shadow-lg border-b-4 border-[#20ba5a] active:border-b-0 active:translate-y-1 transition-all"
                  >
                    <Send className="w-5 h-5" />
                    KONFIRMASI VIA WHATSAPP
                  </Button>
                  
                  <div className="px-4 py-3 bg-amber-50 rounded-xl flex items-start gap-3 border border-amber-100">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                      Setelah konfirmasi dikirim, Admin akan memverifikasi dan mengaktifkan akun Anda dalam waktu 1-12 jam. Anda akan menerima notifikasi via WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
