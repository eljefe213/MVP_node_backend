import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">AssoLink</Link>
          
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/users" className="text-gray-700 hover:text-gray-900">Utilisateurs</Link>
                <Link to="/events" className="text-gray-700 hover:text-gray-900">Événements</Link>
                <Link to="/missions" className="text-gray-700 hover:text-gray-900">Missions</Link>
                <button 
                  onClick={logout}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900">Connexion</Link>
                <Link to="/register" className="text-gray-700 hover:text-gray-900">S'inscrire</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;