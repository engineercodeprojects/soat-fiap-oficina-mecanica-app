// Tipos minimos para o frontend (alinhados com a API NestJS)

export type StatusOS =
  | 'RECEBIDA'
  | 'EM_DIAGNOSTICO'
  | 'AGUARDANDO_APROVACAO'
  | 'EM_EXECUCAO'
  | 'FINALIZADA'
  | 'ENTREGUE'
  | 'CANCELADA';

export interface Cliente {
  id: string;
  nome: string;
  cpfCnpj: string;
  telefone: string;
  email?: string | null;
}

export interface Veiculo {
  id: string;
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  clienteId: string;
  ativo?: boolean;
}

export interface Servico {
  id: string;
  nome: string;
  descricao?: string;
  precoBase: number;
  tempoEstimadoHoras: number;
  ativo: boolean;
}

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  precoUnitario: number;
  quantidadeEstoque: number;
  quantidadeReservada: number;
  quantidadeDisponivel?: number;
  estoqueMinimo: number;
  ativo: boolean;
  alertaEstoqueBaixo?: boolean;
}

export type TipoMovimentacaoEstoque =
  | 'ENTRADA'
  | 'SAIDA'
  | 'RESERVA'
  | 'ESTORNO_RESERVA'
  | 'BAIXA';

export interface MovimentacaoEstoque {
  id: string;
  produtoId: string;
  tipo: TipoMovimentacaoEstoque;
  quantidade: number;
  estoqueResultante: number;
  ordemDeServicoId: string | null;
  motivo: string | null;
  usuarioId: string | null;
  createdAt: string;
}

export interface ItemProdutoOS {
  produtoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal?: number;
}

export interface ItemServicoOS {
  servicoId: string;
  quantidade: number;
  precoUnitario: number;
  subtotal?: number;
  statusExecucao?: 'PENDENTE' | 'EM_EXECUCAO' | 'CONCLUIDO';
  inicioExecucao?: string | null;
  fimExecucao?: string | null;
  horasTrabalhadas?: number | null;
  produtos?: ItemProdutoOS[];
}

export interface OrdemDeServico {
  id: string;
  numero: string;
  clienteId: string;
  veiculoId: string;
  usuarioId: string | null;
  descricaoInicial: string;
  diagnostico: string | null;
  status: StatusOS;
  itensServico: ItemServicoOS[];
  valorTotalServicos?: number;
  valorTotalProdutos?: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * View detalhada agrupada retornada por `GET /ordens-servico/:id`
 * (cabecalho / corpo / rodape). Diferente do shape plano `OrdemDeServico`
 * devolvido pelas mutacoes (POST/PATCH). Datas de execucao chegam como ISO
 * string; `dataHora*` do cabecalho ja vem pre-formatadas pelo backend.
 */
export interface OsDetalhesProdutoItem {
  produtoId: string;
  descricaoProduto: string;
  quantidade: number;
  precoUnitario: number;
  valorTotalDesseProduto: number;
}

export interface OsDetalhesServicoItem {
  servicoId: string;
  descricaoServico: string;
  quantidade: number;
  precoUnitario: number;
  valorTotalDesseServico: number;
  statusExecucao: 'PENDENTE' | 'EM_EXECUCAO' | 'CONCLUIDO';
  inicioExecucao: string | null;
  fimExecucao: string | null;
  horasTrabalhadas: number | null;
  produtos: OsDetalhesProdutoItem[];
}

export interface OsDetalhesView {
  cabecalho: {
    numero: string;
    dadosCliente: {
      id: string;
      nome: string;
      cpfCnpj: string;
      email: string | null;
      telefone: string;
    };
    dadosVeiculo: {
      id: string;
      placa: string;
      marca: string;
      modelo: string;
      ano: number;
    };
    status: StatusOS;
    mecanicoAtribuido: string | null;
    dataHoraAbertura: string | null;
    dataHoraUltimaAtualizacao: string | null;
  };
  corpo: {
    descricaoInicial: string;
    diagnostico: string | null;
    servicos: OsDetalhesServicoItem[];
  };
  rodape: {
    valorTotalServicos: number;
    valorTotalProdutos: number;
    valorTotalOrdemServico: number;
  };
}

/** Corpo de `POST /ordens-servico` — abertura com servicos/pecas opcionais. */
export interface CreateOsItemProduto {
  produtoId: string;
  quantidade: number;
}

export interface CreateOsItemServico {
  servicoId: string;
  quantidade: number;
  produtos?: CreateOsItemProduto[];
}

export interface CreateOrdemDeServicoRequest {
  clienteId: string;
  veiculoId: string;
  descricaoInicial: string;
  servicos?: CreateOsItemServico[];
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: 'ADMIN' | 'ATENDENTE' | 'MECANICO' | 'ESTOQUISTA' | 'CLIENTE';
  ativo: boolean;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type StatusNotificacao = 'PENDENTE' | 'ENVIADA' | 'FALHOU';

export interface Notificacao {
  id: string;
  clienteId: string;
  ordemDeServicoId: string | null;
  tipo: string;
  canal: string;
  destinatario: string;
  assunto: string;
  mensagem: string;
  status: StatusNotificacao;
  erro: string | null;
  enviadaEm: string | null;
  createdAt: string;
}

/** Entrada do audit log da OS (`GET /ordens-servico/:id/audit-log`). */
export interface AuditLogEntry {
  id: string;
  acao: string;
  statusAnterior: string | null;
  statusNovo: string | null;
  usuarioId: string | null;
  metadata: unknown;
  createdAt: string;
}

export interface TempoMedioPorServico {
  servicoId: string;
  servicoNome: string;
  totalConcluidos: number;
  tempoMedioMinutos: number;
  tempoMedioHoras: number;
}

export interface TempoMedioExecucao {
  totalServicosConcluidos: number;
  tempoMedioGeralMinutos: number;
  tempoMedioGeralHoras: number;
  porServico: TempoMedioPorServico[];
}
