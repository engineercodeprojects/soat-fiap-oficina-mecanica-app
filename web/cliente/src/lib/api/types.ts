/**
 * Tipos compartilhados das respostas da API do portal do cliente.
 * Espelham os contratos do backend (presenters/DTOs) e evitam
 * redeclaracoes inline espalhadas pelas paginas.
 */

/** Envelope padrao de listagem paginada do backend. */
export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** Status possiveis de uma Ordem de Servico. */
export type OsStatus =
  | 'RECEBIDA'
  | 'EM_DIAGNOSTICO'
  | 'AGUARDANDO_APROVACAO'
  | 'EM_EXECUCAO'
  | 'FINALIZADA'
  | 'ENTREGUE'
  | 'CANCELADA';

/** Item do historico de OSs do cliente (GET /clientes/:cpfCnpj/ordens-servico). */
export interface OsHistoryItem {
  numero: string;
  status: OsStatus;
  descricaoInicial: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Produto vinculado a um servico dentro da view de status da OS. */
export interface OsStatusProduto {
  produtoId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
}

/** Servico dentro da view de status da OS, com seus produtos. */
export interface OsStatusServico {
  servicoId: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  produtos?: OsStatusProduto[];
}

/** View detalhada de status da OS (GET /ordens-servico/numero/:numero/status). */
export interface OsStatusView {
  id: string;
  numero: string;
  status: OsStatus;
  descricaoInicial: string;
  diagnostico: string | null;
  servicos: OsStatusServico[];
  valorTotalServicos: number;
  valorTotalProdutos: number;
  valorTotal: number;
  createdAt?: string;
  updatedAt?: string;
}

/** Status de entrega de uma notificacao. */
export type StatusNotificacao = 'PENDENTE' | 'ENVIADA' | 'FALHOU';

/** Canal de envio da notificacao. */
export type CanalNotificacao = 'EMAIL';

/** Tipos de notificacao conhecidos (podem surgir outros no backend). */
export type TipoNotificacao =
  | 'ORCAMENTO_PRONTO'
  | 'OS_FINALIZADA'
  | 'STATUS_OS_ALTERADO';

/** Notificacao do cliente (GET /clientes/:cpfCnpj/notificacoes). */
export interface NotificacaoResponse {
  id: string;
  clienteId: string;
  ordemDeServicoId: string | null;
  tipo: TipoNotificacao | string;
  canal: CanalNotificacao | string;
  destinatario: string;
  assunto: string;
  mensagem: string;
  status: StatusNotificacao;
  erro: string | null;
  enviadaEm: string | null;
  createdAt: string;
}
