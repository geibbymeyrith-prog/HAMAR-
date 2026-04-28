import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../lib/utils';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const { login, loginWithEmail, registerWithEmail, authError } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    
    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        if (!name) throw new Error("Nama wajib diisi");
        await registerWithEmail(email, password, name);
      }
      onClose();
    } catch (err: any) {
      setLocalError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await login();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-stone-900">
                    {mode === 'login' ? 'Masuk' : 'Daftar Member'}
                  </h2>
                  <p className="text-stone-500 text-sm mt-1">
                    {mode === 'login' ? 'Masuk ke akun Hamare Anda' : 'Bergabung menjadi member Hamare'}
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {(authError || localError) && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-xs">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{authError || localError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label className="text-stone-700">Nama Lengkap</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <Input 
                        placeholder="Geibby Meyrith..." 
                        className="pl-10 h-12 border-stone-200"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-stone-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input 
                      type="email"
                      placeholder="email@contoh.com" 
                      className="pl-10 h-12 border-stone-200"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-stone-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input 
                      type="password"
                      placeholder="••••••••" 
                      className="pl-10 h-12 border-stone-200"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-[#2E7D32] hover:bg-[#1B5E20] text-lg font-bold rounded-xl mt-4"
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : mode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang'}
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-100"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-stone-400 tracking-widest font-bold">Atau Masuk dengan</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl border-stone-200 gap-3 font-bold"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                Masuk dengan Google
              </Button>

              <div className="mt-8 text-center">
                <button 
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-sm font-bold text-stone-500 hover:text-[#2E7D32] transition-colors"
                >
                  {mode === 'login' ? 'Belum punya akun? Daftar Member' : 'Sudah punya akun? Masuk di sini'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
