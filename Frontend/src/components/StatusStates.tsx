import type { ParsedApiError } from '../api/axiosInstance';

export function LoadingState({ message = 'Memuat data...' }: { message?: string }) {
  return (
    <div className="state-box state-loading" role="status">
      <div className="spinner" />
      <p>{message}</p>
    </div>
  );
}

export function EmptyState({
  title = 'Data tidak ditemukan',
  description = 'Belum ada data warung yang tersedia atau sesuai dengan filter pencarian Anda.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="state-box state-empty">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function ErrorState({
  error,
  onRetry,
}: {
  error: ParsedApiError | string;
  onRetry?: () => void;
}) {
  const parsed: ParsedApiError =
    typeof error === 'string' ? { message: error } : error;

  return (
    <div className="state-box state-error" role="alert">
      <h4>Terjadi Kesalahan</h4>
      <p>{parsed.message}</p>
      {parsed.details && parsed.details.length > 0 && (
        <ul className="error-list">
          {parsed.details.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
      {onRetry && (
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          Coba Lagi
        </button>
      )}
    </div>
  );
}
