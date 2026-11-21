BeforeAll {
    $script:carga = Join-Path $PSScriptRoot 'criar-e-carregar.ps1'
    function global:docker { $global:LASTEXITCODE = 0; $input | Out-Null }
}
AfterAll { Remove-Item Function:\docker -ErrorAction SilentlyContinue }
Describe 'criar-e-carregar' {
    It 'executa as cinco chamadas de criação e carga' {
        Mock docker { $global:LASTEXITCODE = 0; $input | Out-Null }
        & $script:carga | Should -Contain 'Banco ERPDiagnostico criado e carregado.'
        Should -Invoke docker -Times 5 -Exactly
    }
    It 'interrompe antes da carga quando a criação falha' {
        Mock docker { $global:LASTEXITCODE = 1 }
        { & $script:carga } | Should -Throw '*Falha ao criar o banco*'
        Should -Invoke docker -Times 1 -Exactly
    }
}
