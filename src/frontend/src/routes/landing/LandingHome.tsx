import {
  ArrowRight,
  Building2,
  EyeOff,
  FileQuestion,
  KeyRound,
  LockKeyhole,
  Monitor,
  MonitorSmartphone,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Tablet,
  Timer,
  TimerOff,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../components/Logo'
import { HOW_IT_WORKS } from '../../lib/howItWorks'
import { HeroPreview, PanelPreview, StaffPreview, TotemPreview, TrackingPreview } from './previews'

// Diagnóstico da Fase 1, com as mesmas fontes citadas naquela entrega
// (docs/enterprise-challenge/proposta-ia-ciencia-de-dados.md).
const problems: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: FileQuestion,
    title: 'O encaminhamento some de vista',
    text: 'Da UBS até a consulta com especialista, o pedido vira papel, ligação ou sistema paralelo. Quem espera não sabe em que pé está.',
  },
  {
    icon: Building2,
    title: 'Falta dado padronizado',
    text: 'Uma auditoria do TCU apontou a falta de alimentação padronizada de dados no sistema do Ministério da Saúde como gargalo de visibilidade.',
  },
  {
    icon: Timer,
    title: 'A espera custa saúde',
    text: 'Pesquisa do Instituto Locomotiva: 94% dos brasileiros da Classe C acham que a espera no SUS coloca vidas em risco, e cerca de 1 em cada 3 já desistiu de uma consulta demorada.',
  },
]

const channels: { eyebrow: string; title: string; text: string; to: string; link: string; preview: ReactNode }[] = [
  {
    eyebrow: 'Aplicativo do cidadão',
    title: 'Acompanhar, marcar e remarcar num só lugar',
    text: 'A pessoa vê cada etapa do encaminhamento, escolhe um horário livre da especialidade indicada quando a unidade libera e reagenda ou cancela sem ligar para a UBS.',
    to: '/acompanhar',
    link: 'Abrir o aplicativo',
    preview: <TrackingPreview />,
  },
  {
    eyebrow: 'Totem da UBS',
    title: 'Consulta em um minuto, sem senha',
    text: 'Cartão SUS ou CPF com data de nascimento, teclado na própria tela e botões de acessibilidade sempre à mão: aumentar letra, ouvir a tela em voz alta e ajuda passo a passo. Ao encerrar, nada fica guardado para a próxima pessoa.',
    to: '/totem',
    link: 'Abrir o totem',
    preview: <TotemPreview />,
  },
  {
    eyebrow: 'Painel da sala de espera',
    title: 'Amarelo só quando é a vez de alguém',
    text: 'A chamada aparece em tempo real. Só senha e sala: nenhum nome, protocolo ou dado clínico vai para a tela pública.',
    to: '/painel',
    link: 'Abrir o painel',
    preview: <PanelPreview />,
  },
  {
    eyebrow: 'Canal da equipe e do gestor',
    title: 'A fila da unidade, com o que falta fazer',
    text: 'Encaminhamentos por especialidade, ação pendente em destaque, espera média e taxa de faltas. Daqui a equipe libera agendamentos, chama senhas e registra faltas.',
    to: '/equipe',
    link: 'Abrir o canal da equipe',
    preview: <StaffPreview />,
  },
]

const privacy: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: EyeOff,
    title: 'Nenhum dado clínico na tela',
    text: 'Acompanhamento, totem e painel mostram etapa, horário e senha. Laudo, CID e diagnóstico não aparecem.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Totem sem rastro',
    text: 'A sessão do totem fica só na memória da tela. Encerrar apaga tudo, e nada é gravado no navegador.',
  },
  {
    icon: KeyRound,
    title: 'Senha protegida',
    text: 'A senha é guardada como hash com sal (PBKDF2), nunca em texto. Nem a equipe consegue lê-la.',
  },
  {
    icon: LockKeyhole,
    title: 'Cada canal no seu lugar',
    text: 'O acesso do cidadão não abre a fila da equipe, e a equipe só vê a própria unidade. O CPF não aparece na fila.',
  },
  {
    icon: ShieldAlert,
    title: 'Contra chute de senha',
    text: 'Depois de 5 tentativas erradas seguidas, o acesso daquela conta fica bloqueado por 5 minutos, inclusive no totem.',
  },
  {
    icon: TimerOff,
    title: 'Sessão que expira',
    text: 'O acesso vence depois de um tempo sem uso. O totem avisa e limpa a tela sozinho se a pessoa for embora sem encerrar.',
  },
  {
    icon: UserCog,
    title: 'Quem executa não encerra',
    text: 'O atendente libera, chama e registra falta; o gestor acompanha os indicadores e conclui o encaminhamento.',
  },
]

