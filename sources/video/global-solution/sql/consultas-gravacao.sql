-- Consultas da gravação do vídeo técnico (backlog E5.3).
-- Rodar depois da demo do console. Conexão: localhost:1521, service FREEPDB1, usuário alertai.
-- Conferidas em 16/11/2026 contra o banco depois do ensaio completo.

-- B06 · as 13 tabelas que o script criou
SELECT table_name FROM user_tables ORDER BY table_name;

-- B07 · inserção: o relato gravado, sem o nome de quem relatou
SELECT o.id_ocorrencia, t.nome AS tipo, b.nome AS bairro, o.status, o.confirmacoes, o.criada_em
  FROM ocorrencia o
  JOIN tipo_ocorrencia t ON t.id_tipo = o.id_tipo
  JOIN bairro b ON b.id_bairro = o.id_bairro;

-- B08 · atualização feita pela cascata: a estação mudou de status
SELECT nome, tipo, status FROM estacao_bombeamento ORDER BY id_estacao;

-- B09a · o aviso gerado e quantas pessoas foram notificadas
SELECT a.id_alerta, a.origem, a.titulo, a.id_ocorrencia_origem,
       (SELECT COUNT(*) FROM notificacao n WHERE n.id_alerta = a.id_alerta) AS notificacoes
  FROM alerta a;

-- B09b · para quais bairros o aviso foi
SELECT b.nome AS bairro_avisado
  FROM alerta_bairro ab
  JOIN bairro b ON b.id_bairro = ab.id_bairro
 ORDER BY b.nome;

-- B10 · dado vira indicador (I2, taxa de resolvidas), com os dados da demonstração
SELECT COUNT(*) AS registradas,
       SUM(CASE WHEN status = 'RESOLVIDA' THEN 1 ELSE 0 END) AS resolvidas,
       ROUND(100 * SUM(CASE WHEN status = 'RESOLVIDA' THEN 1 ELSE 0 END) / COUNT(*), 1) AS taxa_pct
  FROM ocorrencia;
