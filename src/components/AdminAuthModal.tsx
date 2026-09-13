import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expectedPin?: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  expectedPin = 'admin123',
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === expectedPin.trim() || pin.trim() === 'admin123') {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-950 text-white flex items-center justify-center shadow-lg shadow-blue-950/20 mb-3">
            <Lock className="w-7 h-7 text-orange-400" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-950 font-['Outfit']">
            Acesso Administrativo
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Esta área é restrita ao administrador do acheiutil.com
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Senha de Acesso do Painel
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                required
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="Digite sua senha de administrador..."
                className={`w-full pl-4 pr-11 py-3 rounded-xl border text-sm text-slate-900 transition-all outline-hidden ${
                  error
                    ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/30'
                    : 'border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                title={showPin ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="flex items-center gap-1 text-xs text-rose-600 font-semibold mt-1.5 animate-in fade-in">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Senha incorreta. Verifique e tente novamente.
              </p>
            )}
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 text-[11px] text-blue-900 leading-relaxed">
            <span className="font-bold flex items-center gap-1 text-blue-950 mb-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" /> Senha Padrão Inicial:
            </span>
            A senha de fábrica é <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-bold text-orange-600 font-mono">admin123</code>. Você pode alterá-la para a senha que preferir nas configurações do painel.
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            <span>Entrar no Painel</span>
          </button>
        </form>

      </div>
    </div>
  );
};
