import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EventCard from "@/components/EventCard";
import SearchBar from "@/components/SearchBar";
import api, { EventItem } from "@/lib/api";

export default function SearchResults() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const searchQuery = (q || "").toLowerCase();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get<EventItem[]>("/events");
        const eventsWithDefaults = response.data.map((event) => ({
          ...event,
          categories: Array.isArray(event.categories) ? event.categories : [],
          description: event.description || "No description available",
          date: event.date || "Date not specified",
          time: event.time || "Time not specified",
          location: event.location || "Location not specified",
        }));
        setEvents(eventsWithDefaults);
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Failed to load events"
        );
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const filtered = events.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchQuery) ||
          event.location?.toLowerCase().includes(searchQuery) ||
          event.description?.toLowerCase().includes(searchQuery) ||
          event.categories.some((cat) => cat?.toLowerCase().includes(searchQuery))
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#9333ea" />
        <Text>Loading events...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      data={filteredEvents}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={
        <View>
          <SearchBar navigateOnSubmit placeholder="Search events..." />
          <View style={styles.headerRow}>
            <Text style={styles.resultsTitle}>
              Search Results for{" "}
              <Text style={styles.resultsQuery}>{q}</Text>
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.allEventsButton}
                onPress={() => router.push("/(tabs)/events")}
              >
                <Text style={styles.allEventsButtonText}>All Events</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      }
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          {searchQuery
            ? "No events found matching your search."
            : "No events available."}
        </Text>
      }
      renderItem={({ item }) => (
        <EventCard
          id={item._id}
          title={item.title}
          location={item.location}
          time={item.time}
          img={item.imageUrl}
          date={item.date}
          categories={item.categories}
          description={item.description.substring(0, 50) + "..."}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    backgroundColor: "#fff",
  },
  listContent: {
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  errorText: {
    color: "#ef4444",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 8,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f1147",
    flexShrink: 1,
  },
  resultsQuery: {
    fontWeight: "300",
  },
  allEventsButton: {
    backgroundColor: "#9333ea",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  allEventsButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 32,
    color: "#4b5563",
  },
});
