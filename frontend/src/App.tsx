import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/Users';
import AddUser from './pages/AddUser';
import { useAuthStore } from './stores/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            <Route path="/users" element={
              isAuthenticated ? <Users /> : <Navigate to="/login" />
            } />
            <Route path="/users/add" element={
              isAuthenticated ? <AddUser /> : <Navigate to="/login" />
            } />
            <Route path="/" element={
              isAuthenticated ? (
                <div className="text-center">
                  <h1 className="text-3xl font-bold">Bienvenue sur AssoLink</h1>
                  <p className="mt-4">Gérez vos missions de bénévolat et événements</p>
                </div>
              ) : (
                <Navigate to="/login" />
              )
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;