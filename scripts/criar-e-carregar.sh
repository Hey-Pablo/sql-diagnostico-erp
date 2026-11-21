#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
# O banco não é apagado ou sobrescrito em execuções subsequentes.
run_sql() {
  docker compose exec -T db /bin/bash -c 'exec /opt/mssql-tools18/bin/sqlcmd -C -b -S localhost -U sa -P "$MSSQL_SA_PASSWORD" "$@"' -- "$@"
}
run_sql -Q "IF DB_ID(N'ERPDiagnostico') IS NOT NULL BEGIN RAISERROR('Banco ERPDiagnostico já existe; interrompendo a carga.', 16, 1); END;"
run_sql -Q 'CREATE DATABASE ERPDiagnostico;'
for arquivo in schema/01_tabelas.sql schema/02_indices.sql seed/03_dados.sql; do
  run_sql -d ERPDiagnostico < "$arquivo"
done
printf '%s\n' 'Banco ERPDiagnostico criado e carregado.'
