import { Redirect } from "expo-router";
import React, { ReactNode } from "react";
import { ActivityIndicator, View } from "react-native";
import { useUser } from "@/context/UserContext";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useUser();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#9333ea" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Redirect href="/(tabs)" />;
  }

  if (!adminOnly && user?.role === "admin") {
    return <Redirect href="/admin" />;
  }

  return <>{children}</>;
}
