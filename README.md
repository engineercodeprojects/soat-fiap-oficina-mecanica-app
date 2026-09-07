# Oficina Mecânica — API

Back-end MVP para sistema integrado de oficina mecânica, focado em gestão de ordens de serviço, clientes, veículos e peças.

**Stack:** NestJS · TypeScript · Prisma · PostgreSQL · Docker · Kubernetes · Terraform · JWT

---

## Fase 3 — Nuvem, Segurança e Observabilidade

A Fase 3 leva a solução da Fase 2 para a **AWS**: autenticação serverless por
CPF (Lambda) atrás de um **API Gateway**, monólito no **EKS**, banco **RDS
PostgreSQL**, segregação em **4 repositórios** com CI/CD independente e
observabilidade com **Datadog**. Plano completo em
[`docs/plano-execucao-fase-3.md`](docs/plano-execucao-fase-3.md).

**O que mudou vs Fase 2:** login por email/senha no monólito → **JWT emitido
somente pela Lambda** (`POST /auth` por CPF) e validado na borda + no app
(resource server); kind + Postgres in-cluster → **EKS + RDS**; monorepo com um
pipeline → **4 repositórios** com CI/CD e deploy automático cada; logs simples →
**logs JSON com correlation-id, APM, dashboards e alertas**.

### Repositórios

