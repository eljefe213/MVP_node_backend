import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../services/api';
import UserList from '../components/users/UserList';
import SearchBar from '../components/common/SearchBar';
import AddUserButton from '../components/users/AddUserButton';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Une erreur est survenue lors du chargement des utilisateurs
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
        <AddUserButton />
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un utilisateur..."
          label="Rechercher un utilisateur"
        />
        <div className="sm:w-48">
          <select
            id="role-filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            aria-label="Filtrer par rôle"
          >
            <option value="all">Tous les rôles</option>
            <option value="volunteer">Bénévole</option>
            <option value="admin">Administrateur</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>
      </div>

      <UserList users={users} searchTerm={searchTerm} filterRole={filterRole} />
    </div>
  );
};

export default Users;