import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventForm from './EventForm';
import EventsList from './EventsList';

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    categories: [],
    date: '',
    time: '',
    location: '',
    price: '',
    image: '',
    availableSeats: ''
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://tickets-books.vercel.app/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://tickets-books.vercel.app/events?page=${page}&limit=10`);
        setEvents(prev => page === 1 ? response.data : [...prev, ...response.data]);
        setHasMore(response.data.length > 0);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [page]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "categories") {
      const updatedCategories = checked
        ? [...eventForm.categories, value]
        : eventForm.categories.filter(category => category !== value);
      setEventForm({ ...eventForm, categories: updatedCategories });
    } else {
      setEventForm({ ...eventForm, [name]: value });
    }
  };

  const resetForm = () => {
    setEventForm({
      name: '',
      description: '',
      categories: [],
      date: '',
      time: '',
      location: '',
      price: '',
      image: '',
      availableSeats: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...eventForm,
        price: Number(eventForm.price),
        availableSeats: Number(eventForm.availableSeats),
      };

      if (eventForm._id) {
        await axios.put(`https://tickets-books.vercel.app/events/${eventForm._id}`, payload);
      } else {
        await axios.post('https://tickets-books.vercel.app/events', payload);
      }

      const response = await axios.get(`https://tickets-books.vercel.app/events?page=1&limit=${page * 10}`);
      setEvents(response.data);
      resetForm();
    } catch (error) {
      console.error('Error saving event:', error);
      alert(error.response?.data?.message || 'Failed to save event');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`https://tickets-books.vercel.app/events/${id}`);
        setEvents(events.filter(event => event._id !== id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleEditEvent = (id) => {
    const eventToEdit = events.find(event => event._id === id);
    if (eventToEdit) {
      setEventForm(eventToEdit);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); 
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  // Filter events based on search term
  const filteredEvents = events.filter(event => {
    const searchLower = searchTerm.toLowerCase();
    return (
      event.name.toLowerCase().includes(searchLower) ||
      event.description.toLowerCase().includes(searchLower) ||
      event.categories.some(cat => cat.toLowerCase().includes(searchLower)) ||
      event.location.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EventsList
            events={filteredEvents}
            onDelete={handleDeleteEvent}
            onEdit={handleEditEvent}
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onLoadMore={handleLoadMore}
            hasMoreEvents={hasMore && !searchTerm}
          />
        </div>
        
        <div>
          <EventForm
            eventForm={eventForm}
            categories={categories}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
            isEditing={!!eventForm._id}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;