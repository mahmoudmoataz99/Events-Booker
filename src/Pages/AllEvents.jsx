import React, { useEffect, useState } from 'react';
import EventCard from '../Components/EventCard';
import Search from '../Components/Search';
import axios from 'axios';

function AllEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://tickets-books.vercel.app/events');
        const formattedEvents = response.data.map(event => ({
          ...event,
          categories: Array.isArray(event.categories) ? event.categories : [],
          description: event.description || 'No description available',
          date: event.date || 'Date not specified',
          time: event.time || 'Time not specified',
          location: event.location || 'Location not specified'
        }));
        setEvents(formattedEvents);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    getEvents();
  }, []);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold text-red-500">
          Error: {error}
          <button onClick={() => window.location.reload()} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Browse All Events</h1>
      </div>

      <div className="mb-8">
        <Search
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          placeholder="Search events by name, location or description..."
        />
      </div>

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {filteredEvents.map(event => (
            <EventCard
              key={event._id}
              title={event.name}
              id={event._id}
              location={event.location}
              time={event.time}
              img={event.image}
              categories={event.categories}
              date={event.date}
              description={event.description.substring(0, 50) + '...'}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No events found</h2>
          <p className="mb-4">Try adjusting your search or check back later</p>
          <button
            onClick={() => setSearchTerm('')}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Clear Search
          </button>
        </div>
      )}
    </main>
  );
}

export default AllEvents;