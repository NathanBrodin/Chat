export const themes = [
  {
    name: "stone",
    label: "Stone",
    activeColor: {
      light: "25 5.3% 44.7%",
      dark: "33.3 5.5% 32.4%",
    },
  },
  {
    name: "midnight",
    label: "Midnight",
    activeColor: {
      light: "220.47 98.26% 36.08%",
      dark: "0 0% 82.75%",
    },
  },
  {
    name: "vesper",
    label: "Vesper",
    activeColor: {
      light: "252 11% 35%",
      dark: "27.06 100% 80%",
    },
  },
] as const;

export type Theme = (typeof themes)[number];
