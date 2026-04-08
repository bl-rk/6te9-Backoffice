import React from 'react';
import { X } from 'lucide-react';

interface GenericModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string;
}

const GenericModal: React.FC<GenericModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    width = 'max-w-lg'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
            <div className={`bg-white w-full ${width} rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10 border border-zinc-200 animate-in zoom-in-95 duration-200`}>
                <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 rounded-xl transition-all"
                    >
                        <X className="w-5 h-5 text-zinc-400" />
                    </button>
                </div>

                <div className="p-8">
                    {children}
                </div>

                {footer && (
                    <div className="p-8 border-t border-zinc-100 flex gap-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenericModal;
