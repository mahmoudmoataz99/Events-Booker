import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AdminEvent, Category } from "./types";

interface EventFormProps {
  eventForm: AdminEvent;
  categories: Category[];
  onChange: (field: keyof AdminEvent, value: string) => void;
  onToggleCategory: (name: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isEditing: boolean;
}

export default function EventForm({
  eventForm,
  categories,
  onChange,
  onToggleCategory,
  onSubmit,
  onReset,
  isEditing,
}: EventFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {isEditing ? "Edit Event" : "Create New Event"}
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Event Name</Text>
        <TextInput
          style={styles.input}
          value={eventForm.name}
          onChangeText={(v) => onChange("name", v)}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={eventForm.description}
          onChangeText={(v) => onChange("description", v)}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Categories</Text>
        <View style={styles.chipsRow}>
          {categories.map((category) => {
            const selected = eventForm.categories.includes(category.name);
            return (
              <TouchableOpacity
                key={category._id}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => onToggleCategory(category.name)}
              >
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.field, styles.flex1]}>
          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input}
            value={eventForm.date}
            onChangeText={(v) => onChange("date", v)}
            placeholder="2026-08-15"
          />
        </View>
        <View style={[styles.field, styles.flex1]}>
          <Text style={styles.label}>Time (HH:MM)</Text>
          <TextInput
            style={styles.input}
            value={eventForm.time}
            onChangeText={(v) => onChange("time", v)}
            placeholder="19:30"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={eventForm.location}
          onChangeText={(v) => onChange("location", v)}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.field, styles.flex1]}>
          <Text style={styles.label}>Price ($)</Text>
          <TextInput
            style={styles.input}
            value={eventForm.price}
            onChangeText={(v) => onChange("price", v.replace(/[^0-9.]/g, ""))}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={[styles.field, styles.flex1]}>
          <Text style={styles.label}>Available Seats</Text>
          <TextInput
            style={styles.input}
            value={eventForm.availableSeats}
            onChangeText={(v) => onChange("availableSeats", v.replace(/[^0-9]/g, ""))}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Image URL</Text>
        <TextInput
          style={styles.input}
          value={eventForm.image}
          onChangeText={(v) => onChange("image", v)}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitButtonText}>
            {isEditing ? "Update Event" : "Create Event"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
    gap: 14,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
  },
  field: {
    gap: 6,
  },
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipSelected: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  chipText: {
    fontSize: 13,
    color: "#374151",
  },
  chipTextSelected: {
    color: "#fff",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 8,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#1f2937",
    fontWeight: "600",
  },
});
