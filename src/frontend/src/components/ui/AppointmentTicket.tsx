import { CalendarCheck, MapPin } from 'lucide-react'

const monthFormat = new Intl.DateTimeFormat('pt-BR', { month: 'short' })
const weekdayFormat = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

interface AppointmentTicketProps {
  /** LocalDateTime do backend: aaaa-mm-ddThh:mm:ss. */
  dateTime: string
  specialty: string
  unit: string
  protocol: string
}

/**
 * Horário marcado em forma de ingresso: o dia em destaque no canhoto e os
 * dados do atendimento do outro lado do picote. É o momento de sucesso da
 * jornada (US03), por isso ganha destaque.
 */
export function AppointmentTicket({ dateTime, specialty, unit, protocol }: AppointmentTicketProps) {
  const date = new Date(`${dateTime.slice(0, 10)}T12:00:00`)
  const day = dateTime.slice(8, 10)
  const month = monthFormat.format(date).replace('.', '')
  const weekday = weekdayFormat.format(date)
  const time = dateTime.slice(11, 16)

  return (
    <div className="relative flex overflow-hidden rounded-2xl border border-green-200 bg-green-100 text-green-900">
      <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-green-700 px-2 py-4 text-neutral-50 sm:w-28">
        <span className="text-xs font-semibold uppercase tracking-wide text-green-100">{month}</span>
        <span className="text-4xl leading-none font-extrabold">{day}</span>
        <span className="mt-1 text-xs capitalize text-green-100">{weekday.split('-')[0]}</span>
      </div>

      {/* Picote: linha tracejada com dois recortes redondos da cor do fundo. */}
      <div aria-hidden="true" className="relative w-0 border-l-2 border-dashed border-green-300">
        <span className="absolute -top-2 -left-2 size-4 rounded-full bg-neutral-50" />
        <span className="absolute -bottom-2 -left-2 size-4 rounded-full bg-neutral-50" />
      </div>

      <div className="min-w-0 flex-1 px-4 py-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-700">
          <CalendarCheck aria-hidden="true" className="size-4" /> Horário marcado
        </p>
        <p className="mt-0.5 text-2xl font-extrabold">{time}</p>
        <p className="font-semibold">{specialty}</p>
        <p className="mt-1 flex items-center gap-1 text-sm text-green-800">
          <MapPin aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate">{unit}</span>
        </p>
        <p className="mt-1 font-mono text-xs text-green-700">{protocol}</p>
      </div>
    </div>
  )
}
