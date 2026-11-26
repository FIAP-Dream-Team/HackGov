```markdown
# Acessibilidade · Alertaí

Nov 13, 2026 · @Larissa

O Alertaí segue as regras de nível AA da WCAG 2.1: todo texto passa no contraste mínimo, a gravidade nunca é mostrada só pela cor e o app funciona pelo teclado e com texto ampliado. Este documento mostra o que foi aplicado no app e no protótipo do Figma, e como foi verificado.

## Cuidados aplicados

Doze cuidados estão no app em React e no protótipo do Figma, cada um ligado a um critério da WCAG 2.1.

| Cuidado | Como aplicamos no Alertaí | Critério WCAG | Onde ver |
| --- | --- | --- | --- |
| Contraste de texto | Todo texto tem pelo menos 4,5:1 com o fundo; o menor valor do app é 5,0:1 | 1.4.3 Contraste (AA) | Todas as telas |
| Cor nunca sozinha | A gravidade sempre aparece escrita (Atenção, Perigo, Grande perigo) ao lado da cor | 1.4.1 Uso de cor (A) | Selos dos alertas, mapa e legenda |
| Ícones com nome | Todo ícone vem com texto; ícones decorativos ficam escondidos do leitor de tela | 1.1.1 Conteúdo não textual (A) | Menu, tipos de relato, mapa |
| Texto maior | Opção "Texto maior" aumenta todas as letras do app em 12,5%, sem quebrar o layout | 1.4.4 Redimensionar texto (AA) | Meus bairros → Acessibilidade |
| Fonte legível | Figtree no texto: 16 px no corpo, 14 px nas listas, 12 px nas legendas e 11 px nos nomes da barra de navegação; Sora só nos títulos. A opção Texto maior aumenta tudo | Boa prática | Todas as telas |
| Uso pelo teclado | Botões, links, bairros do mapa e opções do relato funcionam com Tab, Enter e espaço | 2.1.1 Teclado (A) | Mapa e Reportar |
| Foco visível | Contorno verde de 3 px em tudo que recebe foco, com 5,5:1 contra o fundo | 2.4.7 Foco visível (AA) | Todas as telas |
| Pular para o conteúdo | Link "Pular para o conteúdo" aparece ao apertar Tab no começo da página | 2.4.1 Pular blocos (A) | Topo do app |
| Nomes para leitor de tela | Mapa, medidor do Guaíba e botões de ícone têm descrição falada (ex.: "Menino Deus: 3 alertas, Perigo") | 4.1.2 Nome, função, valor (A) | Mapa e Nível do Guaíba |
| Alvos de toque grandes | Botões principais, itens de lista e barra de navegação com 44 px ou mais; filtros do mapa com 32 px, acima do mínimo de 24 px; Reportar no centro da barra | 2.5.8 Tamanho do alvo (WCAG 2.2, AA) | Barra de navegação e listas |
| Linguagem simples | Frases curtas e diretas, sem jargão técnico ("Ainda está", "Já voltou", "O que fazer") | 3.1.5 Nível de leitura (AAA) | Ocorrência e Alerta |
| Menos movimento | Animações desligadas para quem ativa "Reduzir movimento" no sistema | 2.3.3 Animação por interação (AAA) | Todo o app |

O app também declara o idioma português na página, para o leitor de tela pronunciar certo (critério 3.1.1).

## Contraste medido

As 13 combinações de cor do app passam no nível AA: o pior caso é o selo Resolvido, com 5,0:1, acima do mínimo de 4,5:1. As razões foram calculadas pela fórmula de luminância relativa da WCAG 2.1.

| Onde aparece | Texto | Fundo | Contraste | Resultado |
| --- | --- | --- | --- | --- |
| Texto principal em cartão | `#221B33` | `#FFFFFF` | 16,5:1 | AAA |
| Texto principal | `#221B33` | `#F6F3FB` | 15,0:1 | AAA |
| Selo Atenção | `#3A2C00` | `#F2C230` | 8,1:1 | AAA |
| Botão Reportar | `#FFFFFF` | `#5B3FA8` | 7,7:1 | AAA |
| Link em cartão | `#5B3FA8` | `#FFFFFF` | 7,7:1 | AAA |
| Texto secundário em cartão | `#5D5470` | `#FFFFFF` | 7,1:1 | AAA |
| Texto secundário | `#5D5470` | `#F6F3FB` | 6,4:1 | AA |
| Link e menu ativo | `#5B3FA8` | `#ECE6F8` | 6,3:1 | AA |
| Faixa do efeito cascata | `#FFFFFF` | `#27704C` | 6,0:1 | AA |
| Selo Perigo | `#2B1200` | `#E8731C` | 5,8:1 | AA |
| Selo Grande perigo | `#FFFFFF` | `#C62828` | 5,6:1 | AA |
| Contorno de foco (3 px) | `#27704C` | `#F6F3FB` | 5,5:1 | AA (mínimo 3:1) |
| Selo Resolvido | `#FFFFFF` | `#2E7D4F` | 5,0:1 | AA |

As cores dos três níveis de gravidade seguem os avisos do INMET (amarelo, laranja e vermelho), que o público já conhece. O lilás do logo (`#9B7FE0`) é decorativo e nunca é usado em texto.

## Teste e problema encontrado

No teste no Chrome de uma integrante da equipe, o texto de todos os links aparecia escuro sobre o roxo, com contraste de 2,1:1. Corrigimos para que as cores do app tenham prioridade, e o texto voltou a 7,7:1.

1. **O que vimos:** o botão Reportar, a faixa do efeito cascata, "Abrir mapa" e o item ativo do menu ficavam com texto quase preto. Textos que não eram links ficavam certos.
2. **Causa:** uma extensão do navegador (LocatorJS) injetava uma regra que pintava todo link de escuro, e essa regra vencia as cores do app.
3. **Correção:** as cores do tema passaram a ter prioridade sobre estilos de fora da página, e o texto sobre roxo e verde ganhou o branco como garantia.
4. **Verificação:** simulamos uma regra externa que pinta todo link de preto. Mesmo com ela, o Reportar continuou branco e o "Abrir mapa" continuou roxo.

No mesmo teste, o verde de destaque estava no limite, com 4,5:1. Ele foi escurecido para `#27704C`, que dá 6,0:1.

## Limitações e próximos passos

O que ainda não foi testado ou não existe no protótipo:

- [ ] Testar com leitor de tela de verdade (VoiceOver no iPhone e TalkBack no Android)
- [ ] Validar com pessoas idosas e com baixa visão, junto com a validação do protótipo da Brenda
- [ ] Oferecer o mapa também como lista de bairros, para quem não enxerga o desenho (hoje a lista aparece ao tocar num bairro)
- [ ] Ler os alertas em voz alta e enviar por SMS para quem está sem internet (o consentimento já está em Meus bairros)
- [ ] Criar um tema escuro e um modo de alto contraste

No Figma, as telas de celular têm 500 px de largura, por limitação da ferramenta de captura. O layout é o mesmo de um celular de 390 px.

## Referências

- WCAG 2.1, recomendação do W3C: critérios e fórmula de contraste usados neste documento
- WCAG 2.2, recomendação do W3C: critério 2.5.8, tamanho mínimo do alvo de toque
- Protótipo no Figma: arquivo "Alertaí · Protótipo", páginas Wireframes e Alta fidelidade
- Código do app: `frontend/src/styles/tema.css` (cores) e `frontend/src/index.css` (foco, texto maior e menos movimento)

```