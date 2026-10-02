import { staticFile } from "remotion";

export type SpeakerId = "john" | "larissa" | "joao" | "vinicius" | "brenda";

export type Speaker = {
  /** Full name, as it must appear in Parte 1 of the deliverable. */
  name: string;
  /** Short form used on the speaker card so the lower third stays compact. */
  short: string;
  /** FIAP registration number. Empty string renders the card without the line. */
  rm: string;
  /** File under public/fotos/. Missing file falls back to the initials avatar. */
  photo: string | null;
};

// Photos live in public/fotos/ (132x132, already cropped to the face). A `null`
// photo falls back to an initials avatar in the project palette, so the video
// still renders if a file goes missing.
export const SPEAKERS: Record<SpeakerId, Speaker> = {
  john: {
    name: "John Vitor Silverio Pereira",
    short: "John Vitor",
    rm: "566968",
    photo: "john-profile.png",
  },
  larissa: {
    name: "Ana Larissa Cristo Mendes",
    short: "Ana Larissa",
    rm: "567403",
    photo: "larissa-profile.png",
  },
  joao: {
    name: "João Pedro Thethê Andrade",
    short: "João Pedro",
    rm: "568305",
    photo: "joao-profile.png",
  },
  vinicius: {
    name: "Vinícius Cardoso Junqueira",
    short: "Vinícius Cardoso",
    rm: "566906",
    photo: "vinicius-profile.png",
  },
  brenda: {
    name: "Brenda Cristina Martins Araújo",
    short: "Brenda Araújo",
    rm: "575032",
    photo: "brenda-profile.png",
  },
};

/** Order used by the team strip on the cover and closing slides. */
export const TEAM_ORDER: SpeakerId[] = ["john", "larissa", "joao", "vinicius", "brenda"];

export const photoSrc = (speaker: Speaker): string | null =>
  speaker.photo ? staticFile(`fotos/${speaker.photo}`) : null;

export const initials = (speaker: Speaker): string =>
  speaker.short
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
