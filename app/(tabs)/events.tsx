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

export default function AllEvents() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<EventItem[]>("/events");
      const formattedEvents = response.data.map((event) => ({
        ...event,
        categories: Array.isArray(event.categories) ? event.categories : [],
        description: event.description || "No description available",
        date: event.date || "Date not specified",
        time: event.time || "Time not specified",
        location: event.location || "Location not specified",
      }));
      setEvents(formattedEvents);
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

  const filteredEvents = events?.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

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
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      data={filteredEvents}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={
        <View>
          <Text style={styles.title}>Browse All Events</Text>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            placeholder="Search events by name, location or description..."
          />
        </View>
      }
      ListEmptyComponent={
        <View style={styles.centered}>
          <Text style={styles.sectionTitle}>No events found</Text>
          <Text style={styles.subtleText}>
            Try adjusting your search or check back later
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setSearchTerm("")}
          >
            <Text style={styles.retryButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      }
      renderItem={({ item }) => (
        <EventCard
          id={item._id}
          title={item.title}
          location={item.location}
          time={item.time}
          img={item.imageUrl}
          categories={item.categories}
          date={item.date}
          description={item.description.substring(0, 60) + "..."}
          containerStyle={styles.gridCard}
        />
      )}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContent: {
    padding: 16,
  },
  columnWrapper: {
    gap: 12,
    marginBottom: 12,
  },
  gridCard: {
    flex: 1,
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1f1147",
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  subtleText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
