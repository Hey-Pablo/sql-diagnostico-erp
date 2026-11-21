$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
Push-Location $raiz
try {
    $comando = 'exec /opt/mssql-tools18/bin/sqlcmd -C -b -S localhost -U sa -P "$MSSQL_SA_PASSWORD" "$@"'
    $criar = "IF DB_ID(N'ERPDiagnostico') IS NOT NULL BEGIN RAISERROR('Banco ERPDiagnostico já existe; interrompendo a carga.', 16, 1); END;"
    & docker compose exec -T db /bin/bash -c $comando -- -Q $criar
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao criar o banco.' }
    & docker compose exec -T db /bin/bash -c $comando -- -Q 'CREATE DATABASE ERPDiagnostico;'
    if ($LASTEXITCODE -ne 0) { throw 'Falha ao criar o banco.' }
    foreach ($arquivo in @('schema/01_tabelas.sql', 'schema/02_indices.sql', 'seed/03_dados.sql')) {
        Get-Content -Raw -Encoding utf8 $arquivo | & docker compose exec -T db /bin/bash -c $comando -- -d ERPDiagnostico
        if ($LASTEXITCODE -ne 0) { throw "Falha ao carregar $arquivo." }
    }
    Write-Output 'Banco ERPDiagnostico criado e carregado.'
}
finally {
    Pop-Location
}
