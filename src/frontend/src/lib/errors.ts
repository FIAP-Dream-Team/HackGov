import type { ApiError } from '../api/client'

// Tradução dos códigos do contrato (docs/fase-4/contrato-da-api.md) em texto
// para quem usa a tela: um título curto do que aconteceu, a explicação e, se
// houver, o que fazer em seguida. A mensagem do servidor é mantida quando ela
// já é específica (regra violada, dado inválido): é ela que diz qual regra.

export interface ErrorDescription {
  title: string
  message: string
  hint?: string
  /** Campo do formulário que causou o erro, para mostrar ao lado dele. */
  field?: 'cpf' | 'cartaoSus'
  /** Faz sentido oferecer "Tentar de novo" sem mudar nada. */
  retryable: boolean
}

export function describeError(error: ApiError): ErrorDescription {
  switch (error.code) {
    case 'SEM_CONEXAO':
      return {
        title: 'Sem conexão com o servidor',
        message: 'Não conseguimos falar com o Minha Vez agora.',
        hint: 'Confira a internet e tente de novo em instantes.',
        retryable: true,
      }
    case 'SESSAO_AUSENTE':
    case 'SESSAO_INVALIDA':
      return {
        title: 'Sua sessão terminou',
        message: 'Por segurança, entre de novo para continuar.',
        retryable: false,
      }
    case 'SENHA_INCORRETA':
      return {
        title: 'Dados de acesso não conferem',
        message: error.message,
        hint: 'Confira os números e a senha. Letras maiúsculas e minúsculas fazem diferença.',
        retryable: false,
      }
    case 'CONTA_GOVBR':
      return {
        title: 'Esta conta entra pelo Gov.br',
        message: error.message,
        retryable: false,
      }
    case 'CIDADAO_NAO_ENCONTRADO':
      return {
        title: 'Cadastro não encontrado',
        message: 'Não achamos ninguém com esses dados.',
        hint: 'Confira os números e a data de nascimento ou peça ajuda no balcão da UBS.',
        retryable: false,
      }
    case 'CPF_JA_CADASTRADO':
      return {
        title: 'Este CPF já tem cadastro',
        message: error.message,
        hint: 'Volte para a tela de entrar e use sua senha ou o Gov.br.',
        field: 'cpf',
        retryable: false,
      }
    case 'CARTAO_JA_CADASTRADO':
      return {
        title: 'Este Cartão SUS já tem cadastro',
        message: error.message,
        hint: 'Confira o número ou deixe o campo em branco.',
        field: 'cartaoSus',
        retryable: false,
      }
    case 'ACESSO_NEGADO':
      return {
        title: 'Ação não permitida neste canal',
        message: error.message,
        retryable: false,
      }
    case 'ENCAMINHAMENTO_NAO_ENCONTRADO':
      return {
        title: 'Encaminhamento não encontrado',
        message: error.message,
        hint: 'Atualize a página. Se continuar, procure o balcão da UBS.',
        retryable: false,
      }
    case 'HORARIO_NAO_ENCONTRADO':
      return {
        title: 'Esse horário não está mais disponível',
        message: error.message,
        hint: 'A lista foi atualizada. Escolha outro horário.',
        retryable: false,
      }
    case 'REGRA_VIOLADA':
      return {
        title: 'Não foi possível concluir',
        message: error.message,
        retryable: false,
      }
    case 'CONFIRMACAO_AUSENTE':
    case 'CANAL_INCORRETO':
    case 'DADOS_INVALIDOS':
      return {
        title: 'Confira os dados',
        message: error.message,
        retryable: false,
      }
    case 'FALHA_INTERNA':
      return {
        title: 'O sistema teve um problema',
        message: 'Não foi culpa sua. Nada foi alterado.',
        hint: 'Tente de novo em instantes. Se continuar, procure o balcão da UBS.',
        retryable: true,
      }
    default:
      return {
        title: 'Algo deu errado',
        message: error.message,
        hint: 'Tente de novo em instantes.',
        retryable: true,
      }
  }
}