const colorSystem = [
  {
    name: 'Verde saúde',
    role: 'Paciente',
    swatchClass: 'bg-green-500',
    description: 'Cor principal da marca. Saúde sem imitar o azul institucional do SUS.',
  },
  {
    name: 'Azul gestão',
    role: 'Equipe',
    swatchClass: 'bg-blue-500',
    description: 'Canal web da equipe da UBS e do gestor. Tom institucional.',
  },
  {
    name: 'Amarelo senha',
    role: 'Chamada',
    swatchClass: 'bg-yellow-500',
    description: 'A chamada no painel e o que pede atenção. Quando aparece, alguém precisa agir.',
  },
]

const demoLogins = [
  { where: 'Equipe', path: '/equipe', login: 'atendente.centro', note: 'opera a fila' },
  { where: 'Equipe', path: '/equipe', login: 'gestor.centro', note: 'acompanha e conclui' },
  { where: 'Aplicativo', path: '/acompanhar', login: 'CPF 529.982.247-25', note: 'Maria, em triagem' },
  { where: 'Aplicativo', path: '/acompanhar', login: 'CPF 111.444.777-35', note: 'Carlos, já agendado' },
  { where: 'Totem', path: '/totem', login: 'Cartão SUS 100 0000 0006 0018', note: 'sem senha' },
]

// Atalhos para os quatro canais, logo abaixo do topo: cada público acha o
// seu sem precisar rolar a página.
const quickAccess: { icon: LucideIcon; title: string; text: string; to: string; tone: string }[] = [
  { icon: Smartphone, title: 'Aplicativo', text: 'Acompanhe e marque horário pelo celular.', to: '/acompanhar', tone: 'bg-green-100 text-green-700' },
  { icon: Tablet, title: 'Totem da UBS', text: 'Consulte a etapa sem senha, com acessibilidade.', to: '/totem', tone: 'bg-green-100 text-green-700' },
  { icon: Monitor, title: 'Painel da sala', text: 'Veja a senha chamada em tempo real.', to: '/painel', tone: 'bg-yellow-200 text-yellow-800' },
  { icon: Users, title: 'Equipe e gestor', text: 'Fila, ações pendentes e indicadores.', to: '/equipe', tone: 'bg-blue-100 text-blue-600' },
]

// Em ordem alfabética.
const team = [
  'Ana Larissa Cristo Mendes',
  'Brenda Cristina Martins Araújo',
  'João Pedro Thethê Andrade',
  'John Vitor Silverio Pereira',
  'Vinícius Cardoso Junqueira',
]

