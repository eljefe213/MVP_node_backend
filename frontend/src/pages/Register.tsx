import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerApi } from '../services/api';
import { AxiosError } from 'axios';
import { ROLES } from '../utils/roleUtils';

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  skills: string;
  availability: string;
  role: 'volunteer' | 'admin' | 'superadmin';
}

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: {
      role: 'volunteer'
    }
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      setIsSubmitting(true);
      const response = await registerApi(data);
      
      if (response.token) {
        navigate('/login');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message 
          || error.response?.data?.errors?.[0]?.message
          || 'Registration failed. Please try again.';
        
        setError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Créer un compte</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur :</label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email :</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe :</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
                }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Rôle :</label>
            <select
              {...register('role')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              aria-label="Sélectionner un rôle"
            >
              <option value={ROLES.VOLUNTEER}>Bénévole</option>
              <option value={ROLES.ADMIN}>Administrateur</option>
              <option value={ROLES.SUPERADMIN}>Super Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Compétences :</label>
            <input
              type="text"
              {...register('skills')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="ex: JavaScript, Gestion de projet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Disponibilités :</label>
            <input
              type="text"
              {...register('availability')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="ex: Weekends, Soirées"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
          </button>

          <p className="text-center text-sm text-gray-600">
            Déjà inscrit ?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;