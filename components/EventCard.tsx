import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const heroFallback = require("@/assets/images/events-hero.jpg");

interface EventCardProps {
  id: string;
  title: string;
  location: string;
  img?: string;
  time?: string;
  date: string;
  categories: string[];
  description: string;
  containerStyle?: object;
}

export default function EventCard({
  id,
  title,
  location,
  img,
  date,
  categories,
  description,
  containerStyle,
}: EventCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, containerStyle]}
      activeOpacity={0.85}
      onPress={() => router.push(`/event/${id}`)}
    >
      <Image
        source={img ? { uri: img } : heroFallback}
        style={styles.image}
        contentFit="cover"
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.location}>{location}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
        <Text style={styles.date}>{new Date(date).toLocaleString()}</Text>
        {categories.length > 0 && (
          <View style={styles.categoriesRow}>
            {categories.map((cat, idx) => (
              <View key={idx} style={styles.categoryPill}>
                <Text style={styles.categoryText}>{cat}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 140,
  },
  body: {
    backgroundColor: "rgba(216,180,254,0.35)",
    padding: 12,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1f1147",
  },
  location: {
    fontSize: 12,
    color: "rgba(0,0,0,0.5)",
  },
  description: {
    fontSize: 12,
    color: "#333",
  },
  date: {
    fontSize: 11,
    color: "#444",
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  categoryPill: {
    backgroundColor: "#a855f7",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
