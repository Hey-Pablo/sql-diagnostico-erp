SELECT cliente_id FROM dbo.clientes WHERE email IS NULL OR LTRIM(RTRIM(email)) = '';
