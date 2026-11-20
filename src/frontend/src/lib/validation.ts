// Validação no cliente, com as mesmas regras do backend (Cpf.java,
// CartaoSus.java, SenhaHash.java). O servidor continua validando: isto só evita
// uma ida e volta e dá a mensagem ao lado do campo.

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function validateCpf(value: string): string | null {
  const digits = onlyDigits(value)
  if (!digits) return 'Informe o CPF.'
  if (digits.length !== 11) return 'O CPF precisa ter 11 números.'
  if (/^(\d)\1{10}$/.test(digits) || !cpfCheckDigitsMatch(digits)) {
    return 'O CPF informado não é válido. Confira os números.'
  }
  return null
}

function cpfCheckDigitsMatch(digits: string): boolean {
  const digitAt = (count: number, startWeight: number) => {
    let sum = 0
    for (let i = 0; i < count; i++) sum += Number(digits[i]) * (startWeight - i)
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }
  return digitAt(9, 10) === Number(digits[9]) && digitAt(10, 11) === Number(digits[10])
}

export function validateSusCard(value: string): string | null {
  const digits = onlyDigits(value)
  if (!digits) return 'Informe o Cartão SUS.'
  if (digits.length !== 15) return 'O Cartão SUS precisa ter 15 números.'
  if (!susCardMatches(digits)) return 'O Cartão SUS informado não é válido. Confira os números.'
  return null
}

function weightedSum(digits: string, startWeight: number): number {
  let sum = 0
  for (let i = 0; i < digits.length; i++) sum += Number(digits[i]) * (startWeight - i)
  return sum
}

// Rotina do DATASUS: definitivo começa com 1 ou 2, provisório com 7, 8 ou 9.
function susCardMatches(digits: string): boolean {
  const first = digits[0]
  if (first === '7' || first === '8' || first === '9') {
    return weightedSum(digits, 15) % 11 === 0
  }
  if (first !== '1' && first !== '2') return false

  const base = digits.slice(0, 11)
  const sum = weightedSum(base, 15)
  let dv = 11 - (sum % 11)
  if (dv === 11) dv = 0
  if (dv === 10) {
    let adjusted = 11 - ((sum + 2) % 11)
    if (adjusted === 11) adjusted = 0
    return digits === `${base}001${adjusted}`
  }
  return digits === `${base}000${dv}`
}

export function validateBirthDate(value: string): string | null {
  if (!value) return 'Informe a data de nascimento.'
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return 'Data inválida.'
  if (date > new Date()) return 'A data de nascimento não pode estar no futuro.'
  if (date.getFullYear() < 1900) return 'Confira o ano de nascimento.'
  return null
}

export function validatePassword(value: string): string | null {
  if (!value) return 'Informe a senha.'
  if (value.length < 8) return 'A senha precisa ter pelo menos 8 caracteres.'
  return null
}

export function validateRequired(value: string, message: string): string | null {
  return value.trim() ? null : message
}

export function formatCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
}

export function formatSusCard(value: string): string {
  const d = onlyDigits(value).slice(0, 15)
  return d.replace(/^(\d{3})(\d)/, '$1 $2').replace(/^(\d{3}) (\d{4})(\d)/, '$1 $2 $3').replace(/^(\d{3}) (\d{4}) (\d{4})(\d)/, '$1 $2 $3 $4')
}
