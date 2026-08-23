import { Link } from 'react-router-dom'
import Logo from '../../components/Logo'
import { PanelPreview, StaffPreview, TotemPreview, TrackingPreview } from './previews'
import './landing.css'
import './previews.css'

const colorSystem = [
  {
    name: 'Verde saúde',
    role: 'Paciente',
    hex: '#1E8E63',
    description: 'Cor principal da marca. Saúde sem imitar o azul institucional do SUS.',
  },
  {
    name: 'Azul gestão',
    role: 'Equipe',
    hex: '#1D5FA8',
    description: 'Canal web da equipe da UBS e do gestor. Tom institucional.',
  },
  {
    name: 'Amarelo senha',
    role: 'Chamada',
    hex: '#F5B700',
    description: 'Exclusivo da senha e da chamada no painel. Só aparece quando é a vez de alguém.',
  },
]

const features = [
  {
    eyebrow: 'Totem da UBS',
    title: 'Identificação em um toque',
    description:
      'Cartão SUS encostado ou CPF digitado, sem senha e sem dado clínico exposto na tela. Aumentar letra, ouvir a tela e ajuda em qualquer etapa.',
    to: '/totem',
    linkLabel: 'Ver o totem',
    Preview: TotemPreview,
  },
  {
    eyebrow: 'Minha Vez',
    title: 'Marcar, acompanhar e remarcar, num só lugar',
    description:
      'O paciente escolhe a especialidade, marca o horário, acompanha cada etapa do encaminhamento e remarca quando precisa — sem ligar pra UBS.',
    to: '/acompanhar',
    linkLabel: 'Ver o acompanhamento',
    Preview: TrackingPreview,
  },
  {
    eyebrow: 'Painel da sala de espera',
    title: 'Amarelo só quando é a sua vez',
    description:
      'Chamada de senha em tempo real na sala de espera. Cor com semântica, não decoração — nenhum dado clínico é exibido publicamente.',
    to: '/painel',
    linkLabel: 'Ver o painel',
    Preview: PanelPreview,
  },
  {
    eyebrow: 'Canal web',
    title: 'Equipe da UBS e gestor',
    description:
      'Fila por especialidade, ação pendente por protocolo e indicadores de espera reunidos num painel só, para quem toca o dia a dia da UBS.',
    to: '/equipe',
    linkLabel: 'Ver o canal da equipe',
    Preview: StaffPreview,
  },
]

export default function LandingHome() {
  return (
    <main className="landing">
      <header className="landing-nav">
        <div className="landing-brand">
          <Logo />
          <span>Minha Vez</span>
        </div>
        <Link to="/acompanhar" className="landing-nav-cta">
          Acompanhar solicitação
        </Link>
      </header>

      <section className="landing-hero">
        <h1>Marque, acompanhe e remarque sua consulta sem ligar, sem ir até a UBS.</h1>
        <p>
          Escolha a especialidade, veja os horários disponíveis e acompanhe cada etapa do
          encaminhamento até o resultado do exame.
        </p>
        <div className="landing-hero-actions">
          <Link to="/acompanhar" className="landing-button landing-button-primary">
            Acompanhar uma solicitação
          </Link>
          <Link to="/totem" className="landing-button">
            Ver o totem da UBS
          </Link>
        </div>
      </section>

      <section className="landing-section">
        <h2>O que o MVP entrega</h2>
        <div className="landing-features">
          {features.map((feature, index) => (
            <div
              className={`feature${index % 2 === 1 ? ' feature-reverse' : ''}`}
              key={feature.eyebrow}
            >
              <div className="feature-text">
                <span className="feature-eyebrow">{feature.eyebrow}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <Link className="feature-link" to={feature.to}>
                  {feature.linkLabel} →
                </Link>
              </div>
              <div className="feature-visual">
                <feature.Preview />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <h2>Três cores, três funções</h2>
        <div className="landing-grid landing-grid-3">
          {colorSystem.map((color) => (
            <div className="landing-card" key={color.name}>
              <span className="landing-swatch" style={{ background: color.hex }} />
              <h3>{color.name}</h3>
              <p className="landing-card-role">{color.role}</p>
              <p>{color.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
