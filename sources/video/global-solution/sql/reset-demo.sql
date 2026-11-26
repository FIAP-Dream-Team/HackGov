-- Volta o banco ao estado de logo depois da opção 1 do menu, para regravar a demo (backlog E1.7).
-- Mantém tabelas e catálogo do piloto; apaga relatos, confirmações e avisos; religa a estação.
-- Os IDs voltam a começar em 1 porque o Identificador usa MAX + 1.
-- Para regravar também a opção 1 ("Tabelas criadas"), recrie o container (ver backlog E1.2).

DELETE FROM notificacao;
DELETE FROM alerta_bairro;
DELETE FROM alerta;
DELETE FROM confirmacao;
DELETE FROM ocorrencia;
UPDATE estacao_bombeamento SET status = 'OPERANDO';
COMMIT;