export default function LandingHome() {
  return (
    <div className="min-h-dvh bg-neutral-100">
      <header className="sticky top-0 z-40 border-b border-green-700 bg-green-800 text-neutral-50">
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-bold text-inherit no-underline">
            <Logo tone="light" />
            Minha Vez
          </Link>
          <nav aria-label="Seções" className="hidden items-center gap-5 text-sm text-green-100 lg:flex">
            <a href="#problema" className="hover:text-neutral-50">O problema</a>
            <a href="#como-funciona" className="hover:text-neutral-50">Como funciona</a>
            <a href="#canais" className="hover:text-neutral-50">Canais</a>
            <a href="#privacidade" className="hover:text-neutral-50">Privacidade</a>
            <a href="#demonstracao" className="hover:text-neutral-50">Demonstração</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/totem"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-50 no-underline hover:bg-green-700 sm:flex"
            >
              <Tablet aria-hidden="true" className="size-4" />
              Totem
            </Link>
            <Link
              to="/equipe"
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-neutral-50 no-underline hover:bg-green-700 md:flex"
            >
              <Users aria-hidden="true" className="size-4" />
              Sou da equipe
            </Link>
            <Link
              to="/acompanhar"
              className="rounded-lg bg-neutral-50 px-3 py-2 text-sm font-semibold text-green-800 no-underline hover:bg-green-100"
            >
              Acompanhar
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-green-800 text-neutral-50">
        <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-center gap-10 px-4 pt-10 pb-16 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:pt-16 md:pb-28">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-700 px-3 py-1 text-sm text-green-100">
              <span className="size-2 rounded-full bg-yellow-500" /> Atenção primária · SUS
            </p>
            <h1 className="text-[clamp(2rem,3.5vw+1rem,3.25rem)] leading-[1.08] font-extrabold tracking-tight">
              Saiba em que etapa está sua consulta com especialista.
            </h1>
            <p className="mt-4 max-w-[520px] text-lg text-green-100">
              Acompanhe o encaminhamento da UBS, escolha um horário livre quando a unidade liberar e veja sua senha
              no painel. Sem ligar e sem ir até lá só para perguntar.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/acompanhar"
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-5 py-3 font-bold text-neutral-950 no-underline hover:bg-yellow-400"
              >
                Acompanhar meu encaminhamento
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                to="/totem"
                className="inline-flex items-center gap-2 rounded-xl border border-green-500 px-5 py-3 font-semibold text-neutral-50 no-underline hover:bg-green-700"
              >
                <Tablet aria-hidden="true" className="size-4" />
                Usar o totem da UBS
              </Link>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[460px] [&_figcaption]:text-green-200">
            <HeroPreview />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1080px] px-4">
        <nav aria-label="Acesso rápido" className="relative z-10 -mt-12 grid grid-cols-2 gap-3 md:-mt-16 md:grid-cols-4">
          {quickAccess.map(({ icon: Icon, title, text, to, tone }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-inherit no-underline shadow-[0_12px_32px_-20px_rgba(0,0,0,0.35)] transition-colors hover:border-green-400"
            >
              <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}>
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <span className="flex items-center gap-1 font-bold text-neutral-950">
                {title}
                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
              <span className="text-sm text-neutral-600">{text}</span>
            </Link>
          ))}
        </nav>

        <Section id="problema" eyebrow="O problema" title="Quem espera não sabe em que pé está o pedido">
          <div className="grid gap-4 md:grid-cols-3">
            {problems.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-red-100 text-red-700">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="font-bold text-neutral-950">{title}</h3>
                <p className="mt-1 text-sm text-neutral-700">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-neutral-500">
            Fontes: auditoria do TCU e pesquisa do Instituto Locomotiva, citadas na documentação da Fase 1 do projeto.
          </p>
        </Section>

        <Section id="como-funciona" eyebrow="Como funciona" title="Quatro passos, todos visíveis">
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="relative rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <span className="absolute top-4 right-4 text-3xl font-extrabold text-neutral-200">{index + 1}</span>
                <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="font-bold text-neutral-950">{title}</h3>
                <p className="mt-1 text-sm text-neutral-700">{text}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="canais" eyebrow="Canais" title="Uma informação, quatro telas">
          <div className="flex flex-col gap-16">
            {channels.map((channel, index) => (
              <div
                key={channel.eyebrow}
                className={`grid grid-cols-1 items-center gap-8 md:grid-cols-2 ${index % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}
              >
                <div>
                  <p className="mb-2 text-xs font-bold tracking-wide text-green-700 uppercase">{channel.eyebrow}</p>
                  <h3 className="text-2xl font-bold text-neutral-950">{channel.title}</h3>
                  <p className="mt-2 text-neutral-700">{channel.text}</p>
                  <Link
                    to={channel.to}
                    className="mt-4 inline-flex items-center gap-1.5 font-semibold text-blue-500 no-underline hover:underline"
                  >
                    {channel.link}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
                <div className="mx-auto w-full max-w-[480px]">{channel.preview}</div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="privacidade" eyebrow="Privacidade e segurança" title="Pensado para um serviço público de saúde">
          <div className="grid gap-4 sm:grid-cols-2">
            {privacy.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="font-bold text-neutral-950">{title}</h3>
                  <p className="mt-1 text-sm text-neutral-700">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section id="cores" eyebrow="Identidade" title="Cor com significado">
          <p className="mb-6 max-w-[640px] text-neutral-700">
            Cada cor diz para quem é a tela. Quem está na sala de espera sabe que o amarelo é a chamada, e a equipe
            reconhece o próprio canal pelo azul.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {colorSystem.map((color) => (
              <div key={color.name} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <span aria-hidden="true" className={`mb-3 block h-12 rounded-xl ${color.swatchClass}`} />
                <p className="font-bold">{color.name}</p>
                <p className="text-sm font-semibold text-neutral-500">{color.role}</p>
                <p className="mt-2 text-sm text-neutral-700">{color.description}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="demonstracao" eyebrow="Demonstração" title="Experimente com os dados de exemplo">
          <div className="grid grid-cols-1 gap-6 rounded-3xl border border-yellow-300 bg-yellow-100 p-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <div>
              <p className="mb-4 flex items-start gap-2 text-sm text-yellow-900">
                <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <span>
                  Dados sintéticos, criados toda vez que o servidor sobe. Nenhum é de paciente real. A senha de todos
                  é <code className="rounded bg-white px-1.5 font-mono">minhavez</code>.
                </span>
              </p>
              <ul className="divide-y divide-yellow-300 overflow-hidden rounded-2xl border border-yellow-300 bg-white">
                {demoLogins.map((demo) => (
                  <li key={demo.login} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                    <div>
                      <p className="font-mono text-sm text-neutral-950">{demo.login}</p>
                      <p className="text-xs text-neutral-500">{demo.note}</p>
                    </div>
                    <Link to={demo.path} className="text-sm font-semibold text-blue-500 no-underline hover:underline">
                      {demo.where} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-neutral-950">Roteiro sugerido</h3>
              <ol className="mt-3 flex flex-col gap-2 text-sm text-neutral-800">
                <li><strong>1.</strong> Abra o <Link to="/painel" className="text-blue-500">painel</Link> numa aba à parte.</li>
                <li><strong>2.</strong> Na equipe, libere o agendamento da Maria.</li>
                <li><strong>3.</strong> No aplicativo, entre como Maria e escolha um horário.</li>
                <li><strong>4.</strong> Na equipe, chame a senha. O painel muda na hora.</li>
                <li><strong>5.</strong> No totem, consulte pelo Cartão SUS e encerre.</li>
              </ol>
            </div>
          </div>
        </Section>
      </main>

      <footer className="mt-8 bg-neutral-900 text-neutral-300">
        <div className="mx-auto grid max-w-[1080px] gap-8 px-4 py-10 md:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 font-bold text-neutral-50">
              <Logo tone="light" />
              Minha Vez
            </p>
            <p className="mt-2 text-sm">
              Protótipo acadêmico do HackGov, projeto de transformação digital da gestão pública da FIAP. Não é um
              serviço oficial do SUS.
            </p>
          </div>
          <div>
            <p className="font-semibold text-neutral-50">Grupo 1 · Dream Team</p>
            <ul className="mt-2 flex flex-col gap-0.5 text-sm">
              {team.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 py-14">
      <p className="mb-2 text-xs font-bold tracking-wide text-green-700 uppercase">{eyebrow}</p>
      <h2 className="mb-6 text-[clamp(1.5rem,1.5vw+1rem,2rem)] font-bold text-neutral-950">{title}</h2>
      {children}
    </section>
  )
}
