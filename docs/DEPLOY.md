# Deploy - CapRover (VPS Hostinger)

Guia completo para deploy da aplicacao IPA usando CapRover na VPS Hostinger.

## Arquitetura

```
Internet (HTTPS)
    |
    v
CapRover (nginx reverse proxy + Let's Encrypt)
    |
    |-- dominio.com.br --> [ipa-frontend :80]
    |                          |-- /api/* --> [ipa-api :3000]
    |                          |-- /*     --> Angular SPA
    |
    |-- ipa-api (interno)
    |       |-- NestJS API
    |       |-- SQLite (persistent storage)
```

Dois apps CapRover:
- **ipa-api** -- backend NestJS, porta 3000, com persistent storage para SQLite
- **ipa-frontend** -- Angular + nginx, proxy interno para a API

## Pre-requisitos

- CapRover instalado e funcionando no VPS
- Wildcard DNS configurado (`*.seudominio.com.br` -> IP do VPS)
- CLI do CapRover na maquina local: `npm install -g caprover`
- CLI autenticada: `caprover login`

## 1. Criar os apps no CapRover

Acesse o painel do CapRover (`captain.seudominio.com.br`) e crie dois apps:

### App: ipa-api

1. **Create New App** > Nome: `ipa-api`
2. Marcar **"Has Persistent Data"**
3. Apos criar, va em **App Configs**:

**Environment Variables:**

| Variavel | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | *(gerar com `openssl rand -base64 48`)* |
| `CORS_ORIGIN` | `https://seudominio.com.br` |
| `DATABASE_PATH` | `data/ipa.sqlite` |

**Persistent Directories:**

| Path no Container | Label |
|-------------------|-------|
| `/app/data` | `ipa-sqlite-data` |

4. Clique em **Save & Update**

### App: ipa-frontend

1. **Create New App** > Nome: `ipa-frontend`
2. Apos criar, va em **HTTP Settings**:
   - Ative **"Enable HTTPS"**
   - Ative **"Force HTTPS"**
   - (Opcional) Adicione o dominio customizado `seudominio.com.br`
3. Clique em **Save & Update**

## 2. Deploy via CLI

Na raiz do projeto, na maquina local (apos `caprover login`):

```bash
export CAPROVER_MACHINE=captain-01   # nome dado no login; veja com: caprover list

# Deploy de ambos os apps (branch padrao: main)
bash scripts/caprover-deploy.sh all

# Ou deploy individual
bash scripts/caprover-deploy.sh api
bash scripts/caprover-deploy.sh frontend
```

Variaveis opcionais: `CAPROVER_BRANCH` (padrao `main`; use `master` se o repo ainda usar),
`CAPROVER_API_APP` / `CAPROVER_FRONTEND_APP` se os nomes dos apps no CapRover forem diferentes.

### Deploy manual (sem script)

```bash
# API (ajuste -n e -b ao seu caso)
cp captain-definition.api captain-definition
caprover deploy -n captain-01 -a ipa-api -b main
rm captain-definition

# Frontend
cp captain-definition.frontend captain-definition
caprover deploy -n captain-01 -a ipa-frontend -b main
rm captain-definition
```

## 3. Configurar dominio customizado (opcional)

Se quiser usar `seudominio.com.br` (sem subdominio) para o frontend:

1. No CapRover, va no app `ipa-frontend`
2. Em **HTTP Settings** > **Connect New Domain**
3. Adicione `seudominio.com.br`
4. Ative HTTPS para o novo dominio

Certifique-se de que o registro A do dominio raiz aponta para o IP do VPS.

## 4. Verificar

```bash
# Testar a API
curl https://ipa-api.seudominio.com.br/api

# Testar o frontend
curl -I https://seudominio.com.br
```

Ou acesse pelo navegador. O seed automatico roda na primeira inicializacao se o banco estiver vazio.

## Manutencao

### Atualizar a aplicacao

```bash
bash scripts/caprover-deploy.sh all
```

### Ver logs

No painel CapRover, acesse o app e clique em **Deployment > View App Logs**.

Ou via CLI:

```bash
caprover api --path /user/apps/appData/ipa-api --method GET
```

### Backup do SQLite

O banco fica no persistent storage do CapRover. Para fazer backup:

```bash
# Via SSH no VPS
ssh root@SEU_IP_VPS

# Encontrar o volume
docker volume inspect $(docker volume ls -q | grep ipa-sqlite)

# Copiar o arquivo
docker cp $(docker ps -qf "name=srv-captain--ipa-api"):/app/data/ipa.sqlite ./backup-ipa.sqlite
```

Para backup automatico, adicione um cron no VPS:

```bash
crontab -e
# Adicionar:
0 3 * * * docker cp $(docker ps -qf "name=srv-captain--ipa-api"):/app/data/ipa.sqlite /opt/backups/ipa-$(date +\%Y\%m\%d).sqlite 2>/dev/null
```

### Reiniciar app

No painel CapRover: **Deployment > Save & Update** (sem alterar nada, apenas rebuilda).

## Troubleshooting

### Frontend retorna 502 ao acessar /api/

- Verifique se o app `ipa-api` esta rodando no CapRover
- O nginx do frontend usa `srv-captain--ipa-api:3000` como hostname interno
- Se o nome do app for diferente, ajuste em `nginx.caprover.conf`

### Banco de dados vazio apos re-deploy

- Verifique se **Persistent Data** esta habilitado no app `ipa-api`
- O path `/app/data` deve estar listado em Persistent Directories

### Build falha no CapRover

- **`npm ci` / "Missing: ... from lock file" no build:** o lock foi gerado com outra versao do npm que a do `node:22-alpine` do Docker. Regenere o `package-lock.json` no mesmo ambiente do Dockerfile e commite:

```bash
docker run --rm -v "$(pwd)":/app -w /app node:22-alpine sh -c "npm install"
docker run --rm -v "$(pwd)":/app -w /app node:22-alpine sh -c "npm ci"   # deve passar
```

- CapRover tem limite de RAM para builds. Se falhar por memoria, aumente a RAM do VPS ou faca o build localmente:

```bash
# Build local + push da imagem
docker build -f Dockerfile.caprover.api -t registry.seudominio.com.br/ipa-api .
docker push registry.seudominio.com.br/ipa-api
```

Depois use "Deploy from Image" no painel do CapRover.

### Let's Encrypt nao gera certificado

- Verifique se o DNS wildcard esta configurado: `dig +short ipa-frontend.seudominio.com.br`
- No CapRover, va em **Settings > Let's Encrypt** e configure o email

## Estrutura de arquivos de deploy

```
captain-definition.api          # CapRover config para a API
captain-definition.frontend     # CapRover config para o frontend
Dockerfile.caprover.api         # Dockerfile da API (build isolado)
Dockerfile.caprover.frontend    # Dockerfile do frontend (build isolado)
nginx.caprover.conf             # nginx com proxy para API via rede interna
scripts/caprover-deploy.sh      # Script de deploy automatizado
.env.production.example         # Template de variaveis de ambiente
```
