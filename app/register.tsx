import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "@/lib/api";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setSubmitted(true);

    if (name && isValidEmail(email) && password.length >= 6) {
      try {
        setLoading(true);
        await api.post("/users/register", {
          name,
          email,
          password,
          role: "user",
        });
        Alert.alert("Success", "Registration successful!", [
          { text: "OK", onPress: () => router.push("/login") },
        ]);
      } catch (err: any) {
        Alert.alert(
          "Registration failed",
          err.response?.data?.message || "Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.heading}>Register</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, submitted && !name && styles.inputError]}
              value={name}
              onChangeText={setName}
            />
            {submitted && !name && (
              <Text style={styles.errorText}>Name is required</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                submitted && !isValidEmail(email) && styles.inputError,
              ]}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {submitted && !isValidEmail(email) && (
              <Text style={styles.errorText}>Email is not correct</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                submitted && password.length < 6 && styles.inputWarning,
              ]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {submitted && password.length < 6 && (
              <Text style={styles.errorText}>
                Password must be at least 6 characters
              </Text>
            )}
          </View>

          <View style={styles.loginRow}>
            <Text>Already Have An Account? </Text>
            <Link href="/login" style={styles.loginLink}>
              Login
            </Link>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
    backgroundColor: "#fff",
  },
  card: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 24,
    gap: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 16,
  },
  input: {
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  inputError: {
    backgroundColor: "#fecaca",
  },
  inputWarning: {
    backgroundColor: "#e9d5ff",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 13,
  },
  loginRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  loginLink: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});
