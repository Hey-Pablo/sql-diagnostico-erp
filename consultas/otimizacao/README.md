# Comparação de acesso

Execute cada arquivo no SSMS com o plano de execução real habilitado. A primeira instrução força a varredura da tabela (`INDEX(0)`); a segunda usa o índice definido em `schema/02_indices.sql`. Compare os planos e as mensagens de `STATISTICS IO` e `TIME`. Os resultados devem ser iguais. A carga pequena pode favorecer varredura; os exemplos não prometem ganho e não substituem medição em produção. Não foi possível obter planos nesta VPS sem SQL Server.
