import { useEffect, useState } from 'react';
import { Shield, User } from 'lucide-react';
import api from '../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/auth/users');
        setUsers(response.data);
      } catch (err) {
        setError('Не удалось загрузить пользователей. ' + (err.response?.data?.detail || ''));
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-brand-dark rounded-full text-white">
          <Shield size={24} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Панель администратора</h1>
      </div>

      {error && <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-700">Пользователи ({users.length})</h2>
        </div>
        
        <div className="divide-y divide-gray-100">
          {users.map((user) => (
            <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                    <User size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.email}</p>
                  <p className="text-sm text-gray-500">ID: {user.id}</p>
                </div>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide 
                ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}