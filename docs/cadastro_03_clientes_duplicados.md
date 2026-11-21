# Clientes com CNPJs duplicados

## Pergunta de negócio

O CNPJ é o identificador único do cliente, mas cadastros duplicados causam divergência de saldos e comunicações. Quais clientes apresentam o mesmo CNPJ em múltiplos registros, indicando duplicidade?

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

Use esta consulta no fechamento de contas, antes de consolidar movimentações, ou ao investigar divergências entre histórico e extrato.