import React, { useState, useEffect } from 'react';
import { QrCode, ShieldCheck, ArrowRight, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { User } from '../../types';
import GenericModal from './GenericModal';
import { userService } from '../../services/userService';

interface UserEnrollmentModalProps {
    isOpen: boolean;
    user: User;
    token?: string;
    onClose: () => void;
    onActivated: (id: string) => void;
}

const UserEnrollmentModal: React.FC<UserEnrollmentModalProps> = ({
    isOpen,
    user,
    token,
    onClose,
    onActivated
}) => {
    const [pin, setPin] = useState('');
    const [step, setStep] = useState<'QR' | 'VERIFY'>('QR');
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && token) {
            fetchQrCode();
        }
    }, [isOpen, token]);

    const fetchQrCode = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getEnrollmentData(token);
            setQrData(data.qr_code);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch security key.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pin.length !== 6) {
            alert('Please enter a valid 6-digit PIN');
            return;
        }

        if (!token) {
            // Fallback for mock/manual activation if no token provided
            onActivated(user.id);
            return;
        }

        setLoading(true);
        try {
            await userService.confirmEnrollment(token, pin);
            onActivated(user.id);
        } catch (err: any) {
            alert(err.message || 'Verification failed. Please check your device.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GenericModal
            isOpen={isOpen}
            onClose={onClose}
            title="Secured Enrollment Engine"
            width="max-w-md"
        >
            <div className="space-y-8 flex flex-col items-center text-center py-4">
                {step === 'QR' ? (
                    <>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-zinc-50 rounded-[2.5rem] group-hover:bg-zinc-100 transition-colors" />
                            <div className="relative p-8 bg-white border-2 border-zinc-100 rounded-[2rem] shadow-sm overflow-hidden flex items-center justify-center w-48 h-48">
                                {loading ? (
                                    <Loader2 className="w-10 h-10 text-zinc-300 animate-spin" />
                                ) : qrData ? (
                                    <img src={qrData} alt="TOTP QR Code" className="w-full h-full object-contain" />
                                ) : (
                                    <QrCode className="w-16 h-16 text-zinc-200" />
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="text-sm font-black uppercase tracking-tighter italic">Identity Seed Handshake</h4>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed px-6">
                                {error ? (
                                    <span className="text-red-500">{error}</span>
                                ) : (
                                    "Use your authenticator app (Google/Microsoft) to scan this temporary identity seed."
                                )}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 w-full">
                            <button
                                onClick={() => setStep('VERIFY')}
                                disabled={!qrData && !token}
                                className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 group shadow-xl disabled:opacity-50"
                            >
                                Next Step: Verify Handshake
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            {error && (
                                <button onClick={fetchQrCode} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">
                                    Retry Sync
                                </button>
                            )}
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleVerify} className="w-full space-y-8 animate-in slide-in-from-right-4 duration-300">
                        <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                            {loading ? <Loader2 className="w-10 h-10 text-black animate-spin" /> : <ShieldCheck className="w-10 h-10 text-black" />}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-black uppercase tracking-tighter italic text-center text-black">Finalize Provisioning</h4>
                                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest text-center px-4">
                                    Input the 6-digit sync code from your device to anchor this identity.
                                </p>
                            </div>

                            <input
                                autoFocus
                                required
                                maxLength={6}
                                disabled={loading}
                                className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl py-6 px-6 text-center text-3xl font-black tracking-[0.5em] outline-none focus:border-black transition-all font-mono"
                                placeholder="000000"
                                value={pin}
                                onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                type="submit"
                                disabled={loading || pin.length !== 6}
                                className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                Activate Collaborator
                            </button>
                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setStep('QR')}
                                className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-3 h-3" />
                                View QR Code Again
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </GenericModal>
    );
};

export default UserEnrollmentModal;
