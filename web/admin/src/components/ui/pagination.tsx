import { Button } from './button';

/**
 * Pager simples dirigido por `{ page, limit, total }` (shape de `Paginated<T>`).
 * Renderiza "X–Y de Z" + Anterior/Proxima. Nao busca dados — a pagina e
 * estado do chamador (incluido na queryKey do react-query).
 */
export function Pagination({
  page,
  limit,
  total,
  onPageChange,
}: {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
      <span>
        {from}–{to} de {total}
      </span>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Anterior
        </Button>
        <span className="text-xs">
          Pagina {page} de {totalPages}
        </span>
        <Button
          size="sm"
          variant="outline"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Proxima
        </Button>
      </div>
    </div>
  );
}
