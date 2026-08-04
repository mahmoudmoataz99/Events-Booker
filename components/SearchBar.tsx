import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  placeholder?: string;
  /** When true, submitting navigates to the /search screen instead of just filtering locally */
  navigateOnSubmit?: boolean;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  placeholder = "Search events...",
  navigateOnSubmit = false,
}: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState("");
  const isControlled = searchTerm !== undefined && !!setSearchTerm;
  const value = isControlled ? searchTerm : localQuery;
  const onChangeText = isControlled ? setSearchTerm! : setLocalQuery;

  const handleSubmit = () => {
    if (navigateOnSubmit && value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#888"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Feather name="search" size={20} color="#6b21a8" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
  },
  button: {
    padding: 8,
  },
});
