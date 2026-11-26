import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { gerar } from '../tools/gerar-seed.js';

test('carga e gabarito são determinísticos e correspondem aos arquivos versionados', () => {
  const a = gerar();
  assert.deepEqual(a, gerar());
  assert.equal(fs.readFileSync('seed/03_dados.sql', 'utf8'), a.sql);
  assert.equal(fs.readFileSync('docs/erros-plantados.json', 'utf8'), JSON.stringify(a.erros, null, 2) + '\n');
  execFileSync(process.execPath, ['tools/gerar-seed.js']);
  assert.equal(fs.readFileSync('seed/03_dados.sql', 'utf8'), a.sql);
});

test('os 12 erros do gabarito existem nos dados', () => {
  const { dados: d, erros } = gerar();
  assert.equal(erros.length, 12);
  assert.equal(new Set(erros.map(e => e.id)).size, 12);
  const checks = {
    total_nota: () => d.notas.find(n => n.nota_id === 1).total !== d.nota_itens.filter(i => i.nota_id === 1).reduce((s, i) => s + i.quantidade * i.valor_unitario, 0),
    numero_ausente: () => !d.notas.some(n => n.serie === 1 && n.numero === 5) && d.notas.some(n => n.numero === 4) && d.notas.some(n => n.numero === 6),
    nota_sem_itens: () => d.notas.some(n => n.nota_id === 2) && !d.nota_itens.some(i => i.nota_id === 2),
    nota_sem_pedido: () => d.notas.find(n => n.nota_id === 3).pedido_id === null,
    titulo_duplicado: () => d.titulos.filter(t => t.cliente_id === 4 && t.numero_documento === 'DUP' && t.parcela === 1).length === 2,
    titulo_sem_nota: () => d.titulos.find(t => t.titulo_id === 3).nota_id === null,
    titulo_valor_divergente: () => d.titulos.find(t => t.titulo_id === 4).valor !== d.notas.find(n => n.nota_id === 4).total,
    estoque_negativo: () => d.estoque_movimentos.filter(m => m.produto_id === 1).reduce((s, m) => s + m.quantidade, 0) < 0,
    produto_sem_movimento: () => d.produtos.some(p => p.produto_id === 2) && !d.estoque_movimentos.some(m => m.produto_id === 2),
    saida_produto_inativo: () => d.produtos.find(p => p.produto_id === 3).ativo === 0 && d.estoque_movimentos.some(m => m.produto_id === 3 && m.quantidade < 0),
    cnpj_duplicado: () => d.clientes.filter(c => c.cnpj === '00000000000001').length === 2,
    cliente_sem_email: () => d.clientes.find(c => c.cliente_id === 3).email === null,
  };
  for (const erro of erros) {
    assert.ok(checks[erro.id], `verificador ausente: ${erro.id}`);
    assert.ok(checks[erro.id](), `erro ausente: ${erro.id}`);
  }
});

// As chaves são verificadas independentemente do gerador para evitar um gabarito
// que aponte para um registro diferente daquele efetivamente plantado.
test('gabarito identifica a tabela, a categoria e as chaves esperadas', () => {
  const { erros } = gerar();
  const esperado = [
    ['total_nota','fiscal','notas',{nota_id:1}], ['numero_ausente','fiscal','notas',{serie:1,numero:5}],
    ['nota_sem_itens','fiscal','notas',{nota_id:2}], ['nota_sem_pedido','fiscal','notas',{nota_id:3}],
    ['titulo_duplicado','financeiro','titulos',{titulo_ids:[4,301]}], ['titulo_sem_nota','financeiro','titulos',{titulo_id:3}],
    ['titulo_valor_divergente','financeiro','titulos',{titulo_ids:[4,301]}], ['estoque_negativo','estoque','estoque_movimentos',{produto_id:1}],
    ['produto_sem_movimento','estoque','produtos',{produto_id:2}], ['saida_produto_inativo','estoque','estoque_movimentos',{produto_id:3,movimento_id:3}],
    ['cnpj_duplicado','cadastro','clientes',{cliente_ids:[1,2]}], ['cliente_sem_email','cadastro','clientes',{cliente_id:3}]
  ].map(([id,categoria,tabela,chave]) => ({id,categoria,tabela,chave}));
  assert.deepEqual(erros, esperado);
});

test('consultas possuem documentação com o SQL correspondente', () => {
  const categorias = { fiscal: 6, financeiro: 5, estoque: 5, cadastro: 4 };
  for (const [categoria, quantidade] of Object.entries(categorias)) {
    const arquivos = fs.readdirSync(`consultas/${categoria}`).filter(n => n.endsWith('.sql'));
    assert.equal(arquivos.length, quantidade);
    for (const arquivo of arquivos) {
      const sql = fs.readFileSync(`consultas/${categoria}/${arquivo}`, 'utf8').trim();
      const doc = fs.readFileSync(`docs/${categoria}_${arquivo.replace(/\.sql$/, '.md')}`, 'utf8');
      assert.ok(doc.includes('```sql\n' + sql + '\n```'), arquivo);
      assert.match(doc, /## Resultado esperado/);
    }
  }
});