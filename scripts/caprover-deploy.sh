#!/bin/bash
set -e

API_APP="${CAPROVER_API_APP:-ipa-api}"
FRONTEND_APP="${CAPROVER_FRONTEND_APP:-ipa-frontend}"
MACHINE="${CAPROVER_MACHINE:-}"
BRANCH="${CAPROVER_BRANCH:-main}"
CAPROVER_CONFIG="$HOME/.config/configstore/caprover.json"

usage() {
  echo "Uso: $0 [api|frontend|all]"
  echo ""
  echo "  api       - Deploy apenas da API"
  echo "  frontend  - Deploy apenas do frontend"
  echo "  all       - Deploy de ambos (padrao)"
  exit 1
}

check_machine() {
  if [ -z "$MACHINE" ]; then
    echo "ERRO: CAPROVER_MACHINE nao definida."
    exit 1
  fi
}

get_caprover_field() {
  local field="$1"
  node -e "
    const d = JSON.parse(require('fs').readFileSync('$CAPROVER_CONFIG', 'utf8'));
    const m = d.CapMachines.find(m => m.name === '$MACHINE');
    if (!m) { process.stderr.write('Maquina $MACHINE nao encontrada. Execute: caprover login\n'); process.exit(1); }
    console.log(m['$field']);
  "
}

deploy_app() {
  local app_name="$1"
  local captain_file="$2"

  local auth_token base_url
  auth_token=$(get_caprover_field authToken)
  base_url=$(get_caprover_field baseUrl)

  local tmpdir
  tmpdir="$(mktemp -d)"
  trap 'rm -rf "$tmpdir"' EXIT

  echo "==> Preparando deploy de: $app_name (maquina: $MACHINE, branch: $BRANCH)"

  git archive --format=tar -o "$tmpdir/repo.tar" "$BRANCH"
  mkdir -p "$tmpdir/extract"
  tar xf "$tmpdir/repo.tar" -C "$tmpdir/extract"
  # Gerar captain-definition com CACHEBUST para forçar rebuild do npm install
  node -e "
    const base = JSON.parse(require('fs').readFileSync('$captain_file', 'utf8'));
    base.buildArgs = { CACHEBUST: Date.now().toString() };
    require('fs').writeFileSync('$tmpdir/extract/captain-definition', JSON.stringify(base, null, 2));
  "
  tar -cf "$tmpdir/deploy.tar" -C "$tmpdir/extract" .

  echo "==> Enviando para $base_url ..."

  local response
  response=$(curl -s -X POST \
    "${base_url}/api/v2/user/apps/appData/${app_name}?detached=1" \
    -H "x-captain-auth: ${auth_token}" \
    -F "sourceFile=@${tmpdir}/deploy.tar" \
    --max-time 120)

  local status
  status=$(node -e "const d=JSON.parse(process.argv[1]); console.log(d.status)" "$response" 2>/dev/null || echo "erro")

  if [ "$status" = "100" ] || [ "$status" = "101" ]; then
    echo "==> Deploy de $app_name iniciado! Acompanhe os logs em: $base_url"
    echo ""
  else
    echo "ERRO no deploy de $app_name:"
    echo "$response"
    exit 1
  fi
}

TARGET="${1:-all}"

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
