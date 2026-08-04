import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style={{padding:20}} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="login"
          options={{ headerShown: true, title: "Login", presentation: "modal" }}
        />
        <Stack.Screen
          name="register"
          options={{ headerShown: true, title: "Register", presentation: "modal" }}
        />
        <Stack.Screen
          name="event/[id]"
          options={{ headerShown: true, title: "Event Details" }}
        />
        <Stack.Screen
          name="search"
          options={{ headerShown: true, title: "Search Results" }}
        />
        <Stack.Screen
          name="admin/index"
          options={{ headerShown: true, title: "Admin Dashboard" }}
        />
      </Stack>
    </UserProvider>
  );
}
