import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { stallApi } from '../api/stallApi';
import { parseApiError, type ParsedApiError } from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { ErrorState, LoadingState } from '../components/StatusStates';
import type { Stall } from '../types';

export function StallDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stall, setStall] = useState<Stall | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ParsedApiError | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await stallApi.getById(id);
      setStall(data);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleDelete = async () => {
    if (!stall) return;
    const confirmed = window.confirm(`Hapus warung "${stall.name}" secara permanen?`);
    if (!confirmed) return;

    try {
      await stallApi.remove(stall.id);
      navigate('/');
    } catch (err) {
      setError(parseApiError(err));
    }
  };

  if (loading) return <LoadingState message="Memuat detail warung..." />;
  if (error) return <ErrorState error={error} onRetry={fetchDetail} />;
  if (!stall) return null;

  const isAdmin = user?.role === 'admin';
  const isOwnerOfStall = user?.role === 'owner' && user.id === stall.ownerId;
  const canEdit = isAdmin || isOwnerOfStall;

  return (
    <section className="detail-container">
      <div className="detail-top-bar">
        <Link to="/" className="btn btn-secondary btn-sm">
          &larr; Kembali ke Daftar
        </Link>

        <div className="detail-actions">
          {canEdit && (
            <Link to={`/stalls/${stall.id}/edit`} className="btn btn-primary btn-sm">
              Edit Warung
            </Link>
          )}
          {isAdmin && (
            <button type="button" onClick={handleDelete} className="btn btn-danger btn-sm">
              Hapus Warung
            </button>
          )}
        </div>
      </div>

      <div className="card detail-card">
        <div className="card-header">
          <span className="badge badge-category">{stall.category || 'Umum'}</span>
          {stall.isPopular && <span className="badge badge-popular">Populer</span>}
        </div>

        <h1>{stall.name}</h1>

        <table className="detail-table">
          <tbody>
            <tr>
              <th>ID Warung</th>
              <td>#{stall.id}</td>
            </tr>
            <tr>
              <th>Owner ID</th>
              <td>#{stall.ownerId}</td>
            </tr>
            <tr>
              <th>Lokasi</th>
              <td>{stall.location || '-'}</td>
            </tr>
            <tr>
              <th>Rating Rata-rata</th>
              <td>
                {stall.avgRating.toFixed(1)} / 5.0 ({stall.reviewCount} ulasan)
              </td>
            </tr>
            <tr>
              <th>Deskripsi</th>
              <td>{stall.description || 'Tidak ada deskripsi.'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
