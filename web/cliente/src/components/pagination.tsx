interface PaginationProps {
  /** Pagina atual (1-based). */
  page: number;
  /** Itens por pagina. */
  limit: number;
  /** Total de itens disponiveis no servidor. */
  total: number;
  /** Muda a pagina. Recebe o novo numero (1-based). */
  onPageChange: (page: number) => void;
  /** Desabilita os controles enquanto uma nova pagina esta sendo buscada. */
  isFetching?: boolean;
}

/**
 * Pager simples "Anterior / Proxima" com rotulo "X-Y de {total}".
 * Deriva o total de paginas de total/limit e trava os botoes nos limites.
 */
export function Pagination({
  page,
  limit,
  total,
  onPageChange,
  isFetching = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  // Sem controles quando cabe tudo em uma unica pagina.
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 pt-2 text-sm text-slate-600">
      <span>
        {from}–{to} de {total}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev || isFetching}
          className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-xs text-slate-400">
          Pagina {page} de {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext || isFetching}
          className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Proxima
        </button>
      </div>
    </div>
  );
}
