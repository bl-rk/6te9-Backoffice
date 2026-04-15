import React, { useState, useEffect } from 'react';
import {
    UserPlus,
    Shield,
    Mail,
    Calendar,
    MoreVertical,
    RefreshCcw,
    Ban,
    Trash2,
    CheckCircle2,
    Clock,
    AlertTriangle,
    QrCode,
    Loader2
} from 'lucide-react';
import { User, UserStatus } from '../types';
import GenericModal from './modals/GenericModal';
import GenericConfirmModal from './modals/GenericConfirmModal';
import UserEnrollmentModal from './modals/UserEnrollmentModal';
import { userService } from '../services/userService';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [enrollmentUser, setEnrollmentUser] = useState<User | null>(null);
    const [enrollmentToken, setEnrollmentToken] = useState<string | undefined>(undefined);
    const [confirmAction, setConfirmAction] = useState<{
        id: string;
        type: 'DELETE' | 'SUSPEND' | 'UNSUSPEND' | 'RESET_TOTP';
        title: string;
        message: string;
    } | null>(null);

    const [newUserForm, setNewUserForm] = useState({ name: '', email: '', role: 'ADMIN' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || 'Failed to sync with personnel record.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await userService.createUser({
                name: newUserForm.name,
                email: newUserForm.email,
                role: newUserForm.role.toLowerCase()
            });
            setUsers([res, ...users]);
            setIsAddModalOpen(false);
            setNewUserForm({ name: '', email: '', role: 'ADMIN' });
            setEnrollmentToken(res.enrollment_token);
            setEnrollmentUser(res);
        } catch (err: any) {
            alert(err.message || 'Provisioning failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmAction) return;
        const { id, type } = confirmAction;

        try {
            if (type === 'DELETE') {
                await userService.deleteUser(id);
                setUsers(prev => prev.filter(u => u.id !== id));
            } else if (type === 'SUSPEND' || type === 'UNSUSPEND') {
                const newStatus = type === 'SUSPEND' ? 'suspended' : 'active';
                await userService.updateStatus(id, newStatus);
                setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus.toUpperCase() as UserStatus } : u));
            } else if (type === 'RESET_TOTP') {
                const res = await userService.resetTOTP(id);
                const user = users.find(u => u.id === id);
                if (user) {
                    setEnrollmentToken(res.enrollment_token);
                    setEnrollmentUser(user);
                }
                setUsers(prev => prev.map(u => u.id === id ? { ...u, status: UserStatus.PENDING } : u));
            }
        } catch (err: any) {
            alert(err.message || 'Operation synchronization failed.');
        } finally {
            setConfirmAction(null);
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-black animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Synchronizing Personnel Ledger...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Identity Management</h2>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-1">Personnel & Access Control</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchUsers}
                        className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl hover:bg-zinc-100 transition-all text-zinc-500"
                        title="Manual Sync"
                    >
                        <RefreshCcw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl"
                    >
                        <UserPlus className="w-4 h-4" />
                        Provision User
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-3xl flex items-center gap-4 animate-in slide-in-from-top-4">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-500">System Link Error</p>
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                    <button onClick={fetchUsers} className="ml-auto px-4 py-2 bg-red-100 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-200 transition-all">Retry</button>
                </div>
            )}

            <div className="bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Collaborator</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Rank</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">Lifecycle Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {users.map(user => (
                                <tr key={user.id} className="group hover:bg-zinc-50/30 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-black text-xs group-hover:bg-black group-hover:text-white transition-all capitalize">
                                                {user.name.substring(0, 1)}
                                            </div>
                                            <div>
                                                <p className="font-black italic uppercase tracking-tighter text-sm">{user.name}</p>
                                                <div className="flex items-center gap-1.5 text-zinc-400">
                                                    <Mail className="w-3 h-3" />
                                                    <p className="text-[10px] font-bold">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5 text-zinc-300" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            {user.status === UserStatus.ACTIVE && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                                            {user.status === UserStatus.PENDING && <Clock className="w-3.5 h-3.5 text-amber-500" />}
                                            {user.status === UserStatus.SUSPENDED && <Ban className="w-3.5 h-3.5 text-red-500" />}
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === UserStatus.ACTIVE ? 'text-green-600' :
                                                user.status === UserStatus.PENDING ? 'text-amber-600' : 'text-red-600'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex justify-end items-center gap-2">
                                            {user.status === UserStatus.PENDING && (
                                                <button
                                                    onClick={() => setEnrollmentUser(user)}
                                                    className="p-2 bg-zinc-50 hover:bg-black hover:text-white rounded-lg transition-all text-zinc-400 flex items-center gap-2 px-3"
                                                >
                                                    <QrCode className="w-3.5 h-3.5" />
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Enroll</span>
                                                </button>
                                            )}
                                            <div className="flex items-center gap-1 border-l border-zinc-100 pl-2">
                                                <button
                                                    onClick={() => setConfirmAction({
                                                        id: user.id,
                                                        type: 'RESET_TOTP',
                                                        title: 'Reset Credentials',
                                                        message: 'This will invalidate current credentials and require a new setup. Continue?'
                                                    })}
                                                    className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-black transition-colors"
                                                    title="Reset Key"
                                                >
                                                    <RefreshCcw className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmAction({
                                                        id: user.id,
                                                        type: user.status === UserStatus.SUSPENDED ? 'UNSUSPEND' : 'SUSPEND',
                                                        title: user.status === UserStatus.SUSPENDED ? 'Restore Account' : 'Suspend Account',
                                                        message: user.status === UserStatus.SUSPENDED
                                                            ? 'Are you sure you want to restore access for this user?'
                                                            : 'Suspending this account will block all platform access immediately.'
                                                    })}
                                                    className={`p-2 hover:bg-zinc-100 rounded-lg transition-colors ${user.status === UserStatus.SUSPENDED ? 'text-green-500' : 'text-zinc-400 hover:text-amber-500'}`}
                                                    title={user.status === UserStatus.SUSPENDED ? 'Restore' : 'Suspend'}
                                                >
                                                    <Ban className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setConfirmAction({
                                                        id: user.id,
                                                        type: 'DELETE',
                                                        title: 'Terminate Account',
                                                        message: 'CRITICAL: This will permanently delete the collaborator record. This action is irreversible.'
                                                    })}
                                                    className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {users.length === 0 && !loading && !error && (
                <div className="p-20 text-center">
                    <Shield className="w-12 h-12 text-zinc-100 mx-auto mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-300">No personnel records found</p>
                </div>
            )}
            {/* Ingestion Modal */}
            <GenericModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Provision New Collaborator"
                footer={
                    <div className="flex gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1 px-4 py-4 bg-zinc-100 text-zinc-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all font-inter"
                        >
                            Abort
                        </button>
                        <button
                            onClick={handleAddUser}
                            disabled={isSubmitting}
                            className="flex-[2] px-4 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl flex items-center justify-center gap-2 font-inter disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                            Commit Enrolment
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleAddUser} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Legal Full Name</label>
                        <input
                            required
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                            value={newUserForm.name}
                            onChange={e => setNewUserForm({ ...newUserForm, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Corporate Email</label>
                        <input
                            required
                            type="email"
                            placeholder="user@6te9.com"
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                            value={newUserForm.email}
                            onChange={e => setNewUserForm({ ...newUserForm, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">Security Ranking</label>
                        <select
                            className="w-full px-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl text-xs font-bold outline-none focus:ring-1 focus:ring-black transition-all"
                            value={newUserForm.role}
                            onChange={e => setNewUserForm({ ...newUserForm, role: e.target.value })}
                        >
                            <option value="ADMIN">ADMIN</option>
                            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="EDITOR">EDITOR</option>
                        </select>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-2xl flex gap-3 border border-amber-100">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-[10px] text-amber-700 font-medium leading-relaxed uppercase tracking-tight">
                            Status will be set to <strong className="font-black">PENDING</strong>. A security QR code and enrollment link will be dispatched to the provided address.
                        </p>
                    </div>
                </form>
            </GenericModal>

            {/* Enrollment Simulation */}
            {
                enrollmentUser && (
                    <UserEnrollmentModal
                        isOpen={!!enrollmentUser}
                        user={enrollmentUser}
                        token={enrollmentToken}
                        onClose={() => {
                            setEnrollmentUser(null);
                            setEnrollmentToken(undefined);
                        }}
                        onActivated={(id) => {
                            setUsers(prev => prev.map(u => u.id === id ? { ...u, status: UserStatus.ACTIVE } : u));
                            setEnrollmentUser(null);
                            setEnrollmentToken(undefined);
                        }}
                    />
                )
            }

            {/* Operation Confirmation */}
            {
                confirmAction && (
                    <GenericConfirmModal
                        isOpen={!!confirmAction}
                        onClose={() => setConfirmAction(null)}
                        onConfirm={handleConfirmAction}
                        title={confirmAction.title}
                        message={confirmAction.message}
                        confirmLabel={confirmAction.type === 'DELETE' ? 'Execute Delete' : 'Confirm Operation'}
                        variant={confirmAction.type === 'DELETE' ? 'danger' : 'info'}
                    />
                )
            }
        </div >
    );
};

export default UserManagement;
