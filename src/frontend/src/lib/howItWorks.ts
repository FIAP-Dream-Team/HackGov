import { CalendarCheck, ClipboardCheck, Send, UserCheck, type LucideIcon } from 'lucide-react'

// Os quatro passos da jornada, usados na home e na coluna "Como funciona" do
// app. Ficam num lugar só para os dois textos não se desencontrarem.
export const HOW_IT_WORKS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Send, title: 'A UBS encaminha', text: 'O médico da UBS pede a consulta ou o exame com especialista.' },
  { icon: ClipboardCheck, title: 'A equipe libera', text: 'Depois da triagem, a unidade libera a marcação do horário.' },
  { icon: CalendarCheck, title: 'Você escolhe o horário', text: 'Só aparecem vagas reais da sua especialidade.' },
  { icon: UserCheck, title: 'Atendimento', text: 'No dia, sua senha aparece no painel da sala de espera.' },
]
