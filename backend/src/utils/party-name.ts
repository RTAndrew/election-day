import type { PartyCode } from "../../prisma/generated/enums";

const partyNames: Record<`${PartyCode}`, string> = {
  PSD: "Partido Social Democrata",
  PS: "Partido Socialista",
  IL: "Iniciativa Liberal",
  CH: "Chega",
  PAN: "Pessoas–Animais–Natureza",
  L: "Livre",
  BE: "Bloco de Esquerda",
};

export const getPartyName = (partyCode: `${PartyCode}`) => {
  const code = partyCode.toUpperCase() as `${PartyCode}`;
  return partyNames[code] ?? code;
};
