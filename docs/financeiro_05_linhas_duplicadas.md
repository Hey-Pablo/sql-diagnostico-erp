# Linhas de título duplicadas

## Pergunta de negócio

Lançamentos de título com os mesmos dados de cliente, documento e parcela criam risco de pagamento duplicado. Quais títulos possuem o mesmo número documental, indicando duplicidade?

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

Use esta consulta antes do fechamento financeiro, ao conciliar com o SPED, ou quando há divergência entre relatório e extrato bancário.