import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useUser } from "@/context/UserContext";
import api, { Booking } from "@/lib/api";

function ProfileContent() {
  const { user, logoutUser } = useUser();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserBookings = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await api.get<Booking[]>(`/bookings/user/${user.id}`);
      setUserBookings(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchUserBookings();
  }, [user]);

  const cancelBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      await api.put(`/bookings/cancel/${bookingId}`);
      setUserBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to cancel booking");
      console.error("Error canceling booking:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  if (!user) return null;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.listContent}
      data={user.role !== "admin" ? userBookings : []}
      keyExtractor={(item) => item._id}
      ListHeaderComponent={
        <View>
          <View style={styles.profileCard}>
            <View style={styles.profileRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{user.name || user.username}</Text>
                <Text style={styles.email}>{user.email}</Text>
                {user.role !== "admin" && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {userBookings.length} Bookings
                    </Text>
                  </View>
                )}
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>

          {user.role !== "admin" && (
            <Text style={styles.sectionTitle}>Your Bookings</Text>
          )}

          {user.role !== "admin" && isLoading && (
            <ActivityIndicator
              size="large"
              color="#9333ea"
              style={{ marginTop: 20 }}
            />
          )}

          {user.role !== "admin" && !isLoading && error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
        </View>
      }
      ListEmptyComponent={
        user.role !== "admin" && !isLoading && !error ? (
          <View style={styles.emptyState}>
            <Text style={styles.subtleText}>No Bookings Found</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/events")}>
              <Text style={styles.linkText}>Browse Events</Text>
            </TouchableOpacity>
          </View>
        ) : null
      }
      renderItem={({ item: booking }) => (
        <TouchableOpacity
          style={styles.bookingCard}
          onPress={() => router.push(`/event/${booking.eventId._id}`)}
        >
          {booking.eventId?.imageUrl && (
            <Image
              source={{ uri: booking.eventId.imageUrl }}
              style={styles.bookingImage}
              contentFit="cover"
            />
          )}
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={styles.bookingTitle}>
              {booking.eventId?.title || "Event"}
            </Text>
            <Text style={styles.bookingDetail}>
              Date: {new Date(booking.date).toLocaleDateString()}
            </Text>
            <Text style={styles.bookingDetail}>Time: {booking.time}</Text>
            <Text style={styles.bookingDetail}>
              Location: {booking.location}
            </Text>
            <Text style={styles.bookingDetail}>Seats: {booking.seats}</Text>
            <Text style={styles.bookingDetail}>
              Total: ${(booking.price || 0).toFixed(2)}
            </Text>
            <Text
              style={[
                styles.bookingStatus,
                booking.status === "cancelled"
                  ? styles.statusCancelled
                  : styles.statusActive,
              ]}
            >
              Status: {booking.status}
            </Text>
            {booking.status !== "cancelled" && (
              <TouchableOpacity
                disabled={isLoading}
                onPress={(e) => {
                  e.stopPropagation();
                  cancelBooking(booking._id);
                }}
              >
                <Text style={styles.cancelText}>
                  {isLoading ? "Processing..." : "Cancel Booking"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
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
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#dbeafe",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#1e40af",
    fontSize: 13,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#dc2626",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  errorText: {
    color: "#ef4444",
    marginTop: 8,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  subtleText: {
    color: "#6b7280",
  },
  linkText: {
    color: "#2563eb",
    fontWeight: "600",
  },
  bookingCard: {
    flexDirection: "row",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 16,
    marginBottom: 16,
  },
  bookingImage: {
    width: 110,
    height: 90,
    borderRadius: 10,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  bookingDetail: {
    fontSize: 13,
    color: "#4b5563",
  },
  bookingStatus: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  statusActive: {
    color: "#16a34a",
  },
  statusCancelled: {
    color: "#ef4444",
  },
  cancelText: {
    color: "#dc2626",
    fontWeight: "600",
    fontSize: 13,
    marginTop: 6,
  },
});
