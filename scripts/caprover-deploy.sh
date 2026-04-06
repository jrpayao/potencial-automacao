#!/bin/bash
set -e

API_APP="${CAPROVER_API_APP:-ipa-api}"
FRONTEND_APP="${CAPROVER_FRONTEND_APP:-ipa-frontend}"
MACHINE="${CAPROVER_MACHINE:-}"
BRANCH="${CAPROVER_BRANCH:-main}"

usage() {
  echo "Uso: $0 [api|frontend|all]"
  echo ""
  echo "  api       - Deploy apenas da API"
  echo "  frontend  - Deploy apenas do frontend"
  echo "  all       - Deploy de ambos (padrao)"
  echo ""
  echo "Variaveis de ambiente obrigatorias:"
  echo "  CAPROVER_MACHINE       Nome da maquina registrada via 'caprover login'"
  echo ""
  echo "Variaveis de ambiente opcionais:"
  echo "  CAPROVER_API_APP       Nome do app da API no CapRover (padrao: ipa-api)"
  echo "  CAPROVER_FRONTEND_APP  Nome do app do frontend no CapRover (padrao: ipa-frontend)"
  echo "  CAPROVER_BRANCH        Branch git a publicar (padrao: main)"
  echo ""
  echo "Nota: o deploy empacota com 'git archive' (somente arquivos versionados) e injeta"
  echo "      o captain-definition correto. Alteracoes nao commitadas nao vao para o servidor."
  exit 1
}

check_caprover() {
  if ! command -v caprover &> /dev/null; then
    echo "ERRO: CLI do CapRover nao encontrada."
    echo "Instale com: npm install -g caprover"
    exit 1
  fi
}

check_machine() {
  if [ -z "$MACHINE" ]; then
    echo "ERRO: CAPROVER_MACHINE nao definida."
    echo ""
    echo "Execute primeiro: caprover login"
    echo "Depois defina:    export CAPROVER_MACHINE=<nome-da-maquina>"
    echo ""
    echo "Ou rode diretamente:"
    echo "  CAPROVER_MACHINE=minha-maquina bash scripts/caprover-deploy.sh all"
    exit 1
  fi
}

deploy_app() {
  local app_name="$1"
  local captain_file="$2"
  (
    set -e
    tmpdir="$(mktemp -d)"
    trap 'rm -rf "$tmpdir"' EXIT

    echo "==> Preparando deploy de: $app_name (maquina: $MACHINE, branch: $BRANCH)"

    # O CapRover usa `git archive` no branch: arquivos gitignored (ex.: captain-definition
    # copiado na mao) NAO entram no tarball. Sem captain-definition no servidor, o build
    # cai no Dockerfile raiz (nginx.conf / etapa errada) -> 502 no browser.
    git archive --format=tar -o "$tmpdir/repo.tar" "$BRANCH"
    mkdir -p "$tmpdir/extract"
    (cd "$tmpdir/extract" && tar xf "$tmpdir/repo.tar")
    cp "$captain_file" "$tmpdir/extract/captain-definition"
    (cd "$tmpdir/extract" && tar -cf "$tmpdir/deploy.tar" .)

    caprover deploy -n "$MACHINE" -a "$app_name" -t "$tmpdir/deploy.tar" --default

    echo "==> Deploy de $app_name concluido!"
    echo ""
  )
}

TARGET="${1:-all}"

check_caprover
check_machine

case "$TARGET" in
  api)
    deploy_app "$API_APP" "captain-definition.api"
    ;;
  frontend)
    deploy_app "$FRONTEND_APP" "captain-definition.frontend"
    ;;
  all)
    echo "========================================"
    echo "  IPA - Deploy CapRover (API + Frontend)"
    echo "========================================"
    echo ""
    deploy_app "$API_APP" "captain-definition.api"
    deploy_app "$FRONTEND_APP" "captain-definition.frontend"
    echo "========================================"
    echo "  Deploy completo!"
    echo "========================================"
    ;;
  *)
    usage
    ;;
esac
