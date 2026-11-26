```markdown
# Fluxo da aplicação · Alertaí

Nov 13, 2026 · @Larissa

Todo uso do Alertaí passa pelo Início: dali a pessoa reporta, consulta o mapa, vê o painel do bairro ou abre um alerta. Reportar e tocar num ícone do mapa levam à mesma tela de ocorrência, onde a vizinhança confirma ou encerra o problema.

## Mapa das telas

&#91;embedded content: jornada do usuário · 7 telas\]

No primeiro uso a pessoa faz o cadastro (nome e celular) e escolhe os bairros; depois tudo sai do Início. O alerta em cascata chega por notificação ou pela faixa verde do Início.

## Caminhos principais

Cinco tarefas cobrem o uso do app; nenhuma passa de quatro toques a partir do Início.

| Tarefa | Caminho | Termina em |
| --- | --- | --- |
| Começar a usar | Abre o app → Cadastro (nome e celular) → Meus bairros (escolhe bairros e apelidos) → Início | 1. Início |
| Reportar um problema | Início → Reportar → escolhe o tipo → Enviar | 4. Ocorrência |
| Confirmar ou encerrar | Ocorrência → "Ainda está" ou "Já voltou" | 4. Ocorrência atualizada |
| Entender um alerta em cascata | Notificação ou faixa verde do Início → Alerta em cascata → passo da luz | 2. Alerta em cascata ou 4. Ocorrência |
| Explorar o bairro | Início → Mapa → toca num bairro → toca num alerta; ou Início → Painel | 4. Ocorrência ou 6. Painel do bairro |

A barra de navegação (Início, Mapa, Reportar, Painel e Bairros) fica fixa em todas as telas, então qualquer caminho pode recomeçar com um toque.

## Regras que mudam o caminho

Três regras do sistema decidem o que a pessoa vê depois de agir. São as mesmas do backend em Java e do protótipo.

| Quando | O que acontece | Onde aparece |
| --- | --- | --- |
| Alguém reporta um problema que já existe no mesmo bairro | O relato entra como confirmação da ocorrência aberta, sem criar outra | Aviso "Seu relato entrou como confirmação" na Ocorrência |
| Três pessoas tocam em "Já voltou" | A ocorrência é encerrada como resolvida | Selo Resolvido e última linha da linha do tempo |
| A falta de luz é confirmada no bairro de uma estação de bombeamento | Sai um alerta de possível falta de água para os bairros que ela abastece, uma vez por estação | Notificação, faixa verde do Início e camada Efeito cascata do Mapa |

O desenho do sistema prevê uma quarta regra: sem confirmação dentro do prazo do tipo (de 2 a 6 horas), a ocorrência expira e some do mapa. Ela ainda não está implementada no backend nem no protótipo.

```

!WhatsApp Image 2026-11-14 at 11.18.30.jpeg