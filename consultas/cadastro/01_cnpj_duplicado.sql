SELECT cnpj, COUNT(*) AS quantidade FROM dbo.clientes GROUP BY cnpj HAVING COUNT(*) > 1;
