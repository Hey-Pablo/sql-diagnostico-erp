# Numeracao

## Pergunta de negócio

Quais registros apresentam numeracao?

## SQL

```sql
WITH sequencia AS (
    SELECT serie, numero, LAG(numero) OVER (PARTITION BY serie ORDER BY numero) AS anterior
    FROM dbo.notas
)
SELECT serie, anterior + 1 AS primeiro_faltante, numero - 1 AS ultimo_faltante
FROM sequencia WHERE numero - anterior > 1;
```

## Resultado esperado

Para a carga versionada: serie=1, primeiro_faltante=5, ultimo_faltante=5. O gabarito identifica `numero_ausente`: `{"serie": 1, "numero": 5}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de numeracao, antes de investigar e corrigir a origem dos dados.
