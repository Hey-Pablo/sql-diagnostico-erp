# Consultas SQL para Diagnóstico de ERP

> **Status: em desenvolvimento.** O código entra aos poucos; abaixo está o planejamento do projeto.

## O que é

Banco fictício de ERP com erros plantados e 20 consultas documentadas que encontram esses erros: nota com total diferente da soma dos itens, numeração com buracos, título duplicado, estoque negativo, cadastro repetido.

## O que prova

SQL Server além do básico (CTE, funções de janela, `LEFT JOIN ... IS NULL`, índices) aplicado a perguntas reais de suporte a ERP.

## Stack

SQL Server 2022 Developer em Docker ou instalação local, T-SQL e Mermaid ou dbdiagram para o diagrama.

## Estrutura

```
sql-diagnostico-erp/
├─ schema/
│  ├─ 01_tabelas.sql      # clientes, produtos, pedidos, pedido_itens,
│  │                      # notas, nota_itens, titulos, estoque_movimentos
│  └─ 02_indices.sql
├─ seed/03_dados.sql      # cerca de 2 mil linhas, com 12 erros plantados
├─ consultas/
│  ├─ fiscal/             # 6 consultas
│  ├─ financeiro/         # 5 consultas
│  ├─ estoque/            # 5 consultas
│  └─ cadastro/           # 4 consultas
├─ docs/                  # um arquivo por consulta: problema, SQL, resultado esperado
├─ docker-compose.yml
└─ README.md
```

## Plano

1. Modele as 8 tabelas e desenhe o diagrama.
2. Scripts de criação com chaves e restrições.
3. Carga fictícia com erros plantados e uma lista do que foi plantado.
4. Escreva as consultas por categoria. Exemplos: buracos na numeração com `LAG`, vencidos por faixa de atraso (até 30 dias, 31 a 60, mais de 60), saldo negativo pela soma dos movimentos, CNPJ duplicado com `GROUP BY ... HAVING`.
5. Em 3 consultas lentas, mostre o plano de execução antes e depois de criar um índice.
6. Documente cada consulta: pergunta de negócio, SQL, resultado esperado e quando usar.
7. `docker-compose.yml` que sobe o SQL Server e um script que cria e carrega o banco.
8. README com o diagrama e o índice das consultas.

## Como deve funcionar

- Um comando sobe o banco e carrega os dados.
- Cada consulta devolve exatamente os erros plantados da sua categoria, e a documentação mostra o resultado esperado.
- Quem lê entende a pergunta de negócio antes de ver o SQL.

## Prazo

3 a 4 dias.

## Autor

Pablo Dilio · [Portfólio](https://hey-pablo.github.io/pablo-dilio-portfolio/) · [LinkedIn](https://www.linkedin.com/in/pablo-dilio-4063991b2)
