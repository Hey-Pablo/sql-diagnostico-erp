# Linhas duplicadas

## Pergunta de negócio

Quais registros apresentam linhas duplicadas?

## SQL

```sql
WITH grupos AS (
    SELECT titulo_id, cliente_id, numero_documento, parcela,
           COUNT(*) OVER (PARTITION BY cliente_id, numero_documento, parcela) AS quantidade
    FROM dbo.titulos
)
SELECT titulo_id, cliente_id, numero_documento, parcela FROM grupos WHERE quantidade > 1;
```

## Resultado esperado

Para a carga versionada: titulo_id=4 e 301, cliente_id=4, numero_documento=DUP, parcela=1. O gabarito identifica `titulo_duplicado`: `{"titulo_ids": [4, 301]}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de linhas duplicadas, antes de investigar e corrigir a origem dos dados.
