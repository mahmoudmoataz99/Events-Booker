import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "@/context/UserContext";
import api, { EventItem } from "@/lib/api";

export default function EventDetails() {
  const { id: eventId } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [hasBooking, setHasBooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seatsRequested, setSeatsRequested] = useState("1");
  const { isAuthenticated, user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const eventResponse = await api.get<EventItem>(`/events/${eventId}`);
        setEvent(eventResponse.data);

        if (user) {
          try {
            const bookingResponse = await api.get(
              `/bookings/checkBook/${user.id}/${eventId}`
            );
            setHasBooking(bookingResponse.data === true);
          } catch {
            setHasBooking(false);
          }
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || err.message || "Failed to load event"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, user]);

  const handleBooking = async () => {
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }

    if (!event) return;

    if (hasBooking) {
      Alert.alert("Already booked", "You have already booked this event.");
      return;
    }

    const seats = Math.max(1, parseInt(seatsRequested, 10) || 1);

    if (seats > event.availableTickets) {
      Alert.alert("Not enough seats", `Only ${event.availableTickets} seats available!`);
      return;
    }

    try {
      setLoading(true);
      await api.post("/bookings/create", {
        eventId: event._id,
        userId: user.id,
        seats,
      });

      setHasBooking(true);
      Alert.alert(
        "Success",
        `Successfully booked ${seats} seat(s) for ${event.title}`,
        [{ text: "OK", onPress: () => router.push("/(tabs)/profile") }]
      );
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Booking failed");
      Alert.alert("Booking failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !event) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#9333ea" />
        <Text style={styles.heading}>Loading event...</Text>
      </View>
    );
  }

  if (error && !event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.heading}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/events")}>
          <Text style={styles.link}>Back to events</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.heading}>Event Not Found</Text>
        <Text>Please check the link or go back to the events list.</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/events")}>
          <Text style={styles.link}>Back to events</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: event.imageUrl }}
        style={styles.image}
        contentFit="cover"
      />

      <Text style={styles.title}>{event.title}</Text>

      {event.categories.length > 0 && (
        <View style={styles.categoriesRow}>
          {event.categories.map((cat, index) => (
            <View key={index} style={styles.categoryPill}>
              <Text style={styles.categoryText}>{cat}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.description}>{event.description}</Text>

      <View style={styles.detailsBlock}>
        <Text style={styles.detail}>
          <Text style={styles.bold}>Date: </Text>
          {new Date(event.date).toLocaleDateString()}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>Time: </Text>
          {new Date(event.date).toLocaleTimeString()}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>Location: </Text>
          {event.location}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>Price: </Text>${event.price.toFixed(2)}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>Seats Available: </Text>
          {event.availableTickets}
        </Text>
      </View>

      {hasBooking && (
        <View style={styles.bookedBanner}>
          <Text style={styles.bookedBannerText}>
            You already have a booking for this event.
          </Text>
        </View>
      )}

      <View style={styles.seatsBlock}>
        <Text style={styles.bold}>Number of Seats:</Text>
        <TextInput
          style={styles.seatsInput}
          value={seatsRequested}
          onChangeText={(text) => setSeatsRequested(text.replace(/[^0-9]/g, ""))}
          keyboardType="number-pad"
          editable={!hasBooking}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        {isAuthenticated ? (
          hasBooking ? (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <Text style={styles.primaryButtonText}>View Your Booking</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (loading || event.availableTickets === 0) &&
                  styles.disabledButton,
              ]}
              onPress={handleBooking}
              disabled={loading || event.availableTickets === 0}
            >
              <Text style={styles.primaryButtonText}>
                {loading
                  ? "Processing..."
                  : event.availableTickets === 0
                  ? "Sold Out"
                  : "Book Now"}
              </Text>
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.primaryButtonText}>Login to book</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
    gap: 14,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  errorText: {
    color: "#ef4444",
  },
  link: {
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1f1147",
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryPill: {
    backgroundColor: "#e9d5ff",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 13,
    color: "#581c87",
  },
  description: {
    fontSize: 15,
    color: "#4b5563",
    lineHeight: 22,
  },
  detailsBlock: {
    gap: 6,
  },
  detail: {
    fontSize: 15,
    color: "#111",
  },
  bold: {
    fontWeight: "700",
  },
  bookedBanner: {
    backgroundColor: "#dcfce7",
    borderRadius: 8,
    padding: 12,
  },
  bookedBannerText: {
    color: "#166534",
  },
  seatsBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  seatsInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: 70,
    textAlign: "center",
  },
  primaryButton: {
    backgroundColor: "#9333ea",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#9ca3af",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
