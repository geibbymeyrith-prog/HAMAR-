import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, LogIn, UserPlus, ArrowRight, ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';

interface MemberOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onContinueAsGuest: () => void;
  guestCountRemaining: number;
}

export const MemberOfferModal: React.FC<MemberOfferModalProps> = ({
  isOpen,
  onClose,
  onLoginClick,
  onRegisterClick,
  onContinueAsGuest,
  guestCountRemaining
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-100"
            onClick={e => e.stopPropagation()}
            id="member-offer-modal"
          >
            {/* Elegant Javanese styling top bar */}
            <div className="h-2 bg-[#2E7D32]" />

            <div className="p-8">
              {/* Close Button */}
              <button 
                onClick={onClose} 
                className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 rounded-full p-1 hover:bg-stone-50 transition-colors"
                id="close-offer-modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center bg-[#2E7D32]/10 text-[#2E7D32] w-14 h-14 rounded-2xl mb-4">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Sudah Punya Akun Member?
                </h3>
                <p className="text-stone-500 text-sm mt-2 leading-relaxed">
                  Jika Anda sudah memiliki akun di situs ini, disarankan untuk masuk (login) terlebih dahulu agar hasil hitungan tidak memotong kuota gratis tamu Anda dan tersimpan di riwayat.
                </p>
              </div>

              <div className="space-y-3">
                {/* Login button */}
                <Button
                  onClick={onLoginClick}
                  className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-bold rounded-xl flex items-center justify-center gap-2"
                  id="offer-login-button"
                >
                  <LogIn className="w-4 h-4" />
                  YA, SAYA SUDAH MEMBER (MASUK)
                </Button>

                {/* Register button */}
                <Button
                  onClick={onRegisterClick}
                  variant="outline"
                  className="w-full h-12 border-stone-200 text-stone-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-stone-50"
                  id="offer-register-button"
                >
                  <UserPlus className="w-4 h-4" />
                  DAFTAR MEMBER BARU
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-stone-400 tracking-wider font-semibold">Tamu Gratis</span>
                  </div>
                </div>

                {/* Continue as guest action */}
                <button
                  onClick={onContinueAsGuest}
                  className="w-full h-12 text-sm font-bold text-stone-500 hover:text-[#2E7D32] bg-stone-50 border border-transparent hover:border-[#2E7D32]/20 rounded-xl transition-all flex items-center justify-center gap-2"
                  id="offer-guest-button"
                >
                  LANJUTKAN GRATIS SEBAGAI TAMU
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[10px] text-center text-stone-400 italic mt-2">
                  Kuota Gratis Tamu Anda Saat Ini: Sisa {Math.max(0, 3 - guestCountRemaining)} dari 3 kali.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
