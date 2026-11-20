// Formatação de datas para pt-BR. O backend manda data como aaaa-mm-dd,
// hora como hh:mm e LocalDateTime como aaaa-mm-ddThh:mm:ss.

const weekday = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' })

export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split('-')
  return `${day}/${month}/${year}`
}

export function formatWeekday(isoDate: string): string {
  const date = new Date(`${isoDate.slice(0, 10)}T12:00:00`)
  return weekday.format(date).replace('.', '')
}

export function formatDateTime(isoDateTime: string): string {
  return `${formatDate(isoDateTime)} às ${isoDateTime.slice(11, 16)}`
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} s`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 48) return `${hours} h`
  return `${Math.round(hours / 24)} dias`
}
