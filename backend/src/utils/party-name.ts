import type { PartyCode } from "../../prisma/generated/enums";


const partyNames: Record<`${PartyCode}`, string> = {
  C: "Conservative",
  L: "Labour",
  UKIP: "UK Independence Party",
  LD: "Liberal Democrat",
  G: "Green",
  IND: "Independent",
  SNP: "Scottish National Party",
};

export const getPartyName = (partyCode: `${PartyCode}`) => {
  const code = partyCode.toUpperCase() as `${PartyCode}`;
  return partyNames[code] ?? code;
};

