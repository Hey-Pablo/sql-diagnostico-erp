# CNPJs duplicados nos clientes

## Pergunta de negócio

A SEFAZ rejeita a abertura de novos clientes quando já existe um CNPJ cadastrado com outro código. Quais clientes compartilham o mesmo CNPJ, indicando cadastro duplicado ou erro de digitação?

## SQL

```sql
SELECT cnpj, COUNT(*) AS quantidade FROM dbo.clientes GROUP BY cnpj HAVING COUNT(*) > 1;
```

## Resultado esperado

Para a carga versionada: cnpj=00000000000001, quantidade=2. O gabarito identifica `cnpj_duplicado`: `{"cliente_ids": [1, 2]}`. A ordem das linhas não é garantida.

## Quando usar

Use esta consulta ao auditar novos cadastros, antes de migrar dados para o ERP, ou quando há reclamações de cliente sobre falha na inclusão.