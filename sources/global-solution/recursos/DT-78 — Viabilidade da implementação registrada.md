**Para o morador do piloto**

O público desta entrega é o morador que vê a luz cair, a água falhar ou a rua alagar e precisa que o vizinho confirme o mesmo fato. No piloto, os bairros são Menino Deus, Praia de Belas, Centro Histórico, Arquipélago e Bom Jesus. A implementação é viável para essa pessoa porque as regras que mudam o dia dela já executam. O segundo relato do mesmo tipo e bairro, dentro do prazo, entra na ocorrência ativa. Três retornos de "já voltou" encerram como resolvida. A falta de luz confirmada no Arquipélago avisa uma vez Menino Deus, Praia de Belas e Centro Histórico. A estação de drenagem do Bom Jesus fica de fora dessa regra.

**Com as tecnologias do DT-79**

Java 17 concentra essas regras em serviço. A mesma classe atende o menu desta demo e pode atender uma tela depois, sem reescrever o agrupamento nem a cascata. O Maven entrega esse programa num jar, com o driver do Oracle. O JDBC grava o que não pode se perder para o morador: o relato, a confirmação, o status da estação e a notificação. O volume do piloto cabe nesse banco: cinco bairros, seis tipos, três pessoas e duas estações. O menu de console serve para a avaliação ver o fluxo. No cotidiano do morador, a interface prevista continua sendo a tela do desenho. O efeito que ele recebe é o das chamadas: uma ocorrência por tipo e bairro, e um aviso só por estação.

**O alcance para quem mora no bairro**

O aviso fica em `NOTIFICACAO`, ligado ao alerta e à pessoa que segue o bairro. A API oficial de chuva e de nível do Guaíba, o push no celular e o SMS ficam fora desta demo, como o guia já previa. Na demo, estação, bairro abastecido e quem segue o bairro entram cadastrados. Para o morador do piloto, o que esta implementação sustenta é distinguir o relato da confirmação e disparar a cascata uma vez. O alerta que o Oracle guarda é a base do aviso que, num passo seguinte, chegaria ao telefone.