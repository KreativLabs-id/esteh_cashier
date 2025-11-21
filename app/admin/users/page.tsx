'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, X, Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';

interface User {
    id: number;
    username: string;
    name: string;
    role: 'admin' | 'cashier';
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        password: '',
        role: 'cashier' as 'admin' | 'cashier'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (editingUser) {
                // Update existing user
                const updateData: Record<string, string> = {
                    username: formData.username,
                    name: formData.name,
                    role: formData.role
                };
                
                // Only include password if it's provided
                if (formData.password) {
                    updateData.password = formData.password;
                }
                
                const response = await fetch(`/api/users/${editingUser.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                });
                
                if (response.ok) {
                    alert('User berhasil diupdate!');
                }
            } else {
                // Create new user
                if (!formData.password) {
                    alert('Password harus diisi untuk user baru!');
                    return;
                }
                
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    alert('User berhasil ditambahkan!');
                } else {
                    const error = await response.json();
                    alert(error.error || 'Gagal menambahkan user!');
                    return;
                }
            }
            
            fetchUsers();
            closeModal();
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Gagal menyimpan user!');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('User berhasil dihapus!');
                fetchUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Gagal menghapus user!');
        }
    };

    const openModal = (user?: User) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                username: user.username,
                name: user.name,
                password: '',
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                username: '',
                name: '',
                password: '',
                role: 'cashier'
            });
        }
        setShowModal(true);
        setShowPassword(false);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingUser(null);
        setFormData({
            username: '',
            name: '',
            password: '',
            role: 'cashier'
        });
        setShowPassword(false);
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-secondary-900">Manajemen Staf</h1>
                    <p className="text-secondary-500">Kelola akun admin dan kasir</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                >
                    <Plus size={20} />
                    Tambah Staff
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Cari staff..."
                    className="pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-200 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-secondary-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary-50 border-b border-secondary-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase">Nama</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase">Username</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase">Peran</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary-600 uppercase">Dibuat</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-secondary-600 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Memuat...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        Tidak ada staff ditemukan
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-secondary-25">
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-secondary-900">{user.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-secondary-600">{user.username}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2.5 py-1 rounded-full text-xs font-medium",
                                                user.role === 'admin'
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-blue-100 text-blue-700"
                                            )}>
                                                {user.role === 'admin' ? 'Admin' : 'Kasir'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-secondary-600">
                                            {new Date(user.createdAt).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(user)}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {editingUser ? 'Edit Staff' : 'Tambah Staff Baru'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama Lengkap *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                                    placeholder="Nama kasir atau admin"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Username *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                                    placeholder="username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password {editingUser ? '(Kosongkan jika tidak ingin mengubah)' : '*'}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required={!editingUser}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role *
                                </label>
                                <select
                                    required
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'cashier' })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                                >
                                    <option value="cashier">Kasir</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
                                >
                                    {editingUser ? 'Update' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
