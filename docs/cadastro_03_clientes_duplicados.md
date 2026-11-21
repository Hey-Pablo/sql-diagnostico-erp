# Clientes duplicados

## Pergunta de negócio

Quais registros apresentam clientes duplicados?

## SQL

```sql
WITH duplicados AS (
    SELECT cnpj FROM dbo.clientes GROUP BY cnpj HAVING COUNT(*) > 1
)
SELECT c.cliente_id, c.cnpj FROM dbo.clientes AS c JOIN duplicados AS d ON d.cnpj = c.cnpj;
```

## Resultado esperado

Para a carga versionada: cliente_id=1 e 2, cnpj=00000000000001. O gabarito identifica `cnpj_duplicado`: `{"cliente_ids": [1, 2]}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de clientes duplicados, antes de investigar e corrigir a origem dos dados.
