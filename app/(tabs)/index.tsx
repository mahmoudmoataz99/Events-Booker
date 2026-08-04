import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "@/components/Carousel";
import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import api, { EventItem } from "@/lib/api";

const heroImage = require("@/assets/images/events-hero.jpg");

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<EventItem[]>("/events");
      setEvents(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to load events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#9333ea" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getEvents}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={getEvents} />
      }
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Image source={heroImage} style={styles.heroImage} contentFit="cover" />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>
            Discover the Latest & Hottest Events
          </Text>
          <Text style={styles.heroSubtitle}>
            Book tickets, explore experiences, and never miss out on
            unforgettable moments.
          </Text>
          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => router.push("/(tabs)/events")}
          >
            <Text style={styles.heroButtonText}>Browse All Events</Text>
          </TouchableOpacity>
        </View>
      </View>

      {events.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <Carousel items={events.slice(0, 4)} />
        </View>
      ) : (
        <View style={[styles.section, styles.centered]}>
          <Text style={styles.sectionTitle}>No events found</Text>
          <Text style={styles.subtleText}>
            Try adjusting your search or check back later
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
          >
            <Text style={styles.retryButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      )}

      {events.length > 0 && (
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Latest Events</Text>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => router.push("/(tabs)/events")}
            >
              <Text style={styles.viewMoreText}>View More</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {events.slice(0, 4).map((event) => (
              <EventCard
                key={event._id}
                id={event._id}
                title={event.title}
                location={event.location}
                img={event.imageUrl}
                time={event.time}
                date={event.date}
                categories={event.categories}
                description={event.description}
                containerStyle={styles.gridCard}
              />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#ef4444",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  hero: {
    height: 380,
    justifyContent: "center",
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(30,10,60,0.45)",
  },
  heroContent: {
    padding: 24,
    alignItems: "center",
    gap: 14,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
  heroButton: {
    backgroundColor: "#9333ea",
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 6,
  },
  heroButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    paddingHorizontal: 40,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f1147",
    marginBottom: 12,
  },
  subtleText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  rowBetween: {
    flexDirection: "row",
    marginVertical: 20,
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewMoreButton: {
    backgroundColor: "#9333ea",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  viewMoreText: {
    color: "#fff",
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridCard: {
    width: "47%",
  },
});
