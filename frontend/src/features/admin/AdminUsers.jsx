// frontend/src/features/admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [search, selectedRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (selectedRole !== 'all') params.role = selectedRole;
      
      const response = await adminAPI.getUsers(params);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (error) {
      alert('Failed to update user role');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminAPI.deleteUser(userId);
      fetchUsers();
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  const roleColors = {
    ADMIN: 'bg-purple-100 text-purple-700',
    OWNER: 'bg-blue-100 text-blue-700',
    GUEST: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users</h1>
          <p className="text-gray-500 mt-1">Manage all users on the platform</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="OWNER">Owner</option>
            <option value="GUEST">Guest</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="px-6 py-12 text-center text-gray-500">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white font-semibold text-sm">
                          {user.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-800">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 font-medium ${roleColors[user.role]}`}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="OWNER">OWNER</option>
                        <option value="GUEST">GUEST</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};