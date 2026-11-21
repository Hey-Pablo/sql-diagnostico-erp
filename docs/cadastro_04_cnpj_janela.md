# Cnpj janela

## Pergunta de negócio

Quais registros apresentam cnpj janela?

## SQL

```sql
WITH classificados AS (
    SELECT cliente_id, cnpj, COUNT(*) OVER (PARTITION BY cnpj) AS quantidade FROM dbo.clientes
)
SELECT cliente_id, cnpj FROM classificados WHERE quantidade > 1;
```

## Resultado esperado

Para a carga versionada: cliente_id=1 e 2, cnpj=00000000000001. O gabarito identifica `cnpj_duplicado`: `{"cliente_ids": [1, 2]}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de cnpj janela, antes de investigar e corrigir a origem dos dados.
