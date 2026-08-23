const deviceBase =
  'w-full max-w-[360px] rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-[0_12px_32px_-20px_rgba(0,0,0,0.35)]'

const btnBase =
  'mb-2 block w-full rounded-[10px] border border-neutral-300 bg-neutral-50 p-3 text-center text-[0.8rem] font-semibold text-neutral-950'

const btnPrimary =
  'mb-2 block w-full rounded-[10px] border border-green-500 bg-green-500 p-3 text-center text-[0.8rem] font-semibold text-neutral-50'

export function TotemPreview() {
  return (
    <div className={deviceBase}>
      <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-neutral-950">
        <span>Minha Vez</span>
        <span className="text-[0.7rem] font-medium text-neutral-500">UBS Vila União</span>
      </div>
      <h4 className="mt-2 mb-1 text-base text-neutral-950">Veja em que etapa está seu pedido</h4>
      <p className="mb-3.5 text-[0.78rem] text-neutral-500">
        Consulta com especialista ou exame. É só encostar o cartão.
      </p>
      <button className={btnPrimary} type="button">
        Encostar o Cartão SUS
      </button>
      <button className={btnBase} type="button">
        Digitar CPF e data de nascimento
      </button>
      <p className="mt-1 mb-3.5 rounded-lg bg-neutral-100 px-2.5 py-2 text-[0.68rem] text-neutral-500">
        Não precisa de senha. Seus dados clínicos não aparecem nesta tela.
      </p>
      <div className="flex gap-2 border-t border-neutral-200 pt-3">
        <span className="flex-1 rounded-lg border border-neutral-200 py-1.5 px-1 text-center text-[0.65rem] font-semibold text-neutral-700">
          Aumentar letra
        </span>
        <span className="flex-1 rounded-lg border border-neutral-200 py-1.5 px-1 text-center text-[0.65rem] font-semibold text-neutral-700">
          Ouvir a tela
        </span>
        <span className="flex-1 rounded-lg border border-neutral-200 py-1.5 px-1 text-center text-[0.65rem] font-semibold text-neutral-700">
          Ajuda
        </span>
      </div>
    </div>
  )
}

export function TrackingPreview() {
  return (
    <div className={deviceBase}>
      <div className="mb-1.5 flex items-center justify-between text-xs font-bold text-neutral-950">
        <span>#ENC-4821</span>
        <span className="rounded-full bg-yellow-200 px-[9px] py-[3px] text-[0.65rem] font-bold text-yellow-800">
          Urgente
        </span>
      </div>
      <p className="text-[0.7rem] font-medium text-neutral-500">UBS Vila União · Cardiologia</p>
      <h4 className="mt-2 mb-1 text-base text-neutral-950">Falta 1 passo: marcar sua consulta</h4>
      <div className="mt-2.5 mb-1 flex gap-1">
        <span className="h-[5px] flex-1 rounded-[3px] bg-green-500" />
        <span className="h-[5px] flex-1 rounded-[3px] bg-green-500" />
        <span className="h-[5px] flex-1 rounded-[3px] bg-blue-500" />
        <span className="h-[5px] flex-1 rounded-[3px] bg-neutral-200" />
      </div>
      <div className="mb-3.5 flex justify-between">
        <span className="flex-1 text-center text-[0.6rem] text-neutral-500">Recebido</span>
        <span className="flex-1 text-center text-[0.6rem] text-neutral-500">Triado</span>
        <span className="flex-1 text-center text-[0.6rem] text-neutral-500">Marcar horário</span>
        <span className="flex-1 text-center text-[0.6rem] text-neutral-500">Concluído</span>
      </div>
      <div className="mb-3 flex gap-1.5">
        <span className="flex-1 rounded-lg border border-neutral-200 bg-neutral-100 px-1 py-2 text-center text-[0.68rem] text-neutral-700">
          qua 20/08 · 08:30
        </span>
        <span className="flex-1 rounded-lg border border-green-500 bg-green-100 px-1 py-2 text-center text-[0.68rem] font-bold text-green-700">
          qui 21/08 · 14:00
        </span>
        <span className="flex-1 rounded-lg border border-neutral-200 bg-neutral-100 px-1 py-2 text-center text-[0.68rem] text-neutral-700">
          sex 22/08 · 10:15
        </span>
      </div>
      <button className={btnPrimary} type="button">
        Confirmar e imprimir comprovante
      </button>
      <button
        className="block w-full rounded-[10px] border-0 bg-transparent p-1 text-center text-[0.8rem] font-semibold text-blue-500"
        type="button"
      >
        Escolher outra especialidade ou remarcar
      </button>
    </div>
  )
}

