export const themes = [
  {
    name: "midnight",
    label: "Midnight",
    activeColor: {
      light: "220.47 98.26% 36.08%",
      dark: "225.45 71.22% 72.75%",
    },
  },
  {
    name: "stone",
    label: "Stone",
    activeColor: {
      light: "24 9.8% 10%",
      dark: "60 9.1% 97.8%",
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
  {
    name: "forest",
    label: "Forest",
    activeColor: {
      light: "137 45% 65%",
      dark: "137 45% 65%",
    },
  },
  {
    name: "coffee",
    label: "Coffee",
    activeColor: {
      light: "16.27 21.6% 32.26%",
      dark: "29.51 100% 88.04%",
    },
  },
  {
    name: "club",
    label: "Club",
    activeColor: {
      light: "0 51.85% 57.65%",
      dark: "243 46% 19%",
    },
  },
] as const

export type Theme = (typeof themes)[number]
