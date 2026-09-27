import React, { useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
}

export const DetailDrawer: React.FC<DetailDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-purple-50 text-purple-700 border-purple-200',
  children
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 bg-white rounded-[18px] flex flex-col animate-slide-left overflow-hidden border border-slate-200/90 shadow-drawer-light">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-200/80 bg-slate-50/95 backdrop-blur-md select-none flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
            title="Back to Moves (Esc)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-[12.5px] font-bold text-slate-900 tracking-tight leading-none">
                {title}
              </h3>
              {badge && (
                <span className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded border font-semibold ${badgeColor}`}>
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-[10px] text-slate-500 mt-0.5 leading-none">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          title="Close drawer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 bg-slate-50/40">
        {children}
      </div>
    </div>
  );
};
