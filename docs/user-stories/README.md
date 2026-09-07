# User Stories — Índice

Histórias de usuário do projeto, organizadas por fase. O status de cada história
está no campo `**Status:**` do próprio arquivo. Planejamento por sprint/onda:
[`CLAUDE.md`](../../CLAUDE.md), [`plano-execucao-fase-2.md`](../plano-execucao-fase-2.md)
e [`plano-execucao-fase-3.md`](../plano-execucao-fase-3.md).

## Fase 1 — MVP (US-00 a US-23)

| # | História |
|---|---|
| US-00 | [Setup Prisma + PostgreSQL](00-setup-prisma-postgres.md) |
| US-01 | [Cadastro de Cliente](01-cadastro-cliente.md) |
| US-02 | [CRUD Completo de Cliente](02-crud-cliente.md) |
| US-03 | [Cadastro de Veiculo](03-cadastro-veiculo.md) |
| US-04 | [Catalogo de Servicos](04-catalogo-servicos.md) |
| US-05 | [Catalogo de Produtos (Pecas e Insumos)](05-catalogo-produtos.md) |
| US-06 | [Abertura de Ordem de Servico](06-abertura-os.md) |
| US-07 | [Atribuir Mecanico Responsavel a OS](07-atribuir-mecanico.md) |
| US-08 | [Adicionar Diagnostico a OS](08-diagnostico.md) |
| US-09 | [Adicionar Servicos a OS](09-adicionar-servicos-os.md) |
| US-10 | [Adicionar Produtos/Pecas a OS](10-adicionar-produtos-os.md) |
| US-11 | [Calculo Automatico do Orcamento](11-orcamento-automatico.md) |
| US-12 | [Concluir Orcamento e Enviar para Aprovacao](12-envio-orcamento-aprovacao.md) |
| US-13 | [Aprovacao/Rejeicao do Orcamento pelo Cliente](13-aprovacao-orcamento.md) |
| US-14 | [Execucao dos Servicos](14-execucao-servico.md) |
| US-15 | [Finalizacao e Entrega do Veiculo](15-finalizacao-entrega.md) |
| US-16 | [Acompanhamento da OS pelo Cliente](16-acompanhamento-os.md) |
| US-17 | [Listagem e Detalhamento de OS (Gestao)](17-listagem-os.md) |
| US-18 | [Controle de Estoque (Entrada, Reserva e Baixa)](18-controle-estoque.md) |
| US-19 | [Autenticacao JWT](19-autenticacao-jwt.md) |
| US-20 | [Notificacao ao Cliente](20-notificacao-cliente.md) |
| US-21 | [Docker e Infraestrutura](21-docker-infraestrutura.md) |
| US-22 | [Testes Automatizados e Cobertura](22-testes-cobertura.md) |
| US-23 | [Documentacao Swagger das APIs](23-swagger-documentacao.md) |

## Fase 2 — Qualidade, Resiliência e Escalabilidade (`f2-*`)

| # | História |
|---|---|
| US-F2-01 | [Listagem de OS com Ordenacao Customizada](f2-01-listagem-os-ordenacao.md) |
| US-F2-02 | [Webhook de Aprovacao de Orcamento (Notificacao Externa)](f2-02-webhook-aprovacao-orcamento.md) |
| US-F2-03 | [Adapter de Webhook para Notificacao de Mudanca de Status](f2-03-webhook-notificacao-status.md) |
| US-F2-04 | [Revisao da Containerizacao (Dockerfile + docker-compose)](f2-04-revisao-containerizacao.md) |
| US-F2-05 | [Manifestos Kubernetes para Deploy da Aplicacao](f2-05-manifestos-kubernetes.md) |
| US-F2-06 | [Infraestrutura como Codigo com Terraform (Cluster + Banco)](f2-06-terraform-iac.md) |
| US-F2-07 | [Pipeline CI/CD com Verificacao de Deploy](f2-07-cicd-completo.md) |
| US-F2-08 | [Desenho de Arquitetura e Atualizacao do README](f2-08-arquitetura-readme.md) |
| US-F2-09 | [Entrega Final — Video Demonstrativo e PDF](f2-09-entrega-video-pdf.md) |
| US-F2-10 | [Refatoracao para Clean Architecture (Use Cases + Gateways + Presenters)](f2-10-refatoracao-clean-architecture.md) |
| US-F2-11 | [Testes de Carga, Estresse, Pico, Soak e Escalabilidade (Performance)](f2-11-testes-carga-escalabilidade.md) |

## Fase 3 — Nuvem, Segurança e Observabilidade (`f3-*`)

| # | História |
|---|---|
| US-F3-01 | [Function Serverless de Autenticacao por CPF](f3-01-serverless-cpf-auth.md) |
| US-F3-02 | [API Gateway e Protecao de Rotas Sensiveis](f3-02-api-gateway.md) |
| US-F3-03 | [Aplicacao como Resource Server (validacao de JWT)](f3-03-app-resource-server.md) |
| US-F3-04 | [Terraform — Banco de Dados Gerenciado (RDS)](f3-04-terraform-banco-gerenciado.md) |
| US-F3-05 | [Terraform — Cluster Kubernetes Gerenciado (EKS)](f3-05-terraform-cluster-kubernetes.md) |
| US-F3-06 | [Deploy da Aplicacao no EKS](f3-06-deploy-aplicacao-eks.md) |
| US-F3-07 | [Segregacao em 4 Repositorios + Branch Protection](f3-07-segregacao-repositorios.md) |
| US-F3-08 | [CI/CD por Repositorio com Deploy Automatico](f3-08-cicd-multi-repo.md) |
| US-F3-09 | [Logs Estruturados (JSON) com Correlacao de Requisicoes](f3-09-logs-estruturados-correlacao.md) |
| US-F3-10 | [Observabilidade — APM, Metricas de Infra e Uptime](f3-10-observabilidade-apm.md) |
| US-F3-11 | [Dashboards e Alertas](f3-11-dashboards-alertas.md) |
| US-F3-12 | [Entrega — Video, PDF e Compartilhamento](f3-12-entrega-video-pdf.md) |
| US-F3-DOC-01 | [RFCs (Request for Comments)](f3-doc-01-rfcs.md) |
| US-F3-DOC-02 | [ADRs (Architecture Decision Records)](f3-doc-02-adrs.md) |
| US-F3-DOC-03 | [Diagrama de Componentes + Diagramas de Sequencia (Fase 3)](f3-doc-03-arquitetura-diagramas.md) |
| US-F3-DOC-04 | [Justificativa do Banco + Modelo Relacional + ER](f3-doc-04-justificativa-banco-er.md) |
| US-F3-DOC-05 | [READMEs por Repositorio](f3-doc-05-readmes-por-repo.md) |
| US-F3-DOC-06 | [Indice de Documentacao + Revisao do README Principal](f3-doc-06-indice-docs-readme.md) |
| US-F3-DOC-07 | [QA Plans (backfill + Fase 3)](f3-doc-07-qa-plans-backfill.md) |

## Apoio

- [Manifesto de importação das histórias da Fase 3 para o Notion](f3-notion-import.md)
