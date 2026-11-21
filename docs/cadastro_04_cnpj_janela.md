# CNPJs com janela de tempo

## Pergunta de negócio

Durante a reabertura de períodos ou correções de data, pode-se ter múltiplos clientes com o mesmo CNPJ em diferentes datas, causando dúvidas sobre qual cadastro está ativo. Quais CNPJs apresentam quantidade maior que 1, indicando possível janela de tempo?

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

Use esta consulta ao reabrir contas, durante a análise de clientes inativos, ou quando há dúvida sobre o cadastro correto de um CNPJ.