// Gerado por sources/video/remotion/scripts/fase-3/align.mjs. Nao editar a mao.
window.STORYBOARD = {
 "videoSec": 259.941,
 "alignmentRate": 0.9239,
 "scenes": [
  {
   "scene": "01",
   "start": 0,
   "end": 19.77,
   "speaker": "john",
   "spoken": "E aí, pessoal! Somos a equipe do HackGov: meu nome é John, estou com Ana Larissa, João Pedro, Vinícius Cardoso e Brenda. Depois de modelar e prototipar o fluxo do Minha Vez, chegou a hora de armazenar os dados. Vamos mostrar como o projeto evoluiu, do código até o banco de dados.",
   "reveals": [
    {
     "id": "s01-john",
     "start": 3.09
    },
    {
     "id": "s01-larissa",
     "start": 4.55
    },
    {
     "id": "s01-joao",
     "start": 5.79
    },
    {
     "id": "s01-vinicius",
     "start": 6.49
    },
    {
     "id": "s01-brenda",
     "start": 7.41
    },
    {
     "id": "s01-titulo",
     "start": 12.37
    },
    {
     "id": "s01-sub",
     "start": 16.95
    }
   ],
   "camera": []
  },
  {
   "scene": "02",
   "start": 19.77,
   "end": 49.72,
   "speaker": "joao",
   "spoken": "Na fase anterior, o Minha Vez tinha o fluxo do cidadão modelado, prototipado e com um primeiro recorte do domínio em Java. Ao desenhar o banco, a modelagem dos dados expôs regras da US03 que o código ainda não aplicava. Por isso atualizamos o projeto inteiro: agora são 9 classes em Java, 5 testes automatizados, diagramas e telas revisados, e o banco, com 11 entidades e 12 tabelas.",
   "reveals": [
    {
     "id": "s02-fase2",
     "start": 21.63
    },
    {
     "id": "s02-insight",
     "start": 27.63
    },
    {
     "id": "s02-java",
     "start": 39.59
    },
    {
     "id": "s02-testes",
     "start": 41.25
    },
    {
     "id": "s02-uml",
     "start": 43.77
    },
    {
     "id": "s02-telas",
     "start": 44.27
    },
    {
     "id": "s02-banco",
     "start": 45.91
    }
   ],
   "camera": []
  },
  {
   "scene": "03",
   "start": 49.72,
   "end": 73.8,
   "speaker": "joao",
   "spoken": "A principal regra: o encaminhamento define a unidade da consulta, e o cidadão só vê e só agenda vagas dessa unidade. Reagendar cancela o horário atual e cria um novo, ligado a ele. Cancelar ou reagendar só vale até 24 horas antes, com no máximo 2 reagendamentos; depois, só no balcão.",
   "reveals": [
    {
     "id": "s03-enc",
     "start": 51.33
    },
    {
     "id": "s03-r1",
     "start": 54.95
    },
    {
     "id": "s03-vaga1",
     "start": 56.57
    },
    {
     "id": "s03-vaga2",
     "start": 56.87
    },
    {
     "id": "s03-vaga3",
     "start": 57.37
    },
    {
     "id": "s03-r2",
     "start": 58.83
    },
    {
     "id": "s03-r3",
     "start": 64
    },
    {
     "id": "s03-r4",
     "start": 69.51
    }
   ],
   "camera": []
  },
  {
   "scene": "04",
   "start": 73.8,
   "end": 91.306,
   "speaker": "joao",
   "spoken": "Os 5 testes passam, e a saída do demo mostra o anterior cancelado, o novo apontando para ele e o erro quando a vaga é de outra unidade. O domínio ainda roda em memória: gravar no banco é a próxima etapa.",
   "reveals": [
    {
     "id": "s04-testes",
     "start": 73.8
    },
    {
     "id": "s04-anterior",
     "start": 78.53
    },
    {
     "id": "s04-novo",
     "start": 80.79
    },
    {
     "id": "s04-erro",
     "start": 82.47
    },
    {
     "id": "s04-memoria",
     "start": 86.05
    }
   ],
   "camera": []
  },
  {
   "scene": "05",
   "start": 91.306,
   "end": 103.767,
   "speaker": "john",
   "spoken": "Os diagramas UML foram revisados contra o código: classes e sequência de agendar atualizados, mais dois diagramas novos, o de sequência do reagendamento e o de atividades de reagendar e cancelar.",
   "reveals": [
    {
     "id": "s05-classes",
     "start": 94.25
    },
    {
     "id": "s05-seq-agendar",
     "start": 95.12
    },
    {
     "id": "s05-seq-reagendar",
     "start": 99.05
    },
    {
     "id": "s05-atividades",
     "start": 100.77
    }
   ],
   "camera": []
  },
  {
   "scene": "06",
   "start": 103.767,
   "end": 111.423,
   "speaker": "john",
   "spoken": "Nos wireframes, três telas foram atualizadas e três são novas, cobrindo reagendamento, limite e prazo.",
   "reveals": [
    {
     "id": "s06-atualizadas",
     "start": 104.83
    },
    {
     "id": "s06-novas",
     "start": 106.73
    }
   ],
   "camera": [
    {
     "focus": "novas",
     "start": 106.88
    }
   ]
  },
  {
   "scene": "07",
   "start": 111.423,
   "end": 116.36,
   "speaker": "larissa",
   "spoken": "Para o modelo lógico, usamos o Oracle SQL Developer Data Modeler, com notação Barker.",
   "reveals": [
    {
     "id": "s07-ferramenta",
     "start": 113.154
    },
    {
     "id": "s07-banco",
     "start": 113.654
    },
    {
     "id": "s07-barker",
     "start": 114.87
    }
   ],
   "camera": [
    {
     "focus": "diagrama",
     "start": 115.02
    }
   ]
  },
  {
   "scene": "08",
   "start": 116.36,
   "end": 120.34,
   "speaker": "larissa",
   "spoken": "São 11 entidades, 15 relacionamentos e 2 heranças.",
   "reveals": [
    {
     "id": "s08-entidades",
     "start": 116.53
    },
    {
     "id": "s08-m-entidades",
     "start": 116.53
    },
    {
     "id": "s08-relacoes",
     "start": 117.91
    },
    {
     "id": "s08-m-relacoes",
     "start": 117.91
    },
    {
     "id": "s08-herancas",
     "start": 118.99
    },
    {
     "id": "s08-m-herancas",
     "start": 118.99
    }
   ],
   "camera": []
  },
  {
   "scene": "09",
   "start": 120.34,
   "end": 144.362,
   "speaker": "larissa",
   "spoken": "O modelo traz uma especialização, com Pessoa dividida em Cidadão e Usuário Institucional; uma agregação, na entidade Agendamento; e um autorrelacionamento, que liga o reagendamento ao horário anterior. O contato do cidadão é multivalorado e virou entidade própria, e o endereço da unidade foi decomposto em atributos. CID, laudo e prontuário ficam fora do banco, para reduzir o dano em caso de vazamento.",
   "reveals": [
    {
     "id": "s09-especializacao",
     "start": 120.87
    },
    {
     "id": "s09-m-pessoa",
     "start": 122.39
    },
    {
     "id": "s09-agregacao",
     "start": 125.51
    },
    {
     "id": "s09-m-agendamento",
     "start": 126.31
    },
    {
     "id": "s09-reagendado",
     "start": 128.39
    },
    {
     "id": "s09-m-reagendado",
     "start": 129.59
    },
    {
     "id": "s09-multivalorado",
     "start": 131.33
    },
    {
     "id": "s09-m-contato",
     "start": 133.35
    },
    {
     "id": "s09-composto",
     "start": 136.35
    },
    {
     "id": "s09-m-unidade",
     "start": 137.31
    },
    {
     "id": "s09-fora",
     "start": 138.975
    }
   ],
   "camera": [
    {
     "focus": "pessoa",
     "start": 121.02
    },
    {
     "focus": "agregacao",
     "start": 125.66
    },
    {
     "focus": "reagendado",
     "start": 128.54
    },
    {
     "focus": "contato",
     "start": 131.48
    },
    {
     "focus": "unidade",
     "start": 136.5
    },
    {
     "focus": "tudo",
     "start": 139.125
    }
   ]
  },
  {
   "scene": "10",
   "start": 144.362,
   "end": 167.48,
   "speaker": "vinicius",
   "spoken": "Para entender por que normalizar, imaginamos tudo numa tabela só. Na inserção, não dá para cadastrar um cidadão sem encaminhamento nem publicar uma vaga que ninguém reservou. Na exclusão, apagar o único pedido de um cidadão leva junto o cadastro dele e o endereço da unidade. E na alteração, se alguém troca de celular, cada pedido precisa mudar, e esquecer um deixa duas versões da verdade.",
   "reveals": [
    {
     "id": "s10-ins",
     "start": 148.03
    },
    {
     "id": "s10-o-ins",
     "start": 149.41
    },
    {
     "id": "s10-exc",
     "start": 153.97
    },
    {
     "id": "s10-o-exc",
     "start": 155.19
    },
    {
     "id": "s10-alt",
     "start": 159.59
    },
    {
     "id": "s10-o-alt",
     "start": 161.69
    },
    {
     "id": "s10-o-alt2",
     "start": 164.67
    }
   ],
   "camera": []
  },
  {
   "scene": "11",
   "start": 167.48,
   "end": 183.89,
   "speaker": "vinicius",
   "spoken": "Aplicando as formas normais: na primeira, contatos e histórico viram tabelas e o endereço vira colunas. Na segunda, encaminhamento, horário e agendamento ficam separados. Na terceira, achamos uma dependência transitiva em Unidade de Saúde:",
   "reveals": [
    {
     "id": "s11-1fn",
     "start": 169.35
    },
    {
     "id": "s11-2fn",
     "start": 174.43
    },
    {
     "id": "s11-3fn",
     "start": 178.87
    }
   ],
   "camera": []
  },
  {
   "scene": "12",
   "start": 183.89,
   "end": 200.458,
   "speaker": "vinicius",
   "spoken": "logradouro, bairro, cidade e UF dependem do CEP, então criamos a tabela CEP. Com ela, o modelo chega à BCNF. Algumas redundâncias foram mantidas de propósito, como o status do encaminhamento, com a consistência garantida pela aplicação e pelo banco.",
   "reveals": [
    {
     "id": "s12-cadeia",
     "start": 183.89
    },
    {
     "id": "s12-unidade",
     "start": 187.71
    },
    {
     "id": "s12-cep",
     "start": 188.06
    },
    {
     "id": "s12-bcnf",
     "start": 190.67
    },
    {
     "id": "s12-mantido",
     "start": 192.81
    }
   ],
   "camera": []
  },
  {
   "scene": "13",
   "start": 200.458,
   "end": 227.65,
   "speaker": "vinicius",
   "spoken": "No modelo físico, o mesmo banco ganha tipos e chaves: são 12 tabelas, com NUMBER, VARCHAR2, CHAR, DATE e TIMESTAMP. Cada relacionamento vira uma coluna de chave estrangeira, e a especialização de Pessoa vira três tabelas com o mesmo ID_PESSOA. A tabela nova é a CEP, vinda da normalização, o que levou o modelo de 11 para 12 tabelas e de 17 para 18 chaves estrangeiras.",
   "reveals": [
    {
     "id": "s13-tipos",
     "start": 205.01
    },
    {
     "id": "s13-fk",
     "start": 208.99
    },
    {
     "id": "s13-pessoa",
     "start": 212.85
    },
    {
     "id": "s13-m-usuario",
     "start": 214.29
    },
    {
     "id": "s13-m-pessoa",
     "start": 214.49
    },
    {
     "id": "s13-m-cidadao",
     "start": 214.69
    },
    {
     "id": "s13-cep",
     "start": 217.33
    },
    {
     "id": "s13-m-cep",
     "start": 218.13
    },
    {
     "id": "s13-contagem",
     "start": 220.81
    }
   ],
   "camera": [
    {
     "focus": "tipos",
     "start": 205.16
    },
    {
     "focus": "fk",
     "start": 209.14
    },
    {
     "focus": "pessoa",
     "start": 213
    },
    {
     "focus": "cep",
     "start": 217.48
    },
    {
     "focus": "tudo",
     "start": 220.96
    }
   ]
  },
  {
   "scene": "14",
   "start": 227.65,
   "end": 246.62,
   "speaker": "john",
   "spoken": "Por fim, o script SQL cria esse banco no Oracle, e o próprio banco garante as regras da US03: uma chave estrangeira composta só aceita o agendamento se o horário for da mesma especialidade e da mesma unidade do encaminhamento, e um índice único impede que a mesma vaga tenha dois agendamentos ativos.",
   "reveals": [
    {
     "id": "s14-stats",
     "start": 228.19
    },
    {
     "id": "s14-hl-fk",
     "start": 233.23
    },
    {
     "id": "s14-cm-fk",
     "start": 236.07
    },
    {
     "id": "s14-hl-idx",
     "start": 242.35
    },
    {
     "id": "s14-cm-idx",
     "start": 243.13
    }
   ],
   "camera": []
  },
  {
   "scene": "15",
   "start": 246.62,
   "end": 259.941,
   "speaker": "john",
   "spoken": "Foi assim que o Minha Vez saiu de um domínio em memória para um banco desenhado, normalizado e pronto para o Java gravar. Dito isso, muito obrigado por assistir!",
   "reveals": [
    {
     "id": "s15-de",
     "start": 248.11
    },
    {
     "id": "s15-para",
     "start": 249.11
    },
    {
     "id": "s15-obrigado",
     "start": 254.89
    },
    {
     "id": "s15-repo",
     "start": 255.49
    },
    {
     "id": "s15-equipe",
     "start": 255.89
    }
   ],
   "camera": []
  }
 ]
};
