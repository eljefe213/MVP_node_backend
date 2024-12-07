interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  skills?: string;
  availability?: string;
}

interface UserListProps {
  users: User[];
  searchTerm: string;
  filterRole: string;
}

const UserList = ({ users, searchTerm, filterRole }: UserListProps) => {
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.skills?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.availability?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'superadmin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'superadmin':
        return 'Super Admin';
      default:
        return 'Bénévole';
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {filteredUsers.map((user) => (
          <li key={user.id} className="hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-indigo-600 truncate">
                    {user.username}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                    {getRoleDisplay(user.role)}
                  </span>
                </div>
              </div>
              {(user.skills || user.availability) && (
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    {user.skills && (
                      <p className="flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-1">Compétences:</span>
                        {user.skills}
                      </p>
                    )}
                  </div>
                  <div className="mt-2 sm:mt-0">
                    {user.availability && (
                      <p className="flex items-center text-sm text-gray-500">
                        <span className="font-medium mr-1">Disponibilités:</span>
                        {user.availability}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;