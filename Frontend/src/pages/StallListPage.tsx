import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { stallApi } from '../api/stallApi';
import { parseApiError, type ParsedApiError } from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import { EmptyState, ErrorState, LoadingState } from '../components/StatusStates';
import type { Stall } from '../types';

export function StallListPage() {
  const { user } = useAuth();

  const [stalls, setStalls] = useState<Stall[]>([]);
  const [total, setTotal] = useState<number>(0);

  const [searchInput, setSearchInput] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const limit = 6;

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ParsedApiError | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const fetchStalls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await stallApi.getAll({
        search,
        category,
        page,
        limit,
      });
      setStalls(res.data);
      setTotal(res.meta.total);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => {
    fetchStalls();
  }, [fetchStalls]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleResetFilter = () => {
    setSearchInput('');
    setSearch('');
    setCategory('');
    setPage(1);
  };

  const handleDelete = async (stall: Stall) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus warung "${stall.name}"?`,
    );
    if (!confirmed) return;

    setActionFeedback(null);
    try {
      await stallApi.remove(stall.id);
      setActionFeedback(`Warung "${stall.name}" berhasil dihapus.`);
      fetchStalls();
    } catch (err) {
      setError(parseApiError(err));
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <section>
      <div className="page-header">
        <div>
          <h1>Daftar Warung Kantin</h1>
          <p className="subtitle">
            Total ditemukan: <strong>{total}</strong> warung
          </p>
        </div>

        {user && (user.role === 'admin' || user.role === 'owner') && (
          <Link to="/stalls/new" className="btn btn-primary">
            + Tambah Warung Baru
          </Link>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="filter-bar">
        <input
          type="text"
          placeholder="Cari nama warung..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="form-input"
        />

        <input
          type="text"
          placeholder="Filter kategori (mis. Makanan Berat, Minuman)..."
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="form-input"
        />

        <button type="submit" className="btn btn-primary">
          Cari
        </button>

        {(search || category) && (
          <button type="button" onClick={handleResetFilter} className="btn btn-secondary">
            Reset
          </button>
        )}
      </form>

      {actionFeedback && <div className="alert alert-success">{actionFeedback}</div>}

      {loading ? (
        <LoadingState message="Mengambil daftar warung dari server..." />
      ) : error ? (
        <ErrorState error={error} onRetry={fetchStalls} />
      ) : stalls.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="stall-grid">
            {stalls.map((stall) => {
              const isAdmin = user?.role === 'admin';
              const isOwnerOfStall = user?.role === 'owner' && user.id === stall.ownerId;
              const canEdit = isAdmin || isOwnerOfStall;

              return (
                <article key={stall.id} className="card stall-card">
                  <div className="card-header">
                    <span className="badge badge-category">
                      {stall.category || 'Umum'}
                    </span>
                    {stall.isPopular && (
                      <span className="badge badge-popular">Populer</span>
                    )}
                  </div>

                  <h2 className="card-title">{stall.name}</h2>

                  <p className="card-meta">
                    Lokasi: <strong>{stall.location || '-'}</strong>
                  </p>
                  <p className="card-meta">
                    Rating: <strong>{stall.avgRating.toFixed(1)}</strong> ({stall.reviewCount} ulasan) • Owner ID: #{stall.ownerId}
                  </p>

                  <p className="card-desc">
                    {stall.description || 'Tidak ada deskripsi warung.'}
                  </p>

                  <div className="card-actions">
                    <Link to={`/stalls/${stall.id}`} className="btn btn-outline btn-sm">
                      Detail
                    </Link>

                    {canEdit && (
                      <Link
                        to={`/stalls/${stall.id}/edit`}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </Link>
                    )}

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDelete(stall)}
                        className="btn btn-danger btn-sm"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="pagination">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              &laquo; Sebelumnya
            </button>

            <span>
              Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong>
            </span>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            >
              Berikutnya &raquo;
            </button>
          </div>
        </>
      )}
    </section>
  );
}
