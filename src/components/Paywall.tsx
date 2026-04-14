import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/AuthContext';
import { Lock, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function Paywall() {
  const { t, i18n } = useTranslation();
  const { user, login, subscribe, authError } = useAuth();

  const isIDR = i18n.language === 'id' || i18n.language === 'jv';
  const monthlyPrice = isIDR ? 'Rp 36.950' : '$2.49';
  const yearlyPrice = isIDR ? 'Rp 369.500' : '$24.90';

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-white/60 backdrop-blur-[2px]">
      <div className={cn(
        "w-full text-center space-y-4 bg-white/90 p-6 rounded-2xl shadow-2xl border border-stone-100 transition-all duration-300",
        user ? "max-w-2xl" : "max-w-md"
      )}>
        <div className="bg-stone-900 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg">
          <Lock className="w-6 h-6" />
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xl font-serif font-bold text-stone-900">{t('paywall.title')}</h3>
          <p className="text-stone-500 text-xs">
            {t('paywall.desc')}
          </p>
        </div>

        {authError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-[10px] rounded-xl border border-red-100 text-left">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {!user ? (
          <Button onClick={login} className="w-full h-12 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-sm shadow-lg">
            {t('paywall.loginBtn')}
          </Button>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <PricingCard 
              title={t('paywall.monthly')} 
              price={monthlyPrice} 
              period={isIDR ? '/ bln' : '/ mo'}
              features={[
                t('paywall.features.fullResult'),
                t('paywall.features.consultation')
              ]}
              onSelect={() => subscribe('monthly')}
              selectBtnText={t('paywall.selectBtn')}
            />
            <PricingCard 
              title={t('paywall.yearly')} 
              price={yearlyPrice} 
              period={isIDR ? '/ thn' : '/ yr'}
              highlight
              features={[
                t('paywall.save'),
                t('paywall.features.consultationMonthly')
              ]}
              onSelect={() => subscribe('yearly')}
              selectBtnText={t('paywall.selectBtn')}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function PricingCard({ title, price, period, features, highlight, onSelect, selectBtnText }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => {
        e.preventDefault();
        onSelect();
      }}
      className={cn(
        "p-5 rounded-2xl border-2 text-left flex flex-col cursor-pointer transition-all duration-200 w-full min-h-[220px]",
        highlight 
          ? "border-[#FBC02D] bg-[#FBC02D]/5 shadow-md hover:shadow-lg" 
          : "border-stone-200 bg-white hover:border-stone-300 shadow-sm hover:shadow-md"
      )}
    >
      <div className="mb-4">
        <h4 className={cn(
          "text-[10px] font-bold uppercase tracking-widest mb-1",
          highlight ? "text-[#F9A825]" : "text-stone-400"
        )}>{title}</h4>
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-stone-900">{price}</span>
          <span className="text-[10px] text-stone-400">{period}</span>
        </div>
      </div>
      
      <ul className="space-y-2 mb-6 flex-grow">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-start gap-2 text-[10px] text-stone-600">
            <Check className={cn("w-3 h-3 mt-0.5 shrink-0", highlight ? "text-[#F9A825]" : "text-green-600")} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        size="sm" 
        className={cn(
          "w-full h-9 text-[10px] font-bold rounded-xl transition-all",
          highlight 
            ? "bg-[#FBC02D] hover:bg-[#F9A825] text-black shadow-sm" 
            : "bg-stone-900 hover:bg-stone-800 text-white shadow-sm"
        )}
      >
        {selectBtnText}
      </Button>
    </motion.div>
  );
}
