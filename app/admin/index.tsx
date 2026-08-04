import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import EventForm from "@/components/admin/EventForm";
import EventsList from "@/components/admin/EventsList";
import { AdminEvent, Category, emptyEventForm } from "@/components/admin/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import api, { EventItem } from "@/lib/api";

function AdminPanelContent() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [eventForm, setEventForm] = useState<AdminEvent>(emptyEventForm);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get<Category[]>("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get<EventItem[]>(
          `/events?page=${page}&limit=10`
        );
        setEvents((prev) => (page === 1 ? response.data : [...prev, ...response.data]));
        setHasMore(response.data.length > 0);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };
    fetchEvents();
  }, [page]);

  const handleChange = (field: keyof AdminEvent, value: string) => {
    setEventForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleCategory = (name: string) => {
    setEventForm((prev) => {
      const has = prev.categories.includes(name);
      return {
        ...prev,
        categories: has
          ? prev.categories.filter((c) => c !== name)
          : [...prev.categories, name],
      };
    });
  };

  const resetForm = () => setEventForm(emptyEventForm);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...eventForm,
        price: Number(eventForm.price),
        availableSeats: Number(eventForm.availableSeats),
      };

      if (eventForm._id) {
        await api.put(`/events/${eventForm._id}`, payload);
      } else {
        await api.post("/events", payload);
      }

      const response = await api.get<EventItem[]>(
        `/events?page=1&limit=${page * 10}`
      );
      setEvents(response.data);
      resetForm();
    } catch (error: any) {
      console.error("Error saving event:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to save event");
    }
  };

  const handleDeleteEvent = (id: string) => {
    Alert.alert(
      "Delete event",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/events/${id}`);
              setEvents((prev) => prev.filter((event) => event._id !== id));
            } catch (error) {
              console.error("Error deleting event:", error);
            }
          },
        },
      ]
    );
  };

  const handleEditEvent = (id: string) => {
    const eventToEdit = events.find((event) => event._id === id);
    if (eventToEdit) {
      setEventForm({
        _id: eventToEdit._id,
        name: eventToEdit.title,
        description: eventToEdit.description,
        categories: eventToEdit.categories,
        date: eventToEdit.date,
        time: eventToEdit.time || "",
        location: eventToEdit.location,
        price: String(eventToEdit.price),
        image: eventToEdit.imageUrl || eventToEdit.image || "",
        availableSeats: String(
          eventToEdit.availableSeats ?? eventToEdit.availableTickets ?? ""
        ),
      });
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleLoadMore = () => setPage((prev) => prev + 1);

  const filteredEvents = events.filter((event) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.title?.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower) ||
      event.categories?.some((cat) => cat.toLowerCase().includes(searchLower)) ||
      event.location?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <EventsList
        events={filteredEvents}
        onDelete={handleDeleteEvent}
        onEdit={handleEditEvent}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onLoadMore={handleLoadMore}
        hasMoreEvents={hasMore && !searchTerm}
      />

      <EventForm
        eventForm={eventForm}
        categories={categories}
        onChange={handleChange}
        onToggleCategory={handleToggleCategory}
        onSubmit={handleSubmit}
        onReset={resetForm}
        isEditing={!!eventForm._id}
      />
    </ScrollView>
  );
}

export default function AdminPanel() {
  return (
    <ProtectedRoute adminOnly>
      <AdminPanelContent />
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  content: {
    padding: 16,
    gap: 20,
  },
});
