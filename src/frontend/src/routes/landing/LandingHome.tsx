import { Link } from "react-router-dom";
import Logo from "../../components/Logo";
import {
  PanelPreview,
  StaffPreview,
  TotemPreview,
  TrackingPreview,
} from "./previews";

const colorSystem = [
  {
    name: "Verde saúde",
    role: "Paciente",
    swatchClass: "bg-green-500",
    description:
      "Cor principal da marca. Saúde sem imitar o azul institucional do SUS.",
  },
  {
    name: "Azul gestão",
    role: "Equipe",
    swatchClass: "bg-blue-500",
    description: "Canal web da equipe da UBS e do gestor. Tom institucional.",
  },
  {
    name: "Amarelo senha",
    role: "Chamada",
    swatchClass: "bg-yellow-500",
    description:
      "Exclusivo da senha e da chamada no painel. Só aparece quando é a vez de alguém.",
  },
];

const features = [
  {
    eyebrow: "Totem da UBS",
    title: "Identificação em um toque",
    description:
      "Cartão SUS encostado ou CPF digitado, sem senha e sem dado clínico exposto na tela. Aumentar letra, ouvir a tela e ajuda em qualquer etapa.",
    to: "/totem",
    linkLabel: "Ver o totem",
    Preview: TotemPreview,
  },
  {
    eyebrow: "Minha Vez",
    title: "Marcar, acompanhar e remarcar, num só lugar",
    description:
      "O paciente escolhe a especialidade, marca o horário, acompanha cada etapa do encaminhamento e remarca quando precisa — sem ligar pra UBS.",
    to: "/acompanhar",
    linkLabel: "Ver o acompanhamento",
    Preview: TrackingPreview,
  },
  {
    eyebrow: "Painel da sala de espera",
    title: "Amarelo só quando é a sua vez",
    description:
      "Chamada de senha em tempo real na sala de espera. Cor com semântica, não decoração — nenhum dado clínico é exibido publicamente.",
    to: "/painel",
    linkLabel: "Ver o painel",
    Preview: PanelPreview,
  },
  {
    eyebrow: "Canal web",
    title: "Equipe da UBS e gestor",
    description:
      "Fila por especialidade, ação pendente por protocolo e indicadores de espera reunidos num painel só, para quem toca o dia a dia da UBS.",
    to: "/equipe",
    linkLabel: "Ver o canal da equipe",
    Preview: StaffPreview,
  },
];

export default function LandingHome() {
  return (
    <main className="mx-auto max-w-[1080px] p-6">
      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2 text-lg font-bold">
          <Logo />
          <span>Minha Vez</span>
        </div>
        <Link
          to="/acompanhar"
          className="font-semibold text-green-500 no-underline"
        >
          Acompanhar solicitação
        </Link>
      </header>

      <section className="py-16 text-center">
        <h1 className="mx-auto mb-4 max-w-[720px] text-[clamp(1.75rem,3vw+1rem,2.75rem)] leading-[1.15] font-extrabold">
          Marque, acompanhe e receba seu atendimento com todas as etapas
          visíveis, do primeiro passo ao resultado.
        </h1>
        <p className="mx-auto max-w-[560px] text-neutral-700">
          Escolha a especialidade, veja os horários disponíveis e acompanhe cada
          etapa do encaminhamento até o resultado do exame.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/acompanhar"
            className="rounded-lg border border-green-500 bg-green-500 px-5 py-3 font-semibold text-neutral-50 no-underline"
          >
            Acompanhar uma solicitação
          </Link>
          <Link
            to="/totem"
            className="rounded-lg border border-neutral-300 px-5 py-3 font-semibold text-neutral-950 no-underline"
          >
            Ver o totem da UBS
          </Link>
        </div>
      </section>

      <section className="py-12">
        <h2 className="mb-6 text-2xl font-bold">O que o Minha Vez entrega</h2>
        <div className="flex flex-col gap-14">
          {features.map((feature, index) => (
            <div
              className={`flex flex-col items-center gap-10 md:flex-row ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
              key={feature.eyebrow}
            >
              <div className="min-w-[260px] flex-1">
                <span className="mb-2 inline-block text-xs font-bold uppercase tracking-wide text-green-500">
                  {feature.eyebrow}
                </span>
                <h3 className="mb-2.5 text-2xl">{feature.title}</h3>
                <p className="mb-3.5 text-neutral-700">
                  {feature.description}
                </p>
                <Link
                  className="font-semibold text-blue-500 no-underline"
                  to={feature.to}
                >
                  {feature.linkLabel} →
                </Link>
              </div>
              <div className="flex min-w-[280px] flex-1 justify-center">
                <feature.Preview />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12">
        <h2 className="mb-6 text-2xl font-bold">Três cores, três funções</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {colorSystem.map((color) => (
            <div
              className="rounded-xl border border-neutral-200 bg-neutral-50 p-5"
              key={color.name}
            >
              <span className={`mb-3 block h-10 w-full rounded-lg ${color.swatchClass}`} />
              <h3 className="mb-2">{color.name}</h3>
              <p className="mb-2 text-xs tracking-wide text-neutral-500 uppercase">
                {color.role}
              </p>
              <p className="text-neutral-700">
                {color.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
