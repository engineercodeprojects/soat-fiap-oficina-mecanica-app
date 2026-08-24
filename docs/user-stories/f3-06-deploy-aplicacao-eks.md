# US-F3-06: Deploy da Aplicacao no EKS

**User Story:** Como time de plataforma, quero que a aplicacao NestJS rode no cluster EKS consumindo o RDS gerenciado, para operar em nuvem com escalabilidade e alta disponibilidade.

**Prioridade:** Alta
**Story Points:** 5
**Status:** To Do
**DDD Domain:** Infraestrutura / Aplicacao
**DDD Layer:** Infrastructure
**Repositorio:** 4 — `soat-fiap-oficina-mecanica-app` (este repo)

## Contexto

Os manifestos Kustomize existentes (`k8s/`) precisam evoluir de kind/Postgres
in-cluster para **EKS + RDS** ([f3-04](f3-04-terraform-banco-gerenciado.md),
[f3-05](f3-05-terraform-cluster-kubernetes.md)), com a imagem publicada no **ECR**.

## Criterios de Aceite

- [ ] Imagem da aplicacao publicada no **Amazon ECR** (tag por commit/versao)
- [ ] Manifestos aplicam no **EKS** (namespace, deployment, service, HPA, configmap, migrations-job)
- [ ] `DATABASE_URL` vem do **Secret do RDS** (Secrets Manager -> External Secrets ou Secret gerenciado pelo Terraform)
- [ ] **Ingress via ALB** (AWS Load Balancer Controller), alcancavel pelo **API Gateway** ([f3-02](f3-02-api-gateway.md))
- [ ] Job de migrations (`prisma migrate deploy`) roda antes do rollout
- [ ] Probes (liveness/readiness) e requests/limits calibrados para o node group
- [ ] **HPA** ativo e validado (escala sob carga)
- [ ] UIs `web/admin` e `web/cliente` deployadas ou apontando para o gateway (definir escopo)
- [ ] Rollout sem downtime (rolling update) + rollback documentado
- [ ] Smoke test pos-deploy (`/health`, `/health/ready`) no pipeline ([f3-08](f3-08-cicd-multi-repo.md))
- [ ] README com o passo-a-passo de deploy no EKS e o link do deploy ativo

## Notas

- Consome outputs dos repos 2 (cluster) e 3 (banco); documentar como esses valores chegam ao pipeline (ex.: SSM Parameter Store / remote state data source).
