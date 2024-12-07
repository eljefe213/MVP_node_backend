import { Link } from 'react-router-dom';

const AddUserButton = () => {
  return (
    <Link
      to="/users/add"
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      + Ajouter un utilisateur
    </Link>
  );
};

export default AddUserButton;