| # | Repositório | Propósito |
|---|---|---|
| 1 | [`soat-fiap-oficina-auth-lambda`](https://github.com/guilhermeqmaia/soat-fiap-oficina-auth-lambda) | Function serverless (AWS Lambda) de **autenticação por CPF** — emite o JWT em `POST /auth` e atua como Lambda Authorizer do API Gateway |
| 2 | [`soat-fiap-oficina-infra-k8s`](https://github.com/guilhermeqmaia/soat-fiap-oficina-infra-k8s) | Terraform do **cluster EKS** (VPC, node groups, IAM, add-ons, metrics-server) e do API Gateway/VPC Link |
| 3 | [`soat-fiap-oficina-infra-db`](https://github.com/guilhermeqmaia/soat-fiap-oficina-infra-db) | Terraform do **banco gerenciado** (RDS PostgreSQL, subnet group, security groups, secret com `DATABASE_URL`) |
| 4 | [`soat-fiap-oficina-mecanica-app`](https://github.com/guilhermeqmaia/soat-fiap-oficina-mecanica-app) (este repo) | **Aplicação NestJS** (monólito / resource server) + manifestos Kubernetes + CI/CD de deploy no EKS |

### Desenho da arquitetura (Fase 3)

Visão de nuvem: o **API Gateway é o único ponto público**; a Lambda de CPF emite
e valida o JWT; o monólito roda no **EKS** (HPA) atrás de VPC Link → ALB
interno; o banco é **RDS PostgreSQL** em subnets privadas; o agente **Datadog**
coleta APM, métricas e logs.

```mermaid
flowchart TB
    subgraph UI["Clientes / UIs"]
        ADMIN["web/admin<br/>(staff: CPF + senha)"]
        CLI["web/cliente<br/>(cliente: só CPF)"]
    end

    subgraph AWS["AWS (conta Academy)"]
        GW["API Gateway (HTTP API)<br/>único ponto público"]
        LAMBDA["Lambda de autenticação por CPF<br/>POST /auth · Lambda Authorizer"]
        VPCLINK["VPC Link"]

        subgraph VPC["VPC — subnets privadas"]
            ALB["ALB interno"]

            subgraph EKS["Cluster EKS — namespace oficina"]
                DEP["Deployment: oficina-app<br/>monólito NestJS (resource server)"]
                HPA["HPA v2<br/>CPU/mem 70% · min 2 · max 10"]
                JOB["Job: oficina-migrations"]
                DDAGENT["Agente Datadog<br/>(APM + infra + logs)"]
            end

            RDS[("RDS PostgreSQL<br/>Multi-AZ")]
        end

        SM["Secrets Manager<br/>segredo JWT · DATABASE_URL"]
        ECR["ECR<br/>imagem da app"]
    end

    DD["Datadog<br/>dashboards + alertas"]

    ADMIN -- "POST /auth · Bearer JWT" --> GW
    CLI -- "POST /auth · Bearer JWT" --> GW
    GW -- "POST /auth" --> LAMBDA
    GW -. "Lambda Authorizer" .-> LAMBDA
    GW --> VPCLINK --> ALB --> DEP
    HPA -- "escala" --> DEP
    DEP --> RDS
    JOB --> RDS
    LAMBDA -- "consulta cliente/status" --> RDS
    SM -. "segredo JWT" .-> LAMBDA
    SM -. "segredo JWT + DATABASE_URL" .-> DEP
    ECR -. "pull" .-> DEP
    DEP -. "traces · métricas · logs JSON" .-> DDAGENT
    DDAGENT --> DD
```

Diagrama completo (com CloudWatch, webhook outbound e legenda), diagramas de
**sequência** (autenticação por CPF e abertura de OS) e **fluxo de deploy dos 4
repositórios**, com cada decisão linkada às RFCs/ADRs:

➡️ **[docs/arquitetura/arquitetura-fase3.md](docs/arquitetura/arquitetura-fase3.md)**

### Entregáveis da Fase 3

| Entregável | Onde |
|---|---|
| Desenho da arquitetura (Fase 3) | [`docs/arquitetura/arquitetura-fase3.md`](docs/arquitetura/arquitetura-fase3.md) |
| RFCs (nuvem, banco, autenticação) | [`docs/arquitetura/rfcs/`](docs/arquitetura/rfcs/README.md) |
| ADRs (comunicação, HPA, resource server, observabilidade, gateway, 4 repos) | [`docs/arquitetura/adr/`](docs/arquitetura/adr/README.md) |
| Justificativa do banco + modelo ER | [`docs/arquitetura/banco-de-dados.md`](docs/arquitetura/banco-de-dados.md) |
| Autenticação serverless por CPF (Lambda + API Gateway) | [`soat-fiap-oficina-auth-lambda`](https://github.com/guilhermeqmaia/soat-fiap-oficina-auth-lambda) · [Autenticação](#autenticação) |
| Cluster EKS via Terraform | [`soat-fiap-oficina-infra-k8s`](https://github.com/guilhermeqmaia/soat-fiap-oficina-infra-k8s) |
| Banco RDS PostgreSQL via Terraform | [`soat-fiap-oficina-infra-db`](https://github.com/guilhermeqmaia/soat-fiap-oficina-infra-db) |
| Deploy da aplicação no EKS (manifestos) | [`k8s/`](k8s) · [`k8s/README.md`](k8s/README.md) |
| CI/CD multi-repo (um pipeline por repositório, deploy automático) | [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) (este repo) + workflows nos repos 1–3 |
| Observabilidade (logs JSON + correlation-id, APM, métricas de infra) | [`docs/arquitetura/adr/`](docs/arquitetura/adr/README.md) · dashboards abaixo |
| Dashboards e alertas (Datadog) | ver [Vídeo demonstrativo e dashboards](#vídeo-demonstrativo-e-dashboards) |
| Collection das APIs (Swagger/OpenAPI) | `http://localhost:3000/api` (com a app rodando) — ver [Collection das APIs](#collection-das-apis) |
| Vídeo demonstrativo (≤15 min) | ver [Vídeo demonstrativo e dashboards](#vídeo-demonstrativo-e-dashboards) |
| PDF de entrega (links dos 4 repos, vídeo e docs) | entregue no Portal do Aluno — enunciado em [`docs/tech-challenges/fase-3-tech-challenge.pdf`](docs/tech-challenges/fase-3-tech-challenge.pdf) |

---

## Fase 2 — Qualidade, Resiliência e Escalabilidade

A Fase 2 evolui o MVP da Fase 1 para **qualidade, resiliência e escalabilidade**,
incorporando práticas modernas de infraestrutura e automação:

- **Refatoração** do código aplicando **Clean Code** e **Clean Architecture** —
  camadas Domain/Application/Infrastructure com dependências apontando para o
  domínio, garantidas por teste automatizado (`src/shared/architecture.spec.ts`).
- **APIs** de abertura de OS, consulta de status, **listagem ordenada por
  prioridade de status** e **webhook externo de aprovação/reprovação** de orçamento.
- **Notificação externa** de mudança de status via **webhook outbound** (HMAC).
- **Containerização** revisada (Dockerfile multi-stage não-root + docker-compose).
- **Orquestração Kubernetes** com Deployments, Services, ConfigMaps, Secrets e
  **HPA** (autoescalonamento por CPU/memória).
- **Infraestrutura como Código** com **Terraform** provisionando cluster + banco.
- **CI/CD** que builda, testa, empacota a imagem e faz deploy ponta-a-ponta em um
  cluster Kubernetes.

### Desenho da arquitetura

Diagramas de **componentes da aplicação**, **infraestrutura provisionada** e
**fluxo de deploy** (renderizados pelo GitHub):

➡️ **[docs/arquitetura/arquitetura-fase2.md](docs/arquitetura/arquitetura-fase2.md)**
(evolução para a nuvem em [arquitetura-fase3.md](docs/arquitetura/arquitetura-fase3.md))

### Entregáveis da Fase 2

| Entregável | Onde |
|---|---|
| Desenho da arquitetura | [`docs/arquitetura/arquitetura-fase2.md`](docs/arquitetura/arquitetura-fase2.md) |
| Manifestos Kubernetes | [`k8s/`](k8s) · [`k8s/README.md`](k8s/README.md) |
| Scripts Terraform (IaC) | [`infra/terraform/`](infra/terraform) · [`infra/terraform/README.md`](infra/terraform/README.md) |
| Pipeline CI/CD | [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) |
| Testes de carga / escalabilidade | [`perf/`](perf) · [`perf/README.md`](perf/README.md) |
| Collection das APIs (Swagger/OpenAPI) | `http://localhost:3000/api` (com a app rodando) — ver [Collection das APIs](#collection-das-apis) |
| Vídeo demonstrativo (≤15 min) | https://drive.google.com/file/d/1K5Qihz4IGKitT791J9-3o77F8kg_ujvd/view |

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [Docker](https://www.docker.com/) e Docker Compose

---

## Rodando com Docker Compose (recomendado)

Sobe a aplicação e o banco de dados juntos. **As migrations (incluindo a migration de seed dos usuários de teste) são aplicadas automaticamente na inicialização do container.**

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd software-architecture-tech-challenge-01

# 2. Configure o .env (JWT_SECRET é obrigatória)
cp .env.example .env

# 3. Suba os containers
docker compose up -d

# 4. Acompanhe os logs (opcional)
docker compose logs -f app
```

A API estará disponível em `http://localhost:3000`.
A documentação Swagger estará em `http://localhost:3000/api`.

### Parar os containers

```bash
docker compose down
```

Para remover também o volume do banco de dados:

```bash
docker compose down -v
```

---

## Variáveis de ambiente

Copie `.env.example` para `.env` (usado apenas em execução local sem Docker):

```bash
cp .env.example .env
```

| Variável | Descrição | Default |
|---|---|---|
| `DATABASE_URL` | String de conexão PostgreSQL | `postgresql://postgres:postgres@localhost:5432/oficina_mecanica?schema=public` |
| `PORT` | Porta da API | `3000` |
| `JWT_SECRET` | **Obrigatória.** Chave secreta do JWT | — (a app falha em iniciar sem esta variável) |
| `JWT_EXPIRES_IN` | Expiração do token | `1h` |
| `PUBLIC_BASE_URL` | URL pública usada nos links enviados em notificações | `http://localhost:3000` |
| `NOTIFICATION_PROVIDER` | Adapter de notificação: `mock` ou `webhook`. Sem valor, usa `mock` em desenvolvimento e `webhook` em produção | `mock` em dev, `webhook` em prod |
| `NOTIFICATION_WEBHOOK_URL` | URL de destino do POST outbound de notificação. Para demo, use uma URL de `https://webhook.site/` ou RequestBin | — |
| `NOTIFICATION_WEBHOOK_SECRET` | Segredo usado para gerar o header `X-Signature: sha256=<hmac>` com HMAC-SHA256 do body | — |
| `NOTIFICATION_WEBHOOK_TIMEOUT_MS` | Timeout do POST outbound | `5000` |

> **Importante:** `JWT_SECRET` é obrigatória. Antes de subir os containers, copie `.env.example` para `.env` ou defina a variável no seu shell. Exemplo:
>
> ```bash
> cp .env.example .env
> # edite .env e coloque um valor forte em JWT_SECRET
> ```

### Notificação por webhook outbound

Para demonstrar notificações sem infraestrutura própria de e-mail/SMS/push, a aplicação pode publicar mudanças de status da OS em um webhook externo.

1. Abra `https://webhook.site/` ou um RequestBin e copie a URL gerada.
2. Configure o `.env`:

```bash
NOTIFICATION_PROVIDER=webhook
NOTIFICATION_WEBHOOK_URL=https://webhook.site/<token-gerado>
NOTIFICATION_WEBHOOK_SECRET=segredo-usado-no-video
NOTIFICATION_WEBHOOK_TIMEOUT_MS=5000
```

Quando a OS mudar de status, a API envia `POST` com `Content-Type: application/json` e `X-Signature: sha256=<hmac>`. O body contém `ordemId`, `clienteId`, `statusAnterior`, `statusAtual`, `timestamp` e `tipoNotificacao`. Falhas de entrega, timeout e respostas 4xx/5xx são registradas em log e não bloqueiam o fluxo principal da OS.

---

## Autenticação

Na **Fase 3** a aplicação é um **resource server**: ela **não emite** tokens,
apenas **valida** o JWT (HS256, segredo compartilhado via Secrets Manager) e
autoriza por `role`/claims. O único emissor é a **Lambda de autenticação por
CPF** ([`soat-fiap-oficina-auth-lambda`](https://github.com/guilhermeqmaia/soat-fiap-oficina-auth-lambda)),
exposta pelo **API Gateway** em `POST /auth`. Endpoints marcados com `@Public()`
não requerem autenticação. Detalhes e diagrama de sequência em
[arquitetura-fase3.md](docs/arquitetura/arquitetura-fase3.md#2-diagrama-de-sequência--autenticação).

### Fluxo por CPF via API Gateway (Fase 3)

1. **Cliente** envia só o CPF; **staff** envia CPF + senha:

   ```bash
   # cliente
   curl -X POST https://<api-gateway>/auth \
     -H "Content-Type: application/json" \
     -d '{"cpf":"12345678909"}'

   # staff (admin, atendente, mecânico, estoquista)
   curl -X POST https://<api-gateway>/auth \
     -H "Content-Type: application/json" \
     -d '{"cpf":"12345678909","senha":"<senha>"}'
   ```

2. A Lambda valida o CPF (formato/dígitos), consulta o cadastro/status no RDS,
   verifica a senha (staff) e responde `200 { "token": "<JWT>" }` com claims
   `sub`, `cpf`, `role`, `iss` e `exp` (60 min). CPF inválido/não cadastrado →
   `401`.

3. Rotas protegidas são chamadas **sempre pelo gateway** com
   `Authorization: Bearer <token>`. O gateway valida o token na borda (Lambda
   Authorizer, cache 300 s) e encaminha ao monólito via VPC Link → ALB interno;
   o app **revalida** assinatura/`iss`/`exp` e aplica as regras de role
   (defesa em profundidade):

   ```bash
   curl https://<api-gateway>/ordens-servico \
     -H "Authorization: Bearer <token>"
   ```

No Swagger (`http://localhost:3000/api`), clique em **Authorize** e cole o token
obtido na Lambda.

> **Legado (Fase 2):** o endpoint `POST /auth/login` por **email/senha** do
> monólito é substituído pelo `POST /auth` da Lambda e **não deve ser exposto
> pelo gateway** na Fase 3. As subseções abaixo permanecem apenas para execução
> local/desenvolvimento.

### Usuários de teste (Fase 2 / legado — apenas desenvolvimento)

> ⚠️ **Somente para desenvolvimento.** Estes usuários têm senhas conhecidas e
> **nunca** devem existir em produção. Eles **não** são mais criados pelas
> migrations (`prisma migrate deploy` não semeia nada). Para popular um banco de
> dev com dados de demonstração + estes usuários, rode:
>
> ```bash
> npm run seed   # recusa rodar com NODE_ENV=production
> ```
>
> Em produção, crie o administrador inicial por um canal seguro/manual.

| Role | Email | Senha (dev) |
|---|---|---|
| ADMIN | `admin@oficina.com` | `admin123` |
| ATENDENTE | `atendente@oficina.com` | `atendente123` |
| MECANICO | `mecanico@oficina.com` | `mecanico123` |
| ESTOQUISTA | `estoquista@oficina.com` | `estoquista123` |
| CLIENTE | `cliente@oficina.com` | `cliente123` |

### Fazendo login por email/senha (Fase 2 / legado)

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@oficina.com","senha":"admin123"}'
```

Resposta:

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": "uuid",
    "nome": "Admin Oficina",
    "email": "admin@oficina.com",
    "role": "ADMIN"
  }
}
```

### Usando o token (local)

Inclua o header `Authorization: Bearer <token>` nas requisições a endpoints protegidos:

```bash
curl http://localhost:3000/auth/me \
  -H "Authorization: Bearer <token>"
```

---

## Rodando localmente (sem Docker)

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

### 3. Suba apenas o banco de dados

```bash
docker compose up -d postgres
```

### 4. Execute as migrations

```bash
npm run prisma:migrate
```

> A migration `99999999999999_seed_test_users` já popula os usuários de teste automaticamente.

### 5. Inicie a aplicação

```bash
# Desenvolvimento (com hot reload)
npm run start:dev

# Produção
npm run build
npm start
```

A API estará disponível em `http://localhost:3000`.
A documentação Swagger estará em `http://localhost:3000/api`.

---

## Subir tudo localmente (kind) com um comando

Para desenvolvimento/demonstração, um script executa **todo o fluxo de ponta a
ponta** em um cluster [kind](https://kind.sigs.k8s.io/) local: provisiona
**cluster + banco** (Terraform), **builda** as imagens da API e das duas UIs,
carrega no cluster, aplica os **manifestos**, roda as **migrations**, aplica os
**seeds** de demonstração e instala o **metrics-server** (necessário para o HPA).

```bash
# Pré-requisitos: docker, kubectl e terraform (o kind é instalado via Homebrew se faltar)
bash scripts/local-k8s-up.sh
```

Em outro terminal, abra os acessos (mantém os `port-forward` ativos):

```bash
bash scripts/local-k8s-forward.sh
# API:     http://localhost:3000   (Swagger em /api quando NODE_ENV != production)
# Admin:   http://localhost:8080
# Cliente: http://localhost:8081
```

> Para usar o `kubectl` manualmente neste cluster:
> `export KUBECONFIG=$HOME/.kube/oficina-mecanica.config` (contexto
> `kind-oficina-local`). As duas seções a seguir detalham **o mesmo fluxo passo a
> passo** — úteis para entender o que o script faz ou para rodar de forma manual.

---

## Provisionamento da infraestrutura com Terraform (Fase 2 / legado — kind + Postgres in-cluster)

> **Fase 3:** a infraestrutura de nuvem fica em repositórios próprios — o cluster
> **EKS** em [`soat-fiap-oficina-infra-k8s`](https://github.com/guilhermeqmaia/soat-fiap-oficina-infra-k8s)
> e o banco **RDS PostgreSQL gerenciado** em
> [`soat-fiap-oficina-infra-db`](https://github.com/guilhermeqmaia/soat-fiap-oficina-infra-db).
> O Postgres in-cluster abaixo **não é usado na nuvem**; este repo apenas consome
> `DATABASE_URL` (Secret) produzida pelo repo do banco. Os passos a seguir valem
> só para o ambiente local (kind).

O Terraform deste repo provisiona o **cluster kind** e o **Postgres in-cluster**
em dois estágios. Detalhes em [`infra/terraform/README.md`](infra/terraform/README.md).

```bash
# Pré-requisitos: terraform >= 1.9, docker e kubectl

# Estágio 1 — cria o cluster kind e escreve o kubeconfig
cd infra/terraform/01-cluster
terraform init
terraform apply            # gera ~/.kube/oficina-mecanica.config

# Estágio 2 — cria o Postgres e o Secret oficina-db (DATABASE_URL)
cd ../02-app
terraform init
terraform apply            # senha do banco gerada via random_password
```

Recursos criados (resumo): `kind_cluster`, `kubernetes_namespace`, Postgres
(`PVC` + `Deployment` + `Service`), `random_password` e `kubernetes_secret`
(`oficina-db`). Ver a tabela completa em
[docs/arquitetura/arquitetura-fase2.md](docs/arquitetura/arquitetura-fase2.md#recursos-criados-pelo-terraform).

---

## Deploy em Kubernetes

Os manifestos da aplicação estão em [`k8s/`](k8s) (Kustomize). Detalhes em
[`k8s/README.md`](k8s/README.md).

> Para rodar todo este fluxo de uma vez em um cluster kind local, use
> `bash scripts/local-k8s-up.sh` (ver [Subir tudo localmente (kind) com um
> comando](#subir-tudo-localmente-kind-com-um-comando)). Os passos abaixo são o
> mesmo fluxo, manual.

```bash
# Aponte o kubectl para o cluster provisionado pelo Terraform
export KUBECONFIG=$HOME/.kube/oficina-mecanica.config

# Crie o Secret da aplicação a partir do exemplo (JWT + tokens de webhook)
cp k8s/secret.yaml.example k8s/secret.yaml   # edite os valores

# (kind) carregue a imagem no cluster (nome do cluster: oficina-local)
kind load docker-image oficina-mecanica-app:latest --name oficina-local

# Aplique todos os manifestos (namespace, configmap, secret, migrations, app, service, hpa)
kubectl apply -k k8s/

# Acompanhe o Job de migrations e o rollout
kubectl wait --for=condition=complete job/oficina-migrations -n oficina --timeout=180s
kubectl rollout status deployment/oficina-app -n oficina

# HPA (requer metrics-server no cluster)
kubectl get hpa -n oficina
```

O deploy contempla **Deployment** (2 réplicas, probes, requests/limits),
**Service** (ClusterIP), **ConfigMap** + **Secret**, **Job de migrations**
(`prisma migrate deploy`) e **HPA** (CPU 70% / memória 80%, min 2 / máx 10).

> O mesmo fluxo (Terraform → imagem → `kubectl apply -k`) roda automaticamente no
> pipeline [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) contra um
> cluster kind efêmero, com smoke test em `/health`.

---

## Collection das APIs

A API é documentada via **Swagger/OpenAPI**. Com a aplicação rodando:

- **Swagger UI:** `http://localhost:3000/api`
- **OpenAPI JSON:** `http://localhost:3000/api-json` (importável no Postman/Insomnia)

Exemplos de `curl` prontos por domínio em [`docs/`](docs):
[cliente](docs/curls-cliente.md) · [veículo](docs/curls-veiculo.md) ·
[ordem de serviço](docs/curls-ordem-servico.md) · [usuário](docs/curls-usuario.md).

---

## Vídeo demonstrativo e dashboards

- **Vídeo Fase 3 (≤15 min):** <!-- TODO: link final do vídeo --> _link a publicar_ —
  autenticação por CPF, CI/CD dos 4 repos, deploy no EKS, APIs protegidas pelo
  gateway, dashboards ao vivo e logs/traces.
- **Vídeo Fase 2:** https://drive.google.com/file/d/1K5Qihz4IGKitT791J9-3o77F8kg_ujvd/view

**Dashboards de observabilidade (Datadog):**

| Dashboard | Link |
|---|---|
| APM / traces da aplicação | <!-- TODO --> _a publicar_ |
| Métricas de infra (EKS, pods, HPA) | <!-- TODO --> _a publicar_ |
| Logs JSON com correlation-id | <!-- TODO --> _a publicar_ |
| Alertas / monitores | <!-- TODO --> _a publicar_ |

---

## Testes

```bash
# Todos os testes (unit + integração + e2e)
npm test

# Com cobertura
npm run test:cov

# Apenas testes unitários
npx jest --testPathIgnorePatterns=integration --testPathIgnorePatterns=e2e

# Apenas testes de integração (requer Docker)
npx jest integration

# Apenas testes e2e (requer Docker)
npx jest e2e
```

Os testes de integração e e2e usam [testcontainers](https://node.testcontainers.org/) para subir uma instância PostgreSQL efêmera — não há dependência de banco externo rodando.

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run start:dev` | Inicia em modo desenvolvimento com hot reload |
| `npm run build` | Compila o TypeScript |
| `npm start` | Inicia a versão compilada |
| `npm test` | Executa todos os testes |
| `npm run test:cov` | Executa os testes com cobertura |
| `npm run prisma:generate` | Gera o cliente Prisma |
| `npm run prisma:migrate` | Cria e aplica migrations (dev) |
| `npm run prisma:deploy` | Aplica migrations (produção) |
| `npm run docker:up` | Sobe os containers |
| `npm run docker:down` | Para os containers |

---

## Estrutura do projeto

```
src/
├── main.ts                   # Bootstrap da aplicação
├── app.module.ts             # Módulo raiz
├── prisma/                   # PrismaService global
├── shared/                   # Base DDD + architecture.spec.ts (regra de dependência)
├── auth/                     # Bounded Context: Autenticação (Usuario, JWT)
│   ├── domain/               # Entidade, Role, Value Objects, errors
│   ├── application/          # Use Cases + ports/gateways
│   └── infrastructure/       # Controller, guards, strategies, adapters
├── usuario/                  # Bounded Context: Usuários
├── cliente/                  # Bounded Context: Atendimento (Cliente)
├── veiculo/                  # Bounded Context: Atendimento (Veículo)
├── ordem-de-servico/         # Bounded Context: Atendimento (OrdemDeServico — aggregate root)
├── servico/                  # Bounded Context: Catálogo (Serviço)
├── produto/                  # Bounded Context: Estoque (Produto)
├── notificacao/              # Bounded Context: Notificação (webhook outbound)
├── health/                   # Health/readiness checks
└── test/                     # Helpers compartilhados de teste

k8s/                          # Manifestos Kubernetes (Kustomize)
infra/terraform/              # IaC — cluster (01) + banco (02)
perf/                         # Testes de carga, estresse e escalabilidade (HPA)
```

Cada bounded context segue a estrutura DDD em camadas: **Domain → Application → Infrastructure**,
com as dependências apontando para o domínio (Clean Architecture).

---

## Documentação

- **Hub de documentação (índice completo):** [`docs/README.md`](docs/README.md)
- **Swagger:** `http://localhost:3000/api` (quando a app está rodando)
- **RFCs (decisões técnicas — nuvem, banco, autenticação):** [`docs/arquitetura/rfcs/`](docs/arquitetura/rfcs/README.md)
- **ADRs (decisões arquiteturais permanentes):** [`docs/arquitetura/adr/`](docs/arquitetura/adr/README.md)
- **Banco de dados (justificativa PostgreSQL/RDS, ER, relacionamentos, índices):** [`docs/arquitetura/banco-de-dados.md`](docs/arquitetura/banco-de-dados.md)
- **ER Diagram:** `docs/schema.dbml` (importe em [dbdiagram.io](https://dbdiagram.io))
- **User Stories:** [`docs/user-stories/`](docs/user-stories/README.md)
- **QA Plans:** [`docs/qa-plans/`](docs/qa-plans/README.md)
- **Event Storming:** [Miro board (público)](https://miro.com/app/board/uXjVGwyI88w=/?share_link_id=464407873082)
