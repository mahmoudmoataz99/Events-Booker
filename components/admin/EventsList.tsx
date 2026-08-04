import { Image } from "expo-image";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { EventItem } from "@/lib/api";

interface EventsListProps {
  events: EventItem[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onLoadMore: () => void;
  hasMoreEvents: boolean;
}

export default function EventsList({
  events,
  onDelete,
  onEdit,
  searchTerm,
  onSearchChange,
  onLoadMore,
  hasMoreEvents,
}: EventsListProps) {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedEvent(expandedEvent === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>All Events</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={onSearchChange}
        placeholder="Search events..."
      />

      <View style={styles.list}>
        {events.length === 0 ? (
          <Text style={styles.emptyText}>No events found</Text>
        ) : (
          events.map((event) => (
            <View key={event._id} style={styles.eventCard}>
              <View style={styles.eventRow}>
                <Image
                  source={{ uri: event.image || event.imageUrl }}
                  style={styles.eventImage}
                  contentFit="cover"
                />
                <View style={styles.flex1}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.eventTitle} numberOfLines={1}>
                      {event.title}
                    </Text>
                  </View>
                  <View style={styles.actionsRow}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => onEdit(event._id)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => onDelete(event._id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.chipsRow}>
                    {event.categories.map((category, index) => (
                      <View key={index} style={styles.chip}>
                        <Text style={styles.chipText}>{category}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.metaText}>
                    {new Date(event.date)
                      .toUTCString()
                      .replace("00:00:00 GMT", "")}{" "}
                    • {event.time}
                  </Text>
                  <Text style={styles.metaText}>{event.location}</Text>
                  <View style={styles.rowBetween}>
                    <Text style={styles.price}>${event.price}</Text>
                    <Text style={styles.seats}>
                      {event.availableSeats ?? event.availableTickets} seats
                      available
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity onPress={() => toggleExpand(event._id)}>
                <Text style={styles.showMore}>
                  {expandedEvent === event._id ? "Show Less" : "Show More"}
                </Text>
              </TouchableOpacity>

              {expandedEvent === event._id && (
                <View style={styles.descriptionBlock}>
                  <Text style={styles.descriptionHeading}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {event.description}
                  </Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {hasMoreEvents && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={onLoadMore}>
          <Text style={styles.loadMoreText}>Load More Events</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  list: {
    gap: 14,
  },
  emptyText: {
    color: "#6b7280",
  },
  eventCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    gap: 6,
  },
  eventRow: {
    flexDirection: "row",
    gap: 12,
  },
  eventImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  flex1: {
    flex: 1,
    gap: 4,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "700",
    flexShrink: 1,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#dbeafe",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  editButtonText: {
    color: "#1e40af",
    fontSize: 12,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  deleteButtonText: {
    color: "#991b1b",
    fontSize: 12,
    fontWeight: "600",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    backgroundColor: "#f3f4f6",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  chipText: {
    fontSize: 11,
    color: "#374151",
  },
  metaText: {
    fontSize: 13,
    color: "#4b5563",
  },
  price: {
    fontWeight: "700",
  },
  seats: {
    fontSize: 12,
    color: "#6b7280",
  },
  showMore: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  descriptionBlock: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    gap: 4,
  },
  descriptionHeading: {
    fontWeight: "600",
  },
  descriptionText: {
    color: "#374151",
  },
  loadMoreButton: {
    alignSelf: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 8,
  },
  loadMoreText: {
    color: "#1f2937",
    fontWeight: "600",
  },
});
