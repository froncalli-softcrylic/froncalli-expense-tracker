import { Stack } from "expo-router";
import React from "react";
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  return (
    <SafeScreen>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeScreen>
  );
}
