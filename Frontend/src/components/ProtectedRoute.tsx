import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types';
import { LoadingState } from './StatusStates';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return <LoadingState message="Memeriksa sesi autentikasi..." />;
  }

  if (!user) {
    return (
      <div className="state-box state-error">
        <h3>401 Unauthorized — Akses Ditolak</h3>
        <p>Anda harus login terlebih dahulu untuk mengakses halaman ini.</p>
        <Link to="/login" className="btn btn-primary">
          Ke Halaman Login
        </Link>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="state-box state-error">
        <h3>403 Forbidden — Hak Akses Tidak Mencukupi</h3>
        <p>
          Role Anda saat ini adalah <strong>{user.role}</strong>. Halaman ini hanya dapat diakses
          oleh role: <strong>{allowedRoles.join(', ')}</strong>.
        </p>
        <Link to="/" className="btn btn-secondary">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
