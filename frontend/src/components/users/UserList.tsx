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
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-indigo-600 truncate">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                      {user.role === 'admin' ? 'Admin' : 'Bénévole'}
                    </span>
                  </div>
                </div>
                {(user.skills || user.availability) && (
                  <div className="mt-2">
                    {user.skills && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Compétences:</span> {user.skills}
                      </p>
                    )}
                    {user.availability && (
                      <p className="text-sm text-gray-500">
                        <span className="font-medium">Disponibilités:</span> {user.availability}
                      </p>
                    )}
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