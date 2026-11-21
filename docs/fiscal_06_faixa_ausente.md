# Faixa ausente

## Pergunta de negócio

Quais registros apresentam faixa ausente?

## SQL

```sql
WITH sequencia AS (
    SELECT serie, numero, LAG(numero) OVER (PARTITION BY serie ORDER BY numero) AS anterior
    FROM dbo.notas
)
SELECT serie, numero, numero - anterior - 1 AS quantidade_faltante
FROM sequencia WHERE numero - anterior > 1;
```

## Resultado esperado

Para a carga versionada: serie=1, numero=6, quantidade_faltante=1. O gabarito identifica `numero_ausente`: `{"serie": 1, "numero": 5}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de faixa ausente, antes de investigar e corrigir a origem dos dados.
