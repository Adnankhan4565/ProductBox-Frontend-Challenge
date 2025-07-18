import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
  },
};

const DarkTheme_Custom = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? DarkTheme_Custom : LightTheme}
    >
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "RandoStore",
            headerStyle: {
              backgroundColor:
                colorScheme === "dark"
                  ? Colors.dark.background
                  : Colors.light.background,
            },
            headerTintColor:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
          }}
        />
        <Stack.Screen
          name="cart"
          options={{
            title: "Shopping Cart",
            presentation: "modal",
            headerStyle: {
              backgroundColor:
                colorScheme === "dark"
                  ? Colors.dark.background
                  : Colors.light.background,
            },
            headerTintColor:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
          }}
        />
        <Stack.Screen
          name="add-item"
          options={{
            title: "Add New Item",
            headerStyle: {
              backgroundColor:
                colorScheme === "dark"
                  ? Colors.dark.background
                  : Colors.light.background,
            },
            headerTintColor:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            title: "Checkout",
            headerStyle: {
              backgroundColor:
                colorScheme === "dark"
                  ? Colors.dark.background
                  : Colors.light.background,
            },
            headerTintColor:
              colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
          }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
