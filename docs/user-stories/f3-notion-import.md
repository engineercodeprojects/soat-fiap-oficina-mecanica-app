# Notion — Manifesto de Importação das Histórias da Fase 3

Este arquivo prepara a criação das histórias da Fase 3 no board do Notion.
A criação em si é feita **sob demanda** (peça "criar as histórias da Fase 3 no
Notion") — este manifesto é a fonte de verdade para essa etapa.

## Alvo

| Campo | Valor |
|---|---|
| Board | **Tech Challenge Board** |
| Database ID | `33a48f0b-bca5-805d-ac88-ed5a914239b0` |
| Data Source ID | `33a48f0b-bca5-8071-a6bd-000bcbd098d7` |

## Esquema do board (atual)

O board é **minimalista** — só tem estas propriedades:

| Propriedade | Tipo | Uso na importação |
|---|---|---|
| `Nome` | title | Título do card = título da história (ex.: `US-F3-01: ...`) |
| `Status` | status | `TO DO` para todas as novas histórias (opções: BACKLOG, TO DO, IN PROGRESS, IN REVIEW, DONE) |
| `Descrição` | rich_text | Resumo de uma linha (a *User Story* "Como... quero... para...") |
| `Atribuir` | people | Deixar vazio (atribuir manualmente depois) |

> **Não há colunas de Story Points, Prioridade, Sprint/Onda, Domínio ou Repo.**
> Seguindo a convenção dos cards das Fases 1/2, esses metadados ficam no **corpo
> da página** (blocos), não em propriedades. O conteúdo completo de cada história
> vem do arquivo markdown correspondente em `docs/user-stories/`.

## Procedimento de criação (para a etapa "criar no Notion")

Para cada linha da tabela abaixo, criar uma página via `API-post-page`:

- `parent`: `{ "type": "database_id", "database_id": "33a48f0b-bca5-805d-ac88-ed5a914239b0" }`
- `properties`:
  - `Nome` (title) = coluna **Título Notion**
  - `Status` (status) = `TO DO`
  - `Descrição` (rich_text) = a linha *User Story* do arquivo-fonte
- `children`: blocos com o conteúdo do arquivo-fonte (User Story + Critérios de
  Aceite + metadados Prioridade/SP/Domínio/Repo). O corpo é montado a partir do
  `.md` listado em **Arquivo-fonte**.

Verificações antes de criar em massa:

- [ ] Conferir se já existe card com o mesmo título (evitar duplicar) — `API-query-data-source` filtrando por `Nome`.
- [ ] Criar 1 card de teste, validar o render, e só então criar o restante.

## Histórias (19)

| # | Título Notion (`Nome`) | Status | SP | Onda | Repo | Arquivo-fonte |
|---|---|---|---|---|---|---|
| 1 | US-F3-DOC-01: RFCs (Request for Comments) | TO DO | 3 | 0 | 4 | [f3-doc-01-rfcs.md](f3-doc-01-rfcs.md) |
| 2 | US-F3-DOC-02: ADRs (Architecture Decision Records) | TO DO | 2 | 0 | 4 | [f3-doc-02-adrs.md](f3-doc-02-adrs.md) |
| 3 | US-F3-01: Function Serverless de Autenticacao por CPF | TO DO | 8 | 1 | 1 | [f3-01-serverless-cpf-auth.md](f3-01-serverless-cpf-auth.md) |
| 4 | US-F3-02: API Gateway e Protecao de Rotas Sensiveis | TO DO | 5 | 1 | 1/2 | [f3-02-api-gateway.md](f3-02-api-gateway.md) |
| 5 | US-F3-03: Aplicacao como Resource Server (validacao de JWT) | TO DO | 5 | 1 | 4 | [f3-03-app-resource-server.md](f3-03-app-resource-server.md) |
| 6 | US-F3-04: Terraform — Banco de Dados Gerenciado (RDS) | TO DO | 5 | 2 | 3 | [f3-04-terraform-banco-gerenciado.md](f3-04-terraform-banco-gerenciado.md) |
| 7 | US-F3-05: Terraform — Cluster Kubernetes Gerenciado (EKS) | TO DO | 8 | 2 | 2 | [f3-05-terraform-cluster-kubernetes.md](f3-05-terraform-cluster-kubernetes.md) |
| 8 | US-F3-06: Deploy da Aplicacao no EKS | TO DO | 5 | 3 | 4 | [f3-06-deploy-aplicacao-eks.md](f3-06-deploy-aplicacao-eks.md) |
| 9 | US-F3-07: Segregacao em 4 Repositorios + Branch Protection | TO DO | 5 | 3 | todos | [f3-07-segregacao-repositorios.md](f3-07-segregacao-repositorios.md) |
| 10 | US-F3-08: CI/CD por Repositorio com Deploy Automatico | TO DO | 8 | 3 | todos | [f3-08-cicd-multi-repo.md](f3-08-cicd-multi-repo.md) |
| 11 | US-F3-09: Logs Estruturados (JSON) com Correlacao de Requisicoes | TO DO | 3 | 4 | 4 | [f3-09-logs-estruturados-correlacao.md](f3-09-logs-estruturados-correlacao.md) |
| 12 | US-F3-10: Observabilidade — APM, Metricas de Infra e Uptime | TO DO | 5 | 4 | 4/2 | [f3-10-observabilidade-apm.md](f3-10-observabilidade-apm.md) |
| 13 | US-F3-11: Dashboards e Alertas | TO DO | 5 | 4 | 4 | [f3-11-dashboards-alertas.md](f3-11-dashboards-alertas.md) |
| 14 | US-F3-DOC-03: Diagrama de Componentes + Diagramas de Sequencia (Fase 3) | TO DO | 3 | 5 | 4 | [f3-doc-03-arquitetura-diagramas.md](f3-doc-03-arquitetura-diagramas.md) |
| 15 | US-F3-DOC-04: Justificativa do Banco + Modelo Relacional + ER | TO DO | 3 | 5 | 4 | [f3-doc-04-justificativa-banco-er.md](f3-doc-04-justificativa-banco-er.md) |
| 16 | US-F3-DOC-05: READMEs por Repositorio | TO DO | 3 | 5 | todos | [f3-doc-05-readmes-por-repo.md](f3-doc-05-readmes-por-repo.md) |
| 17 | US-F3-DOC-06: Indice de Documentacao + Revisao do README Principal | TO DO | 3 | 5 | 4 | [f3-doc-06-indice-docs-readme.md](f3-doc-06-indice-docs-readme.md) |
| 18 | US-F3-DOC-07: QA Plans (backfill + Fase 3) | TO DO | 5 | 5 | 4 | [f3-doc-07-qa-plans-backfill.md](f3-doc-07-qa-plans-backfill.md) |
| 19 | US-F3-12: Entrega — Video, PDF e Compartilhamento | TO DO | 2 | 6 | todos | [f3-12-entrega-video-pdf.md](f3-12-entrega-video-pdf.md) |

## Opcional — enriquecer o board

Se quiser filtrar/ordenar por metadados no próprio Notion (hoje impossível, pois
não há colunas), dá para adicionar via `API-update-a-data-source` as propriedades:
`Story Points` (number), `Prioridade` (select), `Fase/Sprint` (select) e `Repo`
(select). **Isso altera o schema e afeta todos os cards existentes** (Fases 1/2
ficariam com esses campos vazios), então é uma decisão a confirmar antes.
