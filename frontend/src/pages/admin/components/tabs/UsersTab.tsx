import { useEffect, useState } from 'react';
import { adminApi } from '../../../../api/admin.api';
import type { User } from '../../../../types';

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getUsers({ search })
      .then(r => setUsers(Array.isArray(r.data) ? r.data : r.data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search]);

  const toggleActive = async (user: User) => {
    await adminApi.updateUser(user.id, { is_active: !user.is_active });
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_active: !u.is_active } : u));
  };

  return (
    <div>
      <div className="mb-6">
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full max-w-md px-5 py-3 bg-surface-container-low rounded-xl text-sm border-none outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-secondary">Loading users...</div>
      ) : (
        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-outline">Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-outline">Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-outline">City</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-outline">Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-outline">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-outline">Joined</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-outline text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-surface-container-low/30">
                    <td className="px-6 py-4 font-semibold text-on-surface">{u.name}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{u.email}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{u.city || '—'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-surface-container-high text-xs font-bold">{u.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{new Date(u.date_joined).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => toggleActive(u)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${u.is_active ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}>
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
