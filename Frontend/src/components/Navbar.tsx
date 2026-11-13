import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const canCreateStall = user && (user.role === 'admin' || user.role === 'owner');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="navbar-brand">
          <Link to="/">Sistem Review Kantin</Link>
        </div>

        <nav className="navbar-links">
          <Link to="/">Daftar Warung</Link>

          {canCreateStall && (
            <Link to="/stalls/new" className="btn btn-primary btn-sm">
              + Tambah Warung
            </Link>
          )}

          {user ? (
            <div className="user-session">
              <span className="user-badge">
                {user.name} (<strong>{user.role.toUpperCase()}</strong> • ID:{user.id})
              </span>
              <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
