import React from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';
import GenericModal from './GenericModal';

interface GenericConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    variant?: 'danger' | 'info';
}

const GenericConfirmModal: React.FC<GenericConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm Action',
    variant = 'danger'
}) => {
    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            width="max-w-md"
            footer={
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-4 bg-zinc-100 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all font-inter"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-[2] px-4 py-4 ${variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-black hover:bg-zinc-800'} text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2 font-inter`}
                    >
                        {variant === 'danger' ? <Trash2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {confirmLabel}
                    </button>
                </div>
            }
        >
            <div className="flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-full ${variant === 'danger' ? 'bg-red-50 text-red-500' : 'bg-zinc-50 text-black'} flex items-center justify-center`}>
                    {variant === 'danger' ? <Trash2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                </div>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed font-inter">
                    {message}
                </p>
            </div>
        </GenericModal>
    );
};

export default GenericConfirmModal;
