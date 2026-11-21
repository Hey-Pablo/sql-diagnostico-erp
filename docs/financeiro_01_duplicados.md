# Duplicados

## Pergunta de negócio

Quais registros apresentam duplicados?

## SQL

```sql
SELECT cliente_id, numero_documento, parcela, COUNT(*) AS quantidade
FROM dbo.titulos GROUP BY cliente_id, numero_documento, parcela
HAVING COUNT(*) > 1;
```

## Resultado esperado

Para a carga versionada: cliente_id=4, numero_documento=DUP, parcela=1, quantidade=2. O gabarito identifica `titulo_duplicado`: `{"titulo_ids": [4, 301]}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de duplicados, antes de investigar e corrigir a origem dos dados.
