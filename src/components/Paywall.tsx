import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Check, Send, AlertCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';

interface PaywallProps {
  onUnlock?: () => void;
}

export const Paywall: React.FC<PaywallProps> = ({ onUnlock }) => {
  const { user, login } = useAuth();
  const { t } = useTranslation();
  const [step, setStep] = useState<'options' | 'form' | 'instructions'>('options');
  const [selectedPackage, setSelectedPackage] = useState<{ id: string, name: string, price: number } | null>(null);
  const [formData, setFormData] = useState({ name: '', whatsapp: '', email: user?.email || '' });
  const [paymentDetails, setPaymentDetails] = useState<{ uniqueAmount: number, package: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packages = [
    { id: '11000', name: '1 Unlock (Hanya Hasil Ini)', price: 11000 },
    { id: '111000', name: 'Unlimited 30 Hari', price: 111000 },
    { id: '1111000', name: 'Unlimited 365 Hari', price: 1111000 },
  ];

  const handleSelectPackage = (pkg: typeof packages[0]) => {
    if (!user) {
      login();
      return;
    }
    setSelectedPackage(pkg);
    setStep('form');
  };

  const generateUniqueAmount = (basePrice: number) => {
    const randomDigits = Math.floor(Math.random() * 999) + 1;
    return basePrice + randomDigits;
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !user) return;

    setIsSubmitting(true);
    const uniqueAmount = generateUniqueAmount(selectedPackage.price);

    try {
      await addDoc(collection(db, 'payments'), {
        userId: user.uid,
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
    } catch (error) {
      console.error("Error creating payment:", error);
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
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-white/60 backdrop-blur-[2px]">
      <div className="max-w-md w-full text-center space-y-4 bg-white/90 p-6 rounded-2xl shadow-2xl border border-stone-100">
        <div className="bg-stone-900 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
          <Lock className="w-6 h-6" />
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
                    className="flex items-center justify-between p-4 rounded-xl border border-stone-200 bg-white hover:border-[#FBC02D] hover:bg-[#FBC02D]/5 transition-all text-left shadow-sm group"
                  >
                    <div>
                      <p className="font-bold text-stone-800 text-sm">{pkg.name}</p>
                      <p className="text-xs text-stone-500">Mulai dari Rp {pkg.price.toLocaleString('id-ID')}</p>
                    </div>
                    <Check className="w-4 h-4 text-[#FBC02D] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
              
              {!user && (
                <Button onClick={login} className="w-full bg-[#FBC02D] hover:bg-[#f9a825] text-black font-bold h-12 rounded-xl">
                  {t('paywall.loginBtn') || 'Login untuk Membeli'}
                </Button>
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
              <div className="bg-green-50 text-green-700 p-3 rounded-xl flex items-start gap-3 text-left">
                <Check className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs font-medium">Pesanan berhasil dibuat. Silakan selesaikan pembayaran berikut.</p>
              </div>

              <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-4">
                <div className="text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Total Transfer</p>
                  <p className="text-3xl font-mono font-bold text-stone-900">
                    Rp {paymentDetails.uniqueAmount.toLocaleString('id-ID')}
                  </p>
                  <p className="text-[10px] text-amber-600 font-bold mt-1 uppercase italic">Wajib transfer hingga 3 digit terakhir!</p>
                </div>
                
                <div className="border-t border-stone-200 pt-4 space-y-2 text-left text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Bank</span>
                    <span className="font-bold">BCA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">No. Rekening</span>
                    <span className="font-bold tracking-wider">1371225981</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Nama Penerima</span>
                    <span className="font-bold">Geibby Meyrith Bolang</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <a 
                  href={getWAUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold h-12 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                  Kirim Bukti via WhatsApp
                </a>
                <p className="text-[10px] text-stone-400">
                  <AlertCircle className="w-3 h-3 inline mr-1" />
                  Admin akan memverifikasi dalam 1-12 jam.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
