# Títulos duplicados

## Pergunta de negócio

Títulos com mesmos dados de cliente, documento e parcela criam risco de pagamento duplicado e divergência no controle de caixa. Quais títulos possuem o mesmo número documental, indicando duplicidade?

## SQL

```sql
SELECT cliente_id, numero_documento, parcela, COUNT(*) AS quantidade
FROM dbo.titulos GROUP BY cliente_id, numero_documento, parcela
HAVING COUNT(*) > 1;
```

## Resultado esperado

Para a carga versionada: cliente_id=4, numero_documento=DUP, parcela=1, quantidade=2. O gabarito identifica `titulo_duplicado`: `{"titulo_ids": [4, 301]}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta antes do fechamento financeiro, ao conciliar com o SPED, ou quando há divergência entre relatório e extrato bancário.