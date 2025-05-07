import { DefaultTheme } from "react-native-paper";

export const theme = {
  ...DefaultTheme,
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    primary: "blue",
    // Important
    // onSurfaceVariant: "#000f00",
    secondary: "green",
    accent: "#f1c40f",
    background: "#FFFFFF",
    surface: "#f8f9fa",
    // text: "blue",
  },
  // fonts: {
  //   ...DefaultTheme.fonts,
  //   medium: { fontFamily: "Roboto-Medium", fontWeight: "500" },
  // },
};
