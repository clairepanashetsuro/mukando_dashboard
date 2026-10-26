export const ILLUSTRATIONS = {
  climb: { src: "/illustrations/climb.svg", width: 800, height: 1000 },
  circleOfHands: {
    src: "/illustrations/circle-of-hands.svg",
    width: 800,
    height: 600,
  },
  gathering: { src: "/illustrations/gathering.svg", width: 800, height: 500 },
  growth: { src: "/illustrations/growth.svg", width: 800, height: 500 },
} as const;

export type IllustrationKey = keyof typeof ILLUSTRATIONS;
