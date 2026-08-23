export function TotemPreview() {
  return (
    <div className="device device-totem">
      <div className="device-topbar">
        <span>Minha Vez</span>
        <span className="device-unit">UBS Vila União</span>
      </div>
      <h4 className="device-heading">Veja em que etapa está seu pedido</h4>
      <p className="device-caption">Consulta com especialista ou exame. É só encostar o cartão.</p>
      <button className="device-btn device-btn-primary" type="button">
        Encostar o Cartão SUS
      </button>
      <button className="device-btn" type="button">
        Digitar CPF e data de nascimento
      </button>
      <p className="device-disclaimer">
        Não precisa de senha. Seus dados clínicos não aparecem nesta tela.
      </p>
      <div className="device-a11y-row">
        <span>Aumentar letra</span>
        <span>Ouvir a tela</span>
        <span>Ajuda</span>
      </div>
    </div>
  )
}

export function TrackingPreview() {
  return (
    <div className="device device-tracking">
      <div className="device-topbar">
        <span>#ENC-4821</span>
        <span className="device-tag">Urgente</span>
      </div>
      <p className="device-unit">UBS Vila União · Cardiologia</p>
      <h4 className="device-heading">Falta 1 passo: marcar sua consulta</h4>
      <div className="device-steps">
        <span className="device-step device-step-done" />
        <span className="device-step device-step-done" />
        <span className="device-step device-step-current" />
        <span className="device-step" />
      </div>
      <div className="device-steps-labels">
        <span>Recebido</span>
        <span>Triado</span>
        <span>Marcar horário</span>
        <span>Concluído</span>
      </div>
      <div className="device-slots">
        <span>qua 20/08 · 08:30</span>
        <span className="device-slot-active">qui 21/08 · 14:00</span>
        <span>sex 22/08 · 10:15</span>
      </div>
      <button className="device-btn device-btn-primary" type="button">
        Confirmar e imprimir comprovante
      </button>
      <button className="device-btn device-btn-link" type="button">
        Escolher outra especialidade ou remarcar
      </button>
    </div>
  )
}

export function PanelPreview() {
  return (
    <div className="device device-panel">
      <p className="panel-label">Próximas senhas</p>
      <div className="panel-queue">
        <span>
          C 043
          <small>Sala 3</small>
        </span>
        <span>
          A 118
          <small>Acolhimento</small>
        </span>
        <span>
          C 044
          <small>Sala 3</small>
        </span>
      </div>
      <div className="panel-ticket">
        <span className="panel-ticket-label">É a sua vez</span>
        <strong>C 042</strong>
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
    <div className="device device-staff">
      <nav className="staff-nav">
        <span className="staff-nav-active">Fila de encaminhamentos</span>
        <span>Agenda de exames</span>
        <span>Indicadores</span>
      </nav>
      <div className="staff-header">
        <strong>Cardiologia · 143 pessoas</strong>
        <span className="device-tag">Ação pendente · 31</span>
      </div>
      <div className="staff-stats">
        <div>
          <strong>27 dias</strong>
          <span>Espera média</span>
        </div>
        <div>
          <strong>31</strong>
          <span>Pendentes</span>
        </div>
        <div>
          <strong>58</strong>
          <span>Na semana</span>
        </div>
        <div>
          <strong>9%</strong>
          <span>Faltas</span>
        </div>
      </div>
      <table className="staff-table">
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Etapa atual</th>
            <th>Prioridade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.patient}>
              <td>{row.patient}</td>
              <td>{row.step}</td>
              <td className={row.priority === 'Urgente' ? 'staff-priority-urgent' : undefined}>
                {row.priority}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
