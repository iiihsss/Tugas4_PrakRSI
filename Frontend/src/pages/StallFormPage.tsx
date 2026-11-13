import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { stallApi } from '../api/stallApi';
import { parseApiError, type ParsedApiError } from '../api/axiosInstance';
import { ErrorState, LoadingState } from '../components/StatusStates';

export function StallFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [loadingInitial, setLoadingInitial] = useState<boolean>(isEditMode);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<ParsedApiError | null>(null);

  useEffect(() => {
    if (!isEditMode || !id) return;

    const loadStall = async () => {
      setLoadingInitial(true);
      setError(null);
      try {
        const stall = await stallApi.getById(id);
        setName(stall.name);
        setCategory(stall.category ?? '');
        setLocation(stall.location ?? '');
        setDescription(stall.description ?? '');
      } catch (err) {
        setError(parseApiError(err));
      } finally {
        setLoadingInitial(false);
      }
    };

    loadStall();
  }, [id, isEditMode]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 3) {
      setError({ message: 'Nama warung minimal 3 karakter.' });
      return;
    }

    setSubmitting(true);
    const payload = {
      name: name.trim(),
      category: category.trim() === '' ? null : category.trim(),
      location: location.trim() === '' ? null : location.trim(),
      description: description.trim() === '' ? null : description.trim(),
    };

    try {
      if (isEditMode && id) {
        await stallApi.update(id, payload);
        navigate(`/stalls/${id}`);
      } else {
        const created = await stallApi.create(payload);
        navigate(`/stalls/${created.id}`);
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return <LoadingState message="Memuat data warung untuk diedit..." />;
  }

  return (
    <section className="form-container">
      <div className="page-header">
        <h1>{isEditMode ? 'Edit Data Warung' : 'Tambah Warung Baru'}</h1>
        <Link to="/" className="btn btn-secondary btn-sm">
          Batal
        </Link>
      </div>

      {error && <ErrorState error={error} />}

      <form onSubmit={handleSubmit} className="card form-card">
        <div className="form-group">
          <label htmlFor="name">
            Nama Warung <span className="required">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            minLength={3}
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Warung Nasi Goreng Pak Budi"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Kategori</label>
          <input
            id="category"
            type="text"
            maxLength={50}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Contoh: Makanan Berat, Minuman, Camilan"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Lokasi</label>
          <input
            id="location"
            type="text"
            maxLength={100}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Kantin Gedung A Lantai 1"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Deskripsi</label>
          <textarea
            id="description"
            rows={4}
            maxLength={1000}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Deskripsi menu andalan, jam buka, dll."
            className="form-input"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary btn-block">
          {submitting
            ? 'Menyimpan...'
            : isEditMode
              ? 'Simpan Perubahan'
              : 'Tambah Warung'}
        </button>
      </form>
    </section>
  );
}
