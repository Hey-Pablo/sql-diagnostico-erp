# Cnpj duplicado

## Pergunta de negócio

Quais registros apresentam cnpj duplicado?

## SQL

```sql
SELECT cnpj, COUNT(*) AS quantidade FROM dbo.clientes GROUP BY cnpj HAVING COUNT(*) > 1;
```

## Resultado esperado

Para a carga versionada: cnpj=00000000000001, quantidade=2. O gabarito identifica `cnpj_duplicado`: `{"cliente_ids": [1, 2]}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta na triagem de cnpj duplicado, antes de investigar e corrigir a origem dos dados.
