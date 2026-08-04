import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Contact() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Contact Us</Text>

      <View style={styles.infoBlock}>
        <Text style={styles.subheading}>About EventBook</Text>
        <Text style={styles.paragraph}>
          EventBook is your go-to platform for discovering, booking, and
          managing events with ease. From concerts and festivals to workshops
          and networking events, we make sure you never miss out.
        </Text>
        <Text style={styles.paragraph}>
          Our mission is to connect people through meaningful experiences and
          empower event organizers with the tools they need to succeed.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.subheading}>Get in Touch</Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Email: </Text>support@eventbook.com
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Phone: </Text>+1 (800) 123-4567
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Address: </Text>123 Event Street,
          Cityville, USA
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.label}>Support Hours: </Text>Mon–Fri, 9:00 AM –
          6:00 PM
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    gap: 24,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f1147",
  },
  infoBlock: {
    gap: 12,
  },
  subheading: {
    fontSize: 19,
    fontWeight: "600",
    color: "#1f1147",
  },
  paragraph: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    padding: 20,
    gap: 8,
  },
  detail: {
    fontSize: 15,
    color: "#374151",
  },
  label: {
    fontWeight: "600",
    color: "#111",
  },
});
