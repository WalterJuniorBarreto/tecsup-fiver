import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'warning';
}

export default function ConfirmModal({
  isOpen, title, description, onClose, onConfirm, 
  confirmText = "Confirmar", cancelText = "Cancelar", 
  isLoading = false, variant = 'danger'
}: ConfirmModalProps) {
  
  if (!isOpen) return null;

  const colorClass = variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600';
  const iconColor = variant === 'danger' ? 'text-red-500' : 'text-amber-500';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-[#121214] border border-zinc-800 w-full max-w-sm rounded-[28px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`p-4 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6 ${iconColor}`}>
            <AlertTriangle size={32} />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-zinc-500 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex p-4 gap-3 bg-[#0c0c0e] border-t border-zinc-800">
          <button 
            disabled={isLoading}
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
          >
            {cancelText}
          </button>
          <button 
            disabled={isLoading}
            onClick={onConfirm}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-black transition-all disabled:opacity-50 ${colorClass}`}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}