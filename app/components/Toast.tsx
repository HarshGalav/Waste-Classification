'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-green-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
    info: <Info className="text-blue-400" size={20} />
  };

  const colors = {
    success: 'border-green-400/50 bg-green-400/10',
    error: 'border-red-400/50 bg-red-400/10',
    info: 'border-blue-400/50 bg-blue-400/10'
  };

  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg border ${colors[type]} glass-effect z-50`}>
      <div className="flex items-center gap-3">
        {icons[type]}
        <span className="text-dark-text">{message}</span>
      </div>
    </div>
  );
}