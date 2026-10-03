export type Person = "kid" | "grandpa";

export type OrangeState = {
  gifts: Person[];
};

export const EMPTY_ORANGE: OrangeState = { gifts: [] };

const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six"] as const;
const SLICE_WORDS = ["one", "two", "three", "four", "five", "six"] as const;

export function kidCount(state: OrangeState): number {
  return state.gifts.filter((gift) => gift === "kid").length;
}

export function grandpaCount(state: OrangeState): number {
  return state.gifts.filter((gift) => gift === "grandpa").length;
}

export function kidLine(state: OrangeState): string {
  return `Kid has ${COUNT_WORDS[kidCount(state)]}.`;
}

export function grandpaLine(state: OrangeState): string {
  return `Grandpa has ${COUNT_WORDS[grandpaCount(state)]}.`;
}

export function sliceLabel(state: OrangeState): string {
  if (state.gifts.length >= 6) return "Done";
  return `Slice ${SLICE_WORDS[state.gifts.length]}.`;
}

export function shareLine(state: OrangeState): string {
  const kid = kidCount(state);
  const grandpa = grandpaCount(state);
  if (state.gifts.length >= 6 && kid === grandpa) return "All shared.";
  if (kid === grandpa) return "Even so far.";
  if (kid > grandpa) return "Kid has more.";
  return "Grandpa has more.";
}

export function hasProgress(state: OrangeState): boolean {
  return state.gifts.length > 0;
}

export function parseOrange(raw: string | null): OrangeState {
  if (!raw) return EMPTY_ORANGE;
  try {
    const value = JSON.parse(raw) as { gifts?: unknown };
    if (!Array.isArray(value.gifts) || value.gifts.length > 6) return EMPTY_ORANGE;
    const gifts: Person[] = [];
    for (const gift of value.gifts) {
      if (gift !== "kid" && gift !== "grandpa") return EMPTY_ORANGE;
      gifts.push(gift);
    }
    return { gifts };
  } catch {
    return EMPTY_ORANGE;
  }
}

export function give(state: OrangeState, person: Person): { state: OrangeState; note: string } {
  if (state.gifts.length >= 6) return { state, note: "All given." };
  return { state: { gifts: [...state.gifts, person] }, note: "Slice given." };
}

export function takeBack(state: OrangeState): { state: OrangeState; note: string } {
  if (state.gifts.length === 0) return { state, note: "First slice." };
  return { state: { gifts: state.gifts.slice(0, -1) }, note: "Slice returned." };
}

export function resetOrange(): { state: OrangeState; note: string } {
  return { state: EMPTY_ORANGE, note: "Look at the orange." };
}
