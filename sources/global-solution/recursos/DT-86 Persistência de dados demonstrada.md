Ligamos o menu ao Oracle local. O programa aplica o script das 13 tabelas, e cada operação passa por um DAO com `PreparedStatement` até a `ConnectionFactory`. Registrar um relato insere a linha em `OCORRENCIA`. Ver as ocorrências ativas do bairro consulta essas linhas. Confirmar ou marcar que já voltou atualiza o contador e, com três retornos de "já voltou", encerra a ocorrência como `RESOLVIDA`. O autor não aparece na tela.

As três consultas mostram esse resultado fora do menu. 

`SELECT table_name FROM user_tables` lista as tabelas que o script criou.

!image.png

 `SELECT id_bairro, nome FROM bairro` mostra o piloto gravado junto com o script: os bairros que o menu oferece na hora de registrar. 

!image.png

`SELECT id_ocorrencia, status, severidade, confirmacoes, descricao FROM ocorrencia` é o relato que o menu inseriu e que continua no banco depois que o programa fecha.

!image.png