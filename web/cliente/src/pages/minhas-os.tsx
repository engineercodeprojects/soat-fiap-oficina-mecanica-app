import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { apiRequest, ApiError } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth-store';
import { formatDate } from '@/lib/utils';
import { Pagination } from '@/components/pagination';
import type { OsHistoryItem, OsStatus, Paginated } from '@/lib/api/types';

const PAGE_SIZE = 20;

const STATUS_TONE: Record<string, string> = {
  RECEBIDA: 'bg-blue-100 text-blue-700',
  EM_DIAGNOSTICO: 'bg-violet-100 text-violet-700',
  AGUARDANDO_APROVACAO: 'bg-amber-100 text-amber-700',
  EM_EXECUCAO: 'bg-blue-100 text-blue-700',
  FINALIZADA: 'bg-green-100 text-green-700',
  ENTREGUE: 'bg-green-100 text-green-700',
  CANCELADA: 'bg-red-100 text-red-700',
};

// Ordem de prioridade (mais urgente primeiro). Menor rank = aparece antes.
const STATUS_PRIORITY: Record<OsStatus, number> = {
  EM_EXECUCAO: 0,
  AGUARDANDO_APROVACAO: 1,
  EM_DIAGNOSTICO: 2,
  RECEBIDA: 3,
  CANCELADA: 4,
  FINALIZADA: 5,
  ENTREGUE: 6,
};

// Estados acionaveis pelo cliente, com destaque visual.
const ACTIVE_STATUS: ReadonlySet<OsStatus> = new Set<OsStatus>([
  'EM_EXECUCAO',
  'AGUARDANDO_APROVACAO',
]);

export function MinhasOsPage() {
  const cpfCnpj = useAuthStore((s) => s.cpfCnpj) ?? '';
  const setCpfCnpj = useAuthStore((s) => s.setCpfCnpj);
  const [editing, setEditing] = useState(!cpfCnpj);
  const [tempCpf, setTempCpf] = useState(cpfCnpj);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ['minhas-os', cpfCnpj, page],
    queryFn: () =>
      apiRequest<Paginated<OsHistoryItem>>(
        `/clientes/${cpfCnpj}/ordens-servico`,
        { query: { page, limit: PAGE_SIZE } },
      ),
    enabled: !!cpfCnpj,
    retry: false,
    placeholderData: (prev) => prev,
  });

  // Ordenacao estavel por prioridade de status; empates preservam a ordem do servidor.
  const ordens = useMemo(() => {
    const items = data?.data ?? [];
    return items
      .map((os, index) => ({ os, index }))
      .sort((a, b) => {
        const rankA = STATUS_PRIORITY[a.os.status] ?? Number.MAX_SAFE_INTEGER;
        const rankB = STATUS_PRIORITY[b.os.status] ?? Number.MAX_SAFE_INTEGER;
        return rankA - rankB || a.index - b.index;
      })
      .map((entry) => entry.os);
  }, [data]);

  const onSaveCpf = (e: React.FormEvent) => {
    e.preventDefault();
    setCpfCnpj(tempCpf.replace(/\D/g, ''));
    setEditing(false);
    setPage(1);
    setTimeout(() => refetch(), 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Minhas ordens de servico</h1>
          {cpfCnpj && (
            <p className="text-sm text-slate-500">
              CPF/CNPJ: {cpfCnpj}{' '}
              <button
                type="button"
                className="text-brand-600 underline ml-2"
                onClick={() => {
                  setTempCpf(cpfCnpj);
                  setEditing(true);
                }}
              >
                trocar
              </button>
            </p>
          )}
        </div>
      </div>

      {(editing || !cpfCnpj) && (
        <form
          onSubmit={onSaveCpf}
          className="flex flex-wrap items-end gap-2 rounded-md border border-slate-200 bg-white p-4"
        >
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-sm font-medium text-slate-700">
              CPF / CNPJ
            </label>
            <input
              value={tempCpf}
              onChange={(e) => setTempCpf(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700"
          >
            Buscar minhas OSs
          </button>
        </form>
      )}

      {!cpfCnpj ? null : isLoading ? (
        <div className="text-slate-500">Carregando...</div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error instanceof ApiError && error.status === 403
            ? 'Voce so pode consultar OSs vinculadas ao seu proprio email cadastrado.'
            : (error as Error).message}
        </div>
      ) : (
        <div className="space-y-3">
          {ordens.length > 0 && (
            <p className="text-xs text-slate-400">
              As ordens em andamento aparecem primeiro. OSs ja encerradas
              (finalizadas, entregues ou canceladas) nao sao listadas aqui.
            </p>
          )}
          {ordens.map((os) => {
            const active = ACTIVE_STATUS.has(os.status);
            return (
              <Link
                key={os.numero}
                to={`/ordens/${os.numero}`}
                className={`flex items-center justify-between rounded-md border bg-white p-4 hover:shadow-sm ${
                  active
                    ? 'border-2 border-brand-400 bg-brand-50 hover:border-brand-500'
                    : 'border-slate-200 hover:border-brand-300'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">
                      {os.numero}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_TONE[os.status] ?? 'bg-slate-100 text-slate-700'}`}
                    >
                      {os.status}
                    </span>
                    {active && (
                      <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-medium text-white">
                        Requer sua atencao
                      </span>
                    )}
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-700">
                    {os.descricaoInicial}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Atualizada em {formatDate(os.updatedAt)}
                  </p>
                </div>
                <div className="text-brand-600">→</div>
              </Link>
            );
          })}
          {ordens.length === 0 && (
            <div className="rounded-md border border-dashed border-slate-300 p-8 text-center text-slate-500">
              Voce ainda nao tem ordens de servico abertas.
            </div>
          )}
          <Pagination
            page={page}
            limit={PAGE_SIZE}
            total={data?.total ?? 0}
            onPageChange={setPage}
            isFetching={isFetching}
          />
        </div>
      )}
    </div>
  );
}