export function PanelPreview() {
  return (
    <div className="w-full max-w-[320px] rounded-2xl border border-neutral-200 bg-green-900 p-5 shadow-[0_12px_32px_-20px_rgba(0,0,0,0.35)]">
      <p className="mb-2.5 text-[0.62rem] uppercase tracking-wide text-neutral-300">
        Próximas senhas
      </p>
      <div className="mb-4 flex gap-2">
        <span className="flex-1 rounded-lg bg-green-800 py-2 px-1.5 text-center text-[0.75rem] font-bold text-neutral-50">
          C 043
          <small className="mt-0.5 block text-[0.58rem] font-normal text-neutral-300">Sala 3</small>
        </span>
        <span className="flex-1 rounded-lg bg-green-800 py-2 px-1.5 text-center text-[0.75rem] font-bold text-neutral-50">
          A 118
          <small className="mt-0.5 block text-[0.58rem] font-normal text-neutral-300">
            Acolhimento
          </small>
        </span>
        <span className="flex-1 rounded-lg bg-green-800 py-2 px-1.5 text-center text-[0.75rem] font-bold text-neutral-50">
          C 044
          <small className="mt-0.5 block text-[0.58rem] font-normal text-neutral-300">Sala 3</small>
        </span>
      </div>
      <div className="rounded-xl bg-yellow-500 p-[18px] text-center text-neutral-950">
        <span className="mb-1 block text-[0.68rem] uppercase tracking-wide">É a sua vez</span>
        <strong className="block text-[2.4rem] leading-[1.15]">C 042</strong>
        <span>Maria A. S. · Sala 3 · Eletrocardiograma</span>
      </div>
    </div>
  )
}

export function StaffPreview() {
  const rows = [
    { patient: 'Maria A. Souza', step: 'Aguarda marcação', priority: 'Urgente' },
    { patient: 'João P. Ribeiro', step: 'Exame marcado · 21/08', priority: 'Eletiva' },
    { patient: 'Antônia L. Dias', step: 'Resultado pendente há 9 dias', priority: 'Urgente' },
  ]

  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-[0_12px_32px_-20px_rgba(0,0,0,0.35)]">
      <nav className="mb-3 flex gap-3.5 border-b border-neutral-200 pb-2.5 text-[0.68rem] font-semibold text-neutral-500">
        <span className="text-blue-500">Fila de encaminhamentos</span>
        <span>Agenda de exames</span>
        <span>Indicadores</span>
      </nav>
      <div className="mb-3 flex items-center justify-between text-[0.85rem] text-neutral-950">
        <strong>Cardiologia · 143 pessoas</strong>
        <span className="rounded-full bg-yellow-200 px-[9px] py-[3px] text-[0.65rem] font-bold text-yellow-800">
          Ação pendente · 31
        </span>
      </div>
      <div className="mb-3.5 flex gap-2">
        <div className="flex-1 rounded-lg bg-neutral-100 py-2 px-1 text-center">
          <strong className="block text-[0.85rem] text-neutral-950">27 dias</strong>
          <span className="text-[0.6rem] text-neutral-500">Espera média</span>
        </div>
        <div className="flex-1 rounded-lg bg-neutral-100 py-2 px-1 text-center">
          <strong className="block text-[0.85rem] text-neutral-950">31</strong>
          <span className="text-[0.6rem] text-neutral-500">Pendentes</span>
        </div>
        <div className="flex-1 rounded-lg bg-neutral-100 py-2 px-1 text-center">
          <strong className="block text-[0.85rem] text-neutral-950">58</strong>
          <span className="text-[0.6rem] text-neutral-500">Na semana</span>
        </div>
        <div className="flex-1 rounded-lg bg-neutral-100 py-2 px-1 text-center">
          <strong className="block text-[0.85rem] text-neutral-950">9%</strong>
          <span className="text-[0.6rem] text-neutral-500">Faltas</span>
        </div>
      </div>
      <table className="w-full border-collapse text-[0.7rem]">
        <thead>
          <tr>
            <th className="border-b border-neutral-200 py-1 px-1.5 text-left font-semibold text-neutral-500">
              Paciente
            </th>
            <th className="border-b border-neutral-200 py-1 px-1.5 text-left font-semibold text-neutral-500">
              Etapa atual
            </th>
            <th className="border-b border-neutral-200 py-1 px-1.5 text-left font-semibold text-neutral-500">
              Prioridade
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.patient}>
              <td className="border-b border-neutral-100 py-1.5 px-1.5 text-neutral-700">
                {row.patient}
              </td>
              <td className="border-b border-neutral-100 py-1.5 px-1.5 text-neutral-700">
                {row.step}
              </td>
              <td
                className={`border-b border-neutral-100 py-1.5 px-1.5 ${
                  row.priority === 'Urgente' ? 'font-bold text-red-700' : 'text-neutral-700'
                }`}
              >
                {row.priority}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